import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Leaf, Users, Target, TrendingDown, FileBarChart } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/esg")({ component: ESG });

const esgScores = [
  { m: "Q1", env: 72, soc: 80, gov: 88 }, { m: "Q2", env: 78, soc: 82, gov: 90 },
  { m: "Q3", env: 84, soc: 85, gov: 91 }, { m: "Q4", env: 88, soc: 88, gov: 93 },
];
const empPart = [
  { m: "Jan", v: 41 }, { m: "Feb", v: 52 }, { m: "Mar", v: 60 }, { m: "Apr", v: 68 },
  { m: "May", v: 74 }, { m: "Jun", v: 78 },
];

function ESG() {
  return (
    <AppShell title="Corporate ESG Dashboard" subtitle="Enterprise sustainability at a glance">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Leaf, t: "Carbon (Scope 1+2)", v: "12,840 tCO₂", d: "-18% YoY", color: "text-primary" },
          { icon: Target, t: "Net-zero target", v: "2032", d: "On track" },
          { icon: Users, t: "Employee participation", v: "78%", d: "+12 pts" },
          { icon: FileBarChart, t: "ESG composite", v: "87/100", d: "AA rating" },
        ].map(s => (
          <Card key={s.t} className="glass p-5">
            <div className="flex items-center justify-between"><span className="h-10 w-10 rounded-xl gradient-bg grid place-items-center"><s.icon className="h-5 w-5 text-primary-foreground" /></span><Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">{s.d}</Badge></div>
            <div className="mt-3 text-xs uppercase text-muted-foreground tracking-wider">{s.t}</div>
            <div className="font-display text-2xl font-bold mt-1">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass p-6"><h3 className="font-display font-semibold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> ESG quarterly composite</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={esgScores}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Bar dataKey="env" name="Environmental" fill="#00C853" radius={[6,6,0,0]} /><Bar dataKey="soc" name="Social" fill="#64DD17" radius={[6,6,0,0]} /><Bar dataKey="gov" name="Governance" fill="#1B5E20" radius={[6,6,0,0]} /></BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6"><h3 className="font-display font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Employee sustainability participation</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={empPart}><defs><linearGradient id="ep" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00C853" stopOpacity={0.5} /><stop offset="100%" stopColor="#00C853" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Area type="monotone" dataKey="v" stroke="#00C853" fill="url(#ep)" strokeWidth={2.5} /></AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="glass p-6 mt-6">
        <h3 className="font-display font-semibold flex items-center gap-2"><TrendingDown className="h-4 w-4 text-primary" /> Carbon reduction targets</h3>
        <div className="mt-4 space-y-4">
          {[
            { t: "Scope 1 — direct emissions", c: 4800, g: 6200, l: "-23%" },
            { t: "Scope 2 — purchased energy", c: 8040, g: 10500, l: "-19%" },
            { t: "Scope 3 — value chain", c: 38200, g: 52000, l: "-21%" },
          ].map(r => (
            <div key={r.t}>
              <div className="flex justify-between text-sm mb-1.5"><span>{r.t}</span><span className="text-primary font-mono">{r.l}</span></div>
              <Progress value={(r.c / r.g) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{r.c.toLocaleString()} tCO₂</span><span>Target {r.g.toLocaleString()} tCO₂</span></div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
