import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Activity, CalendarDays, FileBarChart, Flame, Sparkles, TrendingDown, TrendingUp, RefreshCw, Target, AlertTriangle, CheckCircle2, ArrowRight,
} from "lucide-react";
import {
  getDailyScore, getWeeklyPlan, getMonthlyReport,
  type DailyScoreResult, type WeeklyPlanResult, type MonthlyReportResult,
} from "@/lib/sustainability-os.functions";
import { useIncludeSample } from "@/lib/data-mode";

export const Route = createFileRoute("/app/os")({
  component: SustainabilityOSPage,
});

function SustainabilityOSPage() {
  const [includeSample] = useIncludeSample();
  return (
    <AppShell
      title="Sustainability OS"
      subtitle="Daily score, AI weekly plan, and monthly report — grounded in your real activity"
      actions={<Badge variant="outline" className="gap-1"><Sparkles className="h-3 w-3" />Live AI</Badge>}
    >
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="daily"><Activity className="h-4 w-4 mr-2" />Daily</TabsTrigger>
          <TabsTrigger value="weekly"><CalendarDays className="h-4 w-4 mr-2" />Weekly</TabsTrigger>
          <TabsTrigger value="monthly"><FileBarChart className="h-4 w-4 mr-2" />Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily"><DailyPanel includeSample={includeSample} /></TabsContent>
        <TabsContent value="weekly"><WeeklyPanel includeSample={includeSample} /></TabsContent>
        <TabsContent value="monthly"><MonthlyPanel includeSample={includeSample} /></TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ScoreRing({ score, tone }: { score: number; tone: string }) {
  const r = 64, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const stroke = tone === "emerald" ? "#10b981" : tone === "teal" ? "#14b8a6" : tone === "amber" ? "#f59e0b" : "#f43f5e";
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={stroke} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 800ms ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold">{score}</div>
        <div className="text-xs text-muted-foreground">/ 100</div>
      </div>
    </div>
  );
}

function DailyPanel({ includeSample }: { includeSample: boolean }) {
  const run = useServerFn(getDailyScore);
  const [data, setData] = useState<DailyScoreResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await run({ data: { includeSample } })); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [includeSample]);

  if (loading || !data) return <PanelSkeleton />;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Daily Score
            <Button size="icon-sm" variant="ghost" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ScoreRing score={data.score} tone={data.grade.tone} />
          <Badge variant="outline" className="text-sm">{data.grade.label}</Badge>
          <div className="text-xs text-muted-foreground">{data.date}</div>
          {data.streak > 0 && (
            <div className="flex items-center gap-2 text-sm"><Flame className="h-4 w-4 text-amber-400" />{data.streak}-day streak</div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">Today's footprint</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Today" value={`${data.todayKg} kg`} />
            <Metric label="1.5°C budget" value={`${data.budgetKg} kg`} />
            <Metric label="vs 7-day avg" value={`${data.vs7dAvg.kg >= 0 ? "+" : ""}${data.vs7dAvg.kg} kg`} trend={data.vs7dAvg.pct} />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Budget usage</span>
              <span>{Math.min(999, Math.round((data.todayKg / data.budgetKg) * 100))}%</span>
            </div>
            <Progress value={Math.min(100, (data.todayKg / data.budgetKg) * 100)} />
          </div>
          {data.byCategory.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">Today by category</div>
              {data.byCategory.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-sm w-32 truncate">{c.category}</span>
                  <Progress value={c.share * 100} className="flex-1" />
                  <span className="text-sm tabular-nums w-20 text-right">{c.kg.toFixed(2)} kg</span>
                </div>
              ))}
            </div>
          )}
          {data.insights.length > 0 && (
            <div className="space-y-2">
              {data.insights.map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{i}</span>
                </div>
              ))}
            </div>
          )}
          {!data.hasData && <EmptyHint message="Log activity in Carbon Tracker to get today's real score." />}
        </CardContent>
      </Card>
    </div>
  );
}

