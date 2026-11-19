import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

// Personal carbon budget benchmark: ~6.6 kg CO2e/day aligns with the IPCC 1.5C pathway
// (≈2.4 t/yr per person by 2030). Score scales linearly: 0 kg => 100, BUDGET => 70, 2x BUDGET => 30.
const DAILY_BUDGET_KG = 6.6;

function isoDay(d: Date) { return d.toISOString().slice(0, 10); }
function startOfWeek(d = new Date()) {
  const x = new Date(d); const day = x.getUTCDay(); const diff = (day + 6) % 7; // Mon=0
  x.setUTCDate(x.getUTCDate() - diff); x.setUTCHours(0,0,0,0); return x;
}
function daysAgoISO(days: number) {
  const d = new Date(); d.setUTCDate(d.getUTCDate() - days); return isoDay(d);
}

type Entry = { entry_date: string; category: string; co2_kg: number };

function scoreFromKg(kg: number) {
  // Smooth piecewise: budget=70, 0=100, 2x=30, 3x=10
  if (kg <= 0) return 100;
  if (kg <= DAILY_BUDGET_KG) return Math.round(100 - (kg / DAILY_BUDGET_KG) * 30);
  if (kg <= DAILY_BUDGET_KG * 2) return Math.round(70 - ((kg - DAILY_BUDGET_KG) / DAILY_BUDGET_KG) * 40);
  return Math.max(0, Math.round(30 - ((kg - DAILY_BUDGET_KG * 2) / DAILY_BUDGET_KG) * 20));
}

function grade(score: number) {
  if (score >= 85) return { label: "Excellent", tone: "emerald" };
  if (score >= 70) return { label: "On track", tone: "teal" };
  if (score >= 50) return { label: "Needs work", tone: "amber" };
  return { label: "High impact", tone: "rose" };
}

type SbClient = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: unknown) => any;
      gte: (col: string, val: unknown) => any;
    };
  };
};

async function fetchEntries(supabase: SbClient, userId: string, fromIso: string, includeSample: boolean): Promise<Entry[]> {
  let q: any = supabase
    .from("carbon_entries")
    .select("entry_date,category,co2_kg")
    .eq("user_id", userId)
    .gte("entry_date", fromIso);
  if (!includeSample) q = q.eq("is_sample", false);
  const { data } = await q;
  return ((data ?? []) as { entry_date: string; category: string; co2_kg: number | string }[]).map((r) => ({
    entry_date: r.entry_date,
    category: r.category,
    co2_kg: Number(r.co2_kg),
  }));
}


// -------- Daily Score --------

export type DailyScoreResult = {
  date: string;
  score: number;
  grade: { label: string; tone: string };
  todayKg: number;
  budgetKg: number;
  vsYesterday: { kg: number; pct: number | null };
  vs7dAvg: { kg: number; pct: number | null };
  byCategory: { category: string; kg: number; share: number }[];
  streak: number;
  insights: string[];
  hasData: boolean;
};

