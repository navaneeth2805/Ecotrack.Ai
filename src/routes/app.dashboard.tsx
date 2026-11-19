import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, TrendingDown, Award, TreePine, Activity, ArrowUpRight, Flame, Trophy } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { dailyEmissions, categoryBreakdown } from "@/lib/mock";

export const Route = createFileRoute("/app/dashboard")({ component: Dashboard });

function Stat({ icon: Icon, label, value, delta, trend = "down" }: any) {
  return (
    <Card className="glass p-5">
      <div className="flex items-center justify-between">
        <span className="h-10 w-10 rounded-xl grid place-items-center gradient-bg glow"><Icon className="h-5 w-5 text-primary-foreground" /></span>
        {delta && <Badge variant="outline" className={trend === "down" ? "border-primary/30 text-primary bg-primary/10" : "border-orange-500/30 text-orange-400 bg-orange-500/10"}>{delta}</Badge>}
      </div>
      <div className="mt-4 text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="font-display text-2xl sm:text-3xl font-bold mt-1">{value}</div>
    </Card>
  );
}

function Gauge({ score }: { score: number }) {
  const c = 2 * Math.PI * 70;
  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" stroke="oklch(1 0 0 / 0.08)" strokeWidth="14" fill="none" />
        <circle cx="80" cy="80" r="70" stroke="url(#g1)" strokeWidth="14" fill="none" strokeLinecap="round"
          strokeDasharray={`${c * (score / 100)} ${c}`} />
        <defs>
          <linearGradient id="g1" x1="0" x2="1"><stop offset="0%" stopColor="#1B5E20" /><stop offset="100%" stopColor="#64DD17" /></linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xs text-muted-foreground uppercase">Eco Score</div>
          <div className="font-display text-4xl font-bold gradient-text">{score}</div>
          <div className="text-xs text-muted-foreground">/100</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <AppShell title="Dashboard" subtitle="Your sustainability cockpit"
      actions={<Button asChild size="sm" className="gradient-bg text-primary-foreground border-0"><Link to="/app/tracker">+ Log activity</Link></Button>}>
      <div className="grid gap-4 lg:grid-cols-4">
        <Stat icon={Leaf} label="Today's CO₂" value="4.8 kg" delta="-12%" trend="down" />
        <Stat icon={TrendingDown} label="Weekly Avg" value="38.2 kg" delta="-8%" trend="down" />
        <Stat icon={Activity} label="Monthly Total" value="162 kg" delta="-5%" trend="down" />
        <Stat icon={TreePine} label="Trees to Offset" value="7" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="glass p-6 lg:col-span-1 flex flex-col items-center justify-center">
          <Gauge score={78} />
          <Badge className="mt-4 gradient-bg text-primary-foreground border-0">Green Champion</Badge>
          <p className="mt-2 text-xs text-muted-foreground text-center">Top 12% in your region</p>
        </Card>

        <Card className="glass p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">14-day emissions</h3>
              <p className="text-xs text-muted-foreground">kg CO₂ per day vs target</p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">Below target</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyEmissions}>
              <defs>
                <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00C853" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00C853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="co2" stroke="#00C853" strokeWidth={2.5} fill="url(#g2)" />
              <Area type="monotone" dataKey="target" stroke="#64DD17" strokeWidth={1} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="glass p-6">
          <h3 className="font-display font-semibold">Emissions breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryBreakdown.map(c => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 text-sm">
            {categoryBreakdown.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}</span>
                <span className="font-mono">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-semibold">Active goals</h3>
            <Button asChild size="sm" variant="ghost"><Link to="/app/goals">View all <ArrowUpRight className="ml-1 h-3 w-3" /></Link></Button>
          </div>
          <div className="space-y-4">
            {[
              { title: "Reduce emissions 20%", v: 62 },
              { title: "Public transport 3×/week", v: 80 },
              { title: "Cut electricity 15%", v: 45 },
            ].map(g => (
              <div key={g.title}>
                <div className="flex justify-between text-sm mb-1.5"><span>{g.title}</span><span className="text-muted-foreground">{g.v}%</span></div>
                <Progress value={g.v} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 glass text-center"><Flame className="h-5 w-5 mx-auto text-orange-400" /><div className="mt-1 font-display font-bold">21</div><div className="text-[10px] uppercase text-muted-foreground">Day streak</div></div>
            <div className="rounded-xl p-3 glass text-center"><Trophy className="h-5 w-5 mx-auto text-primary" /><div className="mt-1 font-display font-bold">12</div><div className="text-[10px] uppercase text-muted-foreground">Badges</div></div>
            <div className="rounded-xl p-3 glass text-center"><Award className="h-5 w-5 mx-auto text-accent" /><div className="mt-1 font-display font-bold">2,840</div><div className="text-[10px] uppercase text-muted-foreground">Eco Points</div></div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
