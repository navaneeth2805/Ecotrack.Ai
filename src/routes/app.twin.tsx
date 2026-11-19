import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Brain, Zap, Plane, Salad, Bot } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/app/twin")({ component: Twin });

const twinData = [
  { axis: "Transport", v: 70 }, { axis: "Energy", v: 55 }, { axis: "Food", v: 85 }, { axis: "Shopping", v: 60 }, { axis: "Water", v: 78 }, { axis: "Waste", v: 82 },
];

function Twin() {
  return (
    <AppShell title="AI Sustainability Twin" subtitle="A digital model of your lifestyle and how to optimize it">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-strong p-8 lg:col-span-1 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10 animate-pulse-glow" />
          <div className="relative">
            <div className="relative h-44 w-44 mx-auto">
              <div className="absolute inset-0 rounded-full gradient-bg blur-2xl opacity-50 animate-pulse-glow" />
              <div className="absolute inset-2 rounded-full glass-strong grid-bg grid place-items-center"><Bot className="h-16 w-16 text-primary" /></div>
            </div>
            <Badge className="mt-4 gradient-bg text-primary-foreground border-0">Eco DNA: Conscious Commuter</Badge>
            <h3 className="mt-3 font-display font-bold text-xl">Your Twin</h3>
            <p className="text-xs text-muted-foreground mt-1">v2.4 · Trained on 47 data points</p>
          </div>
        </Card>

        <Card className="glass p-6 lg:col-span-2">
          <h3 className="font-display font-semibold">Lifestyle profile</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={twinData}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="axis" stroke="#94a3b8" fontSize={12} /><Radar dataKey="v" stroke="#00C853" fill="#00C853" fillOpacity={0.4} /></RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {[
          { icon: Plane, title: "Travel habits", t: "You fly 2.4× more than peers. One swap to rail (>500 km) saves ~210 kg CO₂/yr.", v: 65 },
          { icon: Zap, title: "Energy habits", t: "Peak AC use is 4–6 PM. Shifting 1 hour saves ~3.2 kg CO₂/wk.", v: 55 },
          { icon: Salad, title: "Food habits", t: "Strong plant-based weeks. Add 2 vegan dinners to unlock 'Plant Pioneer' badge.", v: 85 },
        ].map(c => (
          <Card key={c.title} className="glass p-5">
            <div className="flex items-center justify-between"><span className="h-10 w-10 grid place-items-center rounded-xl gradient-bg"><c.icon className="h-5 w-5 text-primary-foreground" /></span><Badge variant="outline">{c.v}/100</Badge></div>
            <h4 className="mt-3 font-display font-semibold">{c.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{c.t}</p>
            <Progress value={c.v} className="mt-3 h-1.5" />
          </Card>
        ))}
      </div>

      <Card className="glass p-6 mt-6">
        <h3 className="font-display font-semibold flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Personalized recommendations</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            "Swap one car commute/wk → public transit. Impact: -36 kg CO₂/yr.",
            "Switch refrigerator setpoint from 2°C to 4°C. Impact: -28 kg CO₂/yr.",
            "Cancel 1 fast-fashion subscription. Impact: -84 kg CO₂/yr.",
            "Enable solar export to grid (if available). Impact: -120 kg CO₂/yr.",
          ].map((r, i) => (
            <div key={i} className="p-3 rounded-lg glass flex items-start gap-2 text-sm"><Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />{r}</div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