function WeeklyPanel({ includeSample }: { includeSample: boolean }) {
  const run = useServerFn(getWeeklyPlan);
  const [data, setData] = useState<WeeklyPlanResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await run({ data: { includeSample } })); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [includeSample]);

  if (loading || !data) return <PanelSkeleton />;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Baseline (7d)" value={`${data.baseline7dKg} kg`} />
        <Metric label="Target cut" value={`-${data.targetReductionPct}%`} />
        <Metric label="Goal next 7d" value={`${data.goalKg} kg`} />
        <Metric label="Week of" value={data.weekOf} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-300" />AI Weekly Plan</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{data.rationale}</p>
          </div>
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="h-4 w-4 mr-2" />Regenerate</Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
            {data.days.map((d) => (
              <div key={d.day} className="rounded-xl border border-white/10 bg-card/40 p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{d.day}</span>
                  <Badge variant="outline" className="text-[10px]">{d.target_kg} kg</Badge>
                </div>
                <div className="text-xs font-medium text-emerald-300">{d.focus}</div>
                <ul className="space-y-1.5">
                  {d.actions.map((a, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-emerald-400/70" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {data.topCategories.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Top categories last 7 days</div>
              <div className="flex flex-wrap gap-2">
                {data.topCategories.map((c) => (
                  <Badge key={c.category} variant="secondary">{c.category} · {c.kg} kg</Badge>
                ))}
              </div>
            </div>
          )}
          {!data.hasData && <EmptyHint message="No activity in the last 7 days — log entries to get an AI-personalised plan." />}
        </CardContent>
      </Card>
    </div>
  );
}

function MonthlyPanel({ includeSample }: { includeSample: boolean }) {
  const run = useServerFn(getMonthlyReport);
  const [data, setData] = useState<MonthlyReportResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await run({ data: { includeSample } })); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [includeSample]);

  if (loading || !data) return <PanelSkeleton />;

  const mom = data.monthOverMonth.pct;
  const trendIcon = mom == null ? null : mom < 0 ? <TrendingDown className="h-4 w-4 text-emerald-400" /> : <TrendingUp className="h-4 w-4 text-rose-400" />;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total CO₂" value={`${data.totalKg} kg`} />
        <Metric label="Avg / day" value={`${data.avgPerDayKg} kg`} />
        <Metric label="Days logged" value={`${data.daysLogged} / 30`} />
        <Metric label="Month over month" value={mom == null ? "—" : `${(mom * 100).toFixed(0)}%`} icon={trendIcon} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Executive summary</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{data.periodFrom} → {data.periodTo}</p>
          </div>
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-relaxed">{data.summary}</p>

          {data.byCategory.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">Emissions by category</div>
              {data.byCategory.slice(0, 8).map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-sm w-32 truncate">{c.category}</span>
                  <Progress value={c.share * 100} className="flex-1" />
                  <span className="text-sm tabular-nums w-20 text-right">{c.kg.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <ListCard title="Highlights" icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} items={data.highlights} />
            <ListCard title="Risks" icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} items={data.risks} />
            <ListCard title="Next month focus" icon={<Target className="h-4 w-4 text-cyan-400" />} items={data.nextMonthFocus} />
          </div>

          {!data.hasData && <EmptyHint message="Track entries for at least a few days this month to unlock the AI report." />}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, trend, icon }: { label: string; value: string; trend?: number | null; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">{icon}{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
      {trend != null && (
        <div className={`text-[11px] mt-1 ${trend < 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {(trend * 100).toFixed(0)}% vs avg
        </div>
      )}
    </div>
  );
}

function ListCard({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/40 p-4">
      <div className="flex items-center gap-2 mb-2 text-sm font-medium">{icon}{title}</div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No items.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="mt-1 h-1 w-1 rounded-full bg-emerald-400 shrink-0" /> <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Skeleton className="h-72 lg:col-span-1" />
      <Skeleton className="h-72 lg:col-span-2" />
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-muted-foreground text-center">
      {message}
    </div>
  );
}
