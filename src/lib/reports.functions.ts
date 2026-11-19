import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export type ReportType = "carbon" | "sustainability" | "esg" | "executive";

export interface ReportSection {
  heading: string;
  body: string;
}
export interface ReportMetric {
  label: string;
  value: string;
  hint?: string;
}
export interface ReportTable {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}
export interface ReportPayload {
  type: ReportType;
  title: string;
  subtitle: string;
  generatedAt: string;
  user: { name: string; email: string };
  period: { from: string; to: string };
  metrics: ReportMetric[];
  tables: ReportTable[];
  narrative: ReportSection[];
  recommendations: string[];
  rawEntries: {
    id: string;
    entry_date: string;
    category: string;
    subcategory: string | null;
    amount: number;
    unit: string | null;
    co2_kg: number;
    notes: string | null;
  }[];
}

const TYPE_META: Record<ReportType, { title: string; subtitle: string; systemFocus: string }> = {
  carbon: {
    title: "Carbon Footprint Report",
    subtitle: "Detailed emissions analysis from logged activity",
    systemFocus:
      "Focus on scope-aligned emissions, category hotspots, trends over the period, and quantified reduction levers.",
  },
  sustainability: {
    title: "Sustainability Report",
    subtitle: "Holistic view of progress, habits and goals",
    systemFocus:
      "Cover progress against goals, challenge participation, habit consistency, and a forward-looking sustainability plan.",
  },
  esg: {
    title: "ESG Disclosure Report",
    subtitle: "Environmental, Social & Governance summary",
    systemFocus:
      "Frame metrics against ESG pillars: Environmental (emissions, energy, waste), Social (community engagement, challenges joined), Governance (goal tracking, accountability). Use disclosure tone.",
  },
  executive: {
    title: "Executive Summary",
    subtitle: "One-page briefing of key climate KPIs",
    systemFocus:
      "Write for a C-suite reader. Lead with the headline number, top 3 movers, biggest risk, and one bold recommendation. Avoid jargon.",
  },
};

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export const generateReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { type: ReportType; days?: number; includeSample?: boolean }) => {
    const allowed: ReportType[] = ["carbon", "sustainability", "esg", "executive"];
    if (!allowed.includes(input?.type)) throw new Error("Invalid report type");
    const days = Math.min(Math.max(input.days ?? 90, 7), 365);
    return { type: input.type, days, includeSample: input.includeSample !== false };
  })
  .handler(async ({ data, context }): Promise<ReportPayload> => {
    const { supabase, userId } = context;
    const from = isoDaysAgo(data.days);
    const to = new Date().toISOString().slice(0, 10);

    let entriesQ = supabase
      .from("carbon_entries")
      .select("id,entry_date,category,subcategory,amount,unit,co2_kg,notes")
      .eq("user_id", userId)
      .gte("entry_date", from)
      .lte("entry_date", to)
      .order("entry_date", { ascending: false });
    let goalsQ = supabase.from("goals").select("title,target_value,current_value,unit,status,deadline").eq("user_id", userId);
    let challengesQ = supabase
      .from("user_challenges")
      .select("status,progress,joined_at,completed_at,challenge:challenges(title,category,co2_reduction_kg)")
      .eq("user_id", userId);

    if (!data.includeSample) {
      entriesQ = entriesQ.eq("is_sample", false);
      goalsQ = goalsQ.eq("is_sample", false);
      challengesQ = challengesQ.eq("is_sample", false);
    }

    const [{ data: profile }, { data: entries }, { data: goals }, { data: userChallenges }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
      entriesQ,
      goalsQ,
      challengesQ,
    ]);


    const { data: authUser } = await supabase.auth.getUser();
    const email = authUser.user?.email ?? "—";
    const name = profile?.full_name ?? email.split("@")[0];

    const rows = entries ?? [];
    const totalCo2 = rows.reduce((s, r) => s + Number(r.co2_kg || 0), 0);
    const byCategory = new Map<string, number>();
    for (const r of rows) byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + Number(r.co2_kg || 0));
    const categoryRows = [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cat, kg]) => [cat, kg.toFixed(2), totalCo2 ? `${((kg / totalCo2) * 100).toFixed(1)}%` : "0%"]);

    const activeGoals = (goals ?? []).filter((g) => g.status === "active").length;
    const completedGoals = (goals ?? []).filter((g) => g.status === "completed").length;
    const completedChallenges = (userChallenges ?? []).filter((c) => c.status === "completed").length;
    const avgPerDay = rows.length ? totalCo2 / Math.max(1, data.days) : 0;

    const meta = TYPE_META[data.type];

    const metrics: ReportMetric[] = [
      { label: "Total CO₂ (kg)", value: totalCo2.toFixed(1), hint: `Last ${data.days} days` },
      { label: "Avg / day", value: `${avgPerDay.toFixed(2)} kg` },
      { label: "Entries logged", value: String(rows.length) },
      { label: "Active goals", value: String(activeGoals) },
      { label: "Completed goals", value: String(completedGoals) },
      { label: "Challenges completed", value: String(completedChallenges) },
    ];

    const tables: ReportTable[] = [
      { title: "Emissions by category", columns: ["Category", "CO₂ (kg)", "Share"], rows: categoryRows },
      {
        title: "Goals",
        columns: ["Title", "Progress", "Status", "Deadline"],
        rows: (goals ?? []).map((g) => [
          g.title,
          `${Number(g.current_value).toFixed(0)} / ${Number(g.target_value).toFixed(0)} ${g.unit ?? ""}`.trim(),
          g.status,
          g.deadline ?? "—",
        ]),
      },
    ];

    // AI narrative — grounded in the real numbers only
    let narrative: ReportSection[] = [];
    let recommendations: string[] = [];

    const key = process.env.LOVABLE_API_KEY;
    if (key && rows.length + (goals?.length ?? 0) + (userChallenges?.length ?? 0) > 0) {
      try {
        const gateway = createLovableAiGatewayProvider(key);
        const dataSummary = JSON.stringify({
          period: { from, to, days: data.days },
          totals: { totalCo2, avgPerDay, entries: rows.length },
          byCategory: Object.fromEntries(byCategory),
          goals,
          challenges: userChallenges,
        });
        const { text } = await generateText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are an enterprise climate analyst writing a ${meta.title}. ${meta.systemFocus} Use ONLY the data provided. Do not invent numbers. Respond as strict JSON with shape {"sections":[{"heading":string,"body":string}],"recommendations":string[]}. 3-5 sections, 3-5 recommendations. Keep each body under 90 words.`,
          prompt: `User: ${name} (${email}). Data:\n${dataSummary}`,
        });
        const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed.sections)) narrative = parsed.sections.slice(0, 8);
        if (Array.isArray(parsed.recommendations)) recommendations = parsed.recommendations.slice(0, 8);
      } catch (err) {
        console.error("[reports] AI narrative failed", err);
      }
    }

    if (narrative.length === 0) {
      narrative = [
        {
          heading: "Summary",
          body: rows.length
            ? `Over the last ${data.days} days you logged ${rows.length} activities totalling ${totalCo2.toFixed(1)} kg CO₂ (avg ${avgPerDay.toFixed(2)} kg/day).`
            : `No activity has been logged in the selected window. Start tracking entries to unlock AI-generated insights.`,
        },
      ];
    }

    return {
      type: data.type,
      title: meta.title,
      subtitle: meta.subtitle,
      generatedAt: new Date().toISOString(),
      user: { name, email },
      period: { from, to },
      metrics,
      tables,
      narrative,
      recommendations,
      rawEntries: rows.map((r) => ({
        id: r.id,
        entry_date: r.entry_date,
        category: r.category,
        subcategory: r.subcategory,
        amount: Number(r.amount),
        unit: r.unit,
        co2_kg: Number(r.co2_kg),
        notes: r.notes,
      })),
    };
  });
