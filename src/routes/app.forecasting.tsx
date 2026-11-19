import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area, AreaChart } from "recharts";
import { forecast } from "@/lib/mock";
import { Sparkles, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/app/forecasting")({ component: Forecasting });

const scoreForecast = Array.from({ length: 12 }).map((_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], score: 60 + i * 3 + Math.sin(i) * 2 }));

function Forecasting() {
  return (
    <AppShell title="Carbon Forecasting" subtitle="ML predictions for your environmental trajectory">
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[
          { t: "Predicted 2026 emissions", v: "1,460 kg", d: "-28% vs 2025", icon: Activity },
          { t: "Sustainability score (12mo)", v: "94/100", d: "+22 points", icon: TrendingUp },
          { t: "Trees offset projection", v: "84", d: "+47 vs today", icon: Sparkles },
        ].map(s => (
          <Card key={s.t} className="glass p-5 flex items-center gap-4">
            <span className="h-11 w-11 rounded-xl grid place-items-center gradient-bg glow"><s.icon className="h-5 w-5 text-primary-foreground" /></span>
            <div className="flex-1"><div className="text-xs uppercase text-muted-foreground tracking-wider">{s.t}</div><div className="font-display text-2xl font-bold">{s.v}</div></div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">{s.d}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass p-6">
          <h3 className="font-display font-semibold">Emissions forecast — next 12 months</h3>
          <p className="text-xs text-muted-foreground mb-3">Solid = actual · Dotted = ML prediction</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={forecast}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Legend />
              <Line type="monotone" dataKey="actual" stroke="#00C853" strokeWidth={3} dot={{ r: 4 }} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="#64DD17" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6">
          <h3 className="font-display font-semibold">Sustainability score outlook</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={scoreForecast}><defs><linearGradient id="sc" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00C853" stopOpacity={0.5} /><stop offset="100%" stopColor="#00C853" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Area type="monotone" dataKey="score" stroke="#00C853" fill="url(#sc)" strokeWidth={2.5} /></AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {[
          { t: "High confidence", c: "Your transport emissions are on track to halve by Q3 2026. ML confidence: 92%." },
          { t: "Risk alert", c: "Without action on AC usage, summer 2026 footprint could spike 18% above target." },
          { t: "Opportunity", c: "Adopting plant-based meals 4×/week unlocks an additional 14% reduction." },
        ].map(p => (
          <Card key={p.t} className="glass p-5"><Badge className="gradient-bg text-primary-foreground border-0 mb-3">AI Prediction</Badge><div className="font-display font-semibold">{p.t}</div><p className="text-sm text-muted-foreground mt-1">{p.c}</p></Card>
        ))}
      </div>
    </AppShell>
  );
}