export const getDailyScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { includeSample?: boolean }) => ({ includeSample: input?.includeSample !== false }))
  .handler(async ({ data, context }): Promise<DailyScoreResult> => {
    const { userId } = context;
    const supabase = context.supabase;
    const today = isoDay(new Date());
    const from = daysAgoISO(14);
    const entries = await fetchEntries(supabase as unknown as SbClient, userId, from, data.includeSample);

    const byDay = new Map<string, number>();
    for (const e of entries) byDay.set(e.entry_date, (byDay.get(e.entry_date) ?? 0) + e.co2_kg);
    const todayKg = byDay.get(today) ?? 0;
    const yesterday = daysAgoISO(1);
    const yKg = byDay.get(yesterday) ?? 0;

    const last7Days = Array.from({ length: 7 }, (_, i) => daysAgoISO(i + 1));
    const last7Total = last7Days.reduce((s, d) => s + (byDay.get(d) ?? 0), 0);
    const last7Avg = last7Total / 7;

    const byCatMap = new Map<string, number>();
    for (const e of entries.filter((x) => x.entry_date === today)) byCatMap.set(e.category, (byCatMap.get(e.category) ?? 0) + e.co2_kg);
    const byCategory = [...byCatMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, kg]) => ({ category, kg, share: todayKg ? kg / todayKg : 0 }));

    // Streak: consecutive days (ending yesterday) under budget
    let streak = 0;
    for (let i = 1; i <= 30; i++) {
      const d = daysAgoISO(i);
      const kg = byDay.get(d) ?? 0;
      if (kg > 0 && kg <= DAILY_BUDGET_KG) streak++; else break;
    }

    const score = scoreFromKg(todayKg);
    const insights: string[] = [];
    if (todayKg === 0) insights.push("No activity logged today — track entries to get an accurate score.");
    else if (todayKg <= DAILY_BUDGET_KG) insights.push(`You're ${(DAILY_BUDGET_KG - todayKg).toFixed(1)} kg under the 1.5°C daily budget.`);
    else insights.push(`You're ${(todayKg - DAILY_BUDGET_KG).toFixed(1)} kg over the 1.5°C daily budget.`);
    if (byCategory[0]) insights.push(`Top driver today: ${byCategory[0].category} (${(byCategory[0].share * 100).toFixed(0)}%).`);
    if (streak >= 3) insights.push(`${streak}-day streak under budget — keep it going.`);

    return {
      date: today,
      score,
      grade: grade(score),
      todayKg: Number(todayKg.toFixed(2)),
      budgetKg: DAILY_BUDGET_KG,
      vsYesterday: { kg: Number((todayKg - yKg).toFixed(2)), pct: yKg ? (todayKg - yKg) / yKg : null },
      vs7dAvg: { kg: Number((todayKg - last7Avg).toFixed(2)), pct: last7Avg ? (todayKg - last7Avg) / last7Avg : null },
      byCategory,
      streak,
      insights,
      hasData: entries.length > 0,
    };
  });

// -------- Weekly Plan (AI) --------

export type WeeklyPlanDay = { day: string; focus: string; target_kg: number; actions: string[] };
export type WeeklyPlanResult = {
  weekOf: string;
  baseline7dKg: number;
  targetReductionPct: number;
  goalKg: number;
  topCategories: { category: string; kg: number }[];
  days: WeeklyPlanDay[];
  rationale: string;
  hasData: boolean;
};

