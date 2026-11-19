import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { dailyEmissions, monthlyEmissions, categoryBreakdown } from "@/lib/mock";
import { Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({ component: Analytics });

const transportData = [
  { name: "Car", v: 42 }, { name: "Public", v: 22 }, { name: "Flight", v: 18 }, { name: "EV", v: 12 }, { name: "Bike", v: 6 },
];
const energyData = [
  { d: "M", v: 12 }, { d: "T", v: 14 }, { d: "W", v: 11 }, { d: "T", v: 16 }, { d: "F", v: 13 }, { d: "S", v: 9 }, { d: "S", v: 8 },
];
const foodImpact = [
  { name: "Veg", v: 60 }, { name: "Dairy", v: 25 }, { name: "Meat", v: 10 }, { name: "Fast food", v: 5 },
];
const radarHabits = [
  { axis: "Transport", v: 70 }, { axis: "Energy", v: 60 }, { axis: "Food", v: 85 }, { axis: "Shopping", v: 50 }, { axis: "Water", v: 75 }, { axis: "Waste", v: 80 },
];
const COLORS = ["#00C853", "#64DD17", "#1B5E20", "#26A69A", "#0288D1"];

function Analytics() {
  return (
    <AppShell title="Analytics" subtitle="Beautiful insights into your environmental impact">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass p-6 lg:col-span-2">
          <div className="flex justify-between items-start mb-3"><div><h3 className="font-display font-semibold">Daily emissions</h3><p className="text-xs text-muted-foreground">Last 14 days</p></div><Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">-12% vs prev</Badge></div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyEmissions}><defs><linearGradient id="d1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00C853" stopOpacity={0.5} /><stop offset="100%" stopColor="#00C853" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="day" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="co2" stroke="#00C853" fill="url(#d1)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6"><h3 className="font-display font-semibold">Transportation impact</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={transportData}><XAxis dataKey="name" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Bar dataKey="v" fill="#00C853" radius={[8,8,0,0]} /></BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6 lg:col-span-2"><h3 className="font-display font-semibold">Monthly emissions vs offsets</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyEmissions}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Legend /><Bar dataKey="co2" fill="#EF5350" radius={[6,6,0,0]} name="Emissions" /><Bar dataKey="offset" fill="#00C853" radius={[6,6,0,0]} name="Offsets" /></BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6"><h3 className="font-display font-semibold">Energy usage</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={energyData}><XAxis dataKey="d" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Line type="monotone" dataKey="v" stroke="#64DD17" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6"><h3 className="font-display font-semibold">Food impact</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={foodImpact} dataKey="v" innerRadius={50} outerRadius={80} paddingAngle={3}>{foodImpact.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /></PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6"><h3 className="font-display font-semibold">Sustainability habits</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarHabits}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="axis" stroke="#64748b" fontSize={11} /><Radar dataKey="v" stroke="#00C853" fill="#00C853" fillOpacity={0.35} /></RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6 lg:col-span-3 flex items-center gap-4">
          <span className="h-12 w-12 grid place-items-center rounded-xl gradient-bg shrink-0"><Sparkles className="h-5 w-5 text-primary-foreground" /></span>
          <div className="flex-1">
            <div className="font-display font-semibold">AI Insight</div>
            <p className="text-sm text-muted-foreground">Your transport emissions dropped <span className="text-primary font-semibold">22% week over week</span>. Maintain this pace and you'll hit your annual target 6 weeks early. Suggested next focus: <b>home energy</b> (highest remaining lever).</p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10"><TrendingDown className="h-3 w-3 mr-1" /> On track</Badge>
        </Card>
      </div>
    </AppShell>
  );
}
