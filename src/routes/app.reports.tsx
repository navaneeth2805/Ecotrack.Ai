import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Leaf, Building2, Briefcase, Download, FileSpreadsheet, FileType, Sparkles, Loader2, FlaskConical } from "lucide-react";
import { generateReport, type ReportPayload, type ReportType } from "@/lib/reports.functions";
import { exportCSV, exportPDF, exportXLSX } from "@/lib/report-exports";
import { useIncludeSample } from "@/lib/data-mode";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

const REPORTS: { id: ReportType; title: string; description: string; icon: typeof FileText; tint: string }[] = [
  { id: "carbon", title: "Carbon Report", description: "Deep emissions breakdown by category, scope and trend.", icon: Leaf, tint: "from-emerald-500/20 to-emerald-500/0" },
  { id: "sustainability", title: "Sustainability Report", description: "Habits, goals, challenges and progress narrative.", icon: Sparkles, tint: "from-teal-500/20 to-teal-500/0" },
  { id: "esg", title: "ESG Report", description: "Disclosure-style E/S/G summary for stakeholders.", icon: Building2, tint: "from-cyan-500/20 to-cyan-500/0" },
  { id: "executive", title: "Executive Summary", description: "One-page KPI briefing for leadership review.", icon: Briefcase, tint: "from-indigo-500/20 to-indigo-500/0" },
];

function ReportsPage() {
  const run = useServerFn(generateReport);
  const [period, setPeriod] = useState("90");
  const [includeSample, setIncludeSample] = useIncludeSample();
  const [loadingId, setLoadingId] = useState<ReportType | null>(null);
  const [report, setReport] = useState<ReportPayload | null>(null);

  const handleGenerate = async (type: ReportType) => {
    setLoadingId(type);
    setReport(null);
    try {
      const r = await run({ data: { type, days: Number(period), includeSample } });
      setReport(r);
      toast.success(`${r.title} ready`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate report");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AppShell
      title="AI Report Generator"
      subtitle="Generate audit-ready reports from your real EcoTrack data"
      actions={
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-card/40 px-3 py-1.5">
            <FlaskConical className={`h-4 w-4 ${includeSample ? "text-amber-400" : "text-muted-foreground"}`} />
            <Label htmlFor="sample-toggle" className="text-xs cursor-pointer">
              {includeSample ? "Sample + real" : "Real data only"}
            </Label>
            <Switch id="sample-toggle" checked={includeSample} onCheckedChange={setIncludeSample} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Period</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    >
      {includeSample && (
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300/90 flex items-center gap-2">
          <FlaskConical className="h-3.5 w-3.5" /> Sample data is included. Flip the toggle to generate reports from your real activity only.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {REPORTS.map((r) => {
          const Icon = r.icon;
          const isLoading = loadingId === r.id;
          return (
            <Card key={r.id} className={`relative overflow-hidden bg-gradient-to-br ${r.tint} border-white/10`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-background/40 p-2 ring-1 ring-white/10"><Icon className="h-5 w-5 text-emerald-300" /></div>
                  <CardTitle className="text-base">{r.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground min-h-[40px]">{r.description}</p>
                <Button className="w-full" onClick={() => handleGenerate(r.id)} disabled={isLoading || loadingId !== null}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</> : <><Sparkles className="mr-2 h-4 w-4" />Generate</>}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        {loadingId && !report && <ReportSkeleton />}
        {report && <ReportPreview report={report} />}
        {!loadingId && !report && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold">No report yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Pick a report above. EcoTrack pulls your real tracked entries, goals and challenges, then AI writes the narrative.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function ReportSkeleton() {
  return (
    <Card>
      <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <Skeleton className="h-32" />
      </CardContent>
    </Card>
  );
}

function ReportPreview({ report }: { report: ReportPayload }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl">{report.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{report.subtitle}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">{report.user.name}</Badge>
            <Badge variant="outline">{report.period.from} → {report.period.to}</Badge>
            <Badge variant="outline">{new Date(report.generatedAt).toLocaleString()}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => exportPDF(report)}><FileType className="mr-2 h-4 w-4" />PDF</Button>
          <Button size="sm" variant="outline" onClick={() => exportXLSX(report)}><FileSpreadsheet className="mr-2 h-4 w-4" />Excel</Button>
          <Button size="sm" variant="outline" onClick={() => exportCSV(report)}><Download className="mr-2 h-4 w-4" />CSV</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Key metrics</h3>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {report.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-white/10 bg-card/40 p-3">
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-lg font-semibold mt-1">{m.value}</div>
                {m.hint && <div className="text-[10px] text-muted-foreground mt-1">{m.hint}</div>}
              </div>
            ))}
          </div>
        </section>

        {report.tables.map((t) => (
          <section key={t.title}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t.title}</h3>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>{t.columns.map((c) => <th key={c} className="px-3 py-2 text-left font-medium">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {t.rows.length === 0 && (
                    <tr><td colSpan={t.columns.length} className="px-3 py-6 text-center text-muted-foreground">No data in selected period</td></tr>
                  )}
                  {t.rows.map((row, i) => (
                    <tr key={i} className="border-t border-white/5">
                      {row.map((cell, j) => <td key={j} className="px-3 py-2">{String(cell)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {report.narrative.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> AI analysis
            </h3>
            <div className="space-y-4">
              {report.narrative.map((s, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-card/40 p-4">
                  <div className="font-medium mb-1">{s.heading}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {report.recommendations.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommendations</h3>
            <ol className="space-y-2 list-decimal list-inside">
              {report.recommendations.map((r, i) => (
                <li key={i} className="text-sm">{r}</li>
              ))}
            </ol>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