export const getWeeklyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { includeSample?: boolean }) => ({ includeSample: input?.includeSample !== false }))
  .handler(async ({ data, context }): Promise<WeeklyPlanResult> => {
    const { userId } = context;
    const supabase = context.supabase;
    const from = daysAgoISO(14);
    const entries = await fetchEntries(supabase as unknown as SbClient, userId, from, data.includeSample);

    const last7 = entries.filter((e) => e.entry_date >= daysAgoISO(7));
    const baseline = last7.reduce((s, e) => s + e.co2_kg, 0);
    const catMap = new Map<string, number>();
    for (const e of last7) catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.co2_kg);
    const topCategories = [...catMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, kg]) => ({ category, kg: Number(kg.toFixed(2)) }));

    const targetReductionPct = 15;
    const goalKg = Number((baseline * (1 - targetReductionPct / 100)).toFixed(2));
    const monday = startOfWeek();

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let days: WeeklyPlanDay[] = [];
    let rationale = "";

    const key = process.env.LOVABLE_API_KEY;
    if (key && baseline > 0) {
      try {
        const gateway = createLovableAiGatewayProvider(key);
        const { text } = await generateText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are EcoTrack's Sustainability OS planner. Build a personalised 7-day low-carbon plan grounded in the user's real data. Respond ONLY with JSON: {"rationale": string, "days":[{"day":"Mon|Tue|...","focus": string,"target_kg": number,"actions":[string,string,string]}]}. 7 entries. Each action concrete, doable in <30 min, under 110 chars. target_kg sums to about ${goalKg}. rationale <= 60 words.`,
          prompt: `Baseline last 7 days: ${baseline.toFixed(2)} kg CO2. Target: ${goalKg} kg (${targetReductionPct}% cut). Top categories: ${JSON.stringify(topCategories)}.`,
        });
        const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed.days)) days = parsed.days.slice(0, 7);
        if (typeof parsed.rationale === "string") rationale = parsed.rationale;
      } catch (err) {
        console.error("[os] weekly plan AI failed", err);
      }
    }

    if (days.length === 0) {
      days = dayNames.map((d) => ({
        day: d,
        focus: baseline > 0 ? "Maintain low-carbon baseline" : "Start tracking daily activity",
        target_kg: Number((goalKg / 7).toFixed(2)),
        actions: baseline > 0
          ? ["Log every transport trip", "Choose one plant-based meal", "Cut one electronic device hour"]
          : ["Open the Carbon Tracker and log today's commute", "Log one meal", "Log home electricity for today"],
      }));
      if (!rationale) rationale = baseline > 0
        ? "Plan generated from your category mix with an even daily split."
        : "Start logging activities to unlock an AI-personalised weekly plan.";
    }

    return {
      weekOf: isoDay(monday),
      baseline7dKg: Number(baseline.toFixed(2)),
      targetReductionPct,
      goalKg,
      topCategories,
      days,
      rationale,
      hasData: last7.length > 0,
    };
  });

// -------- Monthly Report (AI narrative) --------

export type MonthlyReportResult = {
  periodFrom: string;
  periodTo: string;
  totalKg: number;
  avgPerDayKg: number;
  daysLogged: number;
  monthOverMonth: { kg: number; pct: number | null };
  byCategory: { category: string; kg: number; share: number }[];
  highlights: string[];
  risks: string[];
  nextMonthFocus: string[];
  summary: string;
  hasData: boolean;
};

export const getMonthlyReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { includeSample?: boolean }) => ({ includeSample: input?.includeSample !== false }))
  .handler(async ({ data, context }): Promise<MonthlyReportResult> => {
    const { userId } = context;
    const supabase = context.supabase;
    const from60 = daysAgoISO(60);
    const entries = await fetchEntries(supabase as unknown as SbClient, userId, from60, data.includeSample);

    const cutoff = daysAgoISO(30);
    const current = entries.filter((e) => e.entry_date >= cutoff);
    const prior = entries.filter((e) => e.entry_date < cutoff);

    const sum = (arr: Entry[]) => arr.reduce((s, e) => s + e.co2_kg, 0);
    const totalKg = sum(current);
    const priorKg = sum(prior);
    const daysLoggedSet = new Set(current.map((e) => e.entry_date));
    const avgPerDayKg = totalKg / 30;

    const catMap = new Map<string, number>();
    for (const e of current) catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.co2_kg);
    const byCategory = [...catMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, kg]) => ({ category, kg: Number(kg.toFixed(2)), share: totalKg ? kg / totalKg : 0 }));

    let summary = "";
    let highlights: string[] = [];
    let risks: string[] = [];
    let nextMonthFocus: string[] = [];

    const key = process.env.LOVABLE_API_KEY;
    if (key && totalKg > 0) {
      try {
        const gateway = createLovableAiGatewayProvider(key);
        const { text } = await generateText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are a sustainability analyst producing a monthly report. Return ONLY JSON: {"summary": string, "highlights": string[3-5], "risks": string[2-4], "nextMonthFocus": string[3-5]}. Ground everything in the data. summary <= 80 words.`,
          prompt: JSON.stringify({
            totalKg: Number(totalKg.toFixed(2)),
            priorKg: Number(priorKg.toFixed(2)),
            avgPerDayKg: Number(avgPerDayKg.toFixed(2)),
            byCategory,
            daysLogged: daysLoggedSet.size,
          }),
        });
        const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleaned);
        summary = parsed.summary ?? "";
        highlights = Array.isArray(parsed.highlights) ? parsed.highlights : [];
        risks = Array.isArray(parsed.risks) ? parsed.risks : [];
        nextMonthFocus = Array.isArray(parsed.nextMonthFocus) ? parsed.nextMonthFocus : [];
      } catch (err) {
        console.error("[os] monthly AI failed", err);
      }
    }

    if (!summary) {
      summary = current.length
        ? `In the last 30 days you logged ${current.length} activities for ${totalKg.toFixed(1)} kg CO₂ (avg ${avgPerDayKg.toFixed(2)} kg/day).`
        : `No activity in the last 30 days. Start tracking to unlock a real monthly report.`;
    }

    return {
      periodFrom: cutoff,
      periodTo: isoDay(new Date()),
      totalKg: Number(totalKg.toFixed(2)),
      avgPerDayKg: Number(avgPerDayKg.toFixed(2)),
      daysLogged: daysLoggedSet.size,
      monthOverMonth: { kg: Number((totalKg - priorKg).toFixed(2)), pct: priorKg ? (totalKg - priorKg) / priorKg : null },
      byCategory,
      highlights,
      risks,
      nextMonthFocus,
      summary,
      hasData: current.length > 0,
    };
  });
