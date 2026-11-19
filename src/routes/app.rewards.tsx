import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Award, Trophy, Crown, Star, Shield, Leaf, TreePine, Zap, Recycle } from "lucide-react";

export const Route = createFileRoute("/app/rewards")({ component: Rewards });

const badges = [
  { name: "First Steps", icon: Leaf, earned: true, color: "from-emerald-400 to-emerald-600" },
  { name: "Week Streak", icon: Star, earned: true, color: "from-yellow-400 to-orange-500" },
  { name: "Green Commuter", icon: Trophy, earned: true, color: "from-cyan-400 to-blue-500" },
  { name: "Energy Saver", icon: Zap, earned: true, color: "from-yellow-400 to-amber-500" },
  { name: "Plant Pioneer", icon: TreePine, earned: true, color: "from-green-500 to-emerald-700" },
  { name: "Recycler", icon: Recycle, earned: false, color: "from-blue-400 to-indigo-600" },
  { name: "Climate Hero", icon: Shield, earned: false, color: "from-purple-400 to-fuchsia-600" },
  { name: "Eco Legend", icon: Crown, earned: false, color: "from-pink-400 to-rose-600" },
];

const levels = [
  { lv: 1, name: "Seedling", at: 0 },
  { lv: 2, name: "Sprout", at: 500 },
  { lv: 3, name: "Sapling", at: 1500 },
  { lv: 4, name: "Tree", at: 3000 },
  { lv: 5, name: "Forest Guardian", at: 6000 },
  { lv: 6, name: "Climate Hero", at: 10000 },
  { lv: 7, name: "Eco Legend", at: 20000 },
];

function Rewards() {
  const points = 2840; const cur = 4; const next = levels[cur + 1];
  const lvProgress = ((points - levels[cur].at) / (next.at - levels[cur].at)) * 100;

  return (
    <AppShell title="Green Rewards" subtitle="Eco Points, badges, and the road to Green Champion">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-strong p-8 lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10" />
          <div className="relative">
            <Badge className="gradient-bg text-primary-foreground border-0">Level {levels[cur].lv} · {levels[cur].name}</Badge>
            <div className="mt-4 flex items-end gap-3">
              <div className="font-display text-6xl font-bold gradient-text">{points.toLocaleString()}</div>
              <div className="text-muted-foreground mb-2">Eco Points</div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1.5"><span>Progress to <b>{next.name}</b></span><span className="text-primary">{Math.round(lvProgress)}%</span></div>
              <Progress value={lvProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">{(next.at - points).toLocaleString()} points to next level</p>
            </div>
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="font-display font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Recent earnings</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Logged daily entry</span><span className="text-primary font-mono">+20</span></li>
            <li className="flex justify-between"><span>Joined Plastic-Free challenge</span><span className="text-primary font-mono">+50</span></li>
            <li className="flex justify-between"><span>Reduced CO₂ 10% wk/wk</span><span className="text-primary font-mono">+120</span></li>
            <li className="flex justify-between"><span>Friend referral</span><span className="text-primary font-mono">+200</span></li>
          </ul>
        </Card>
      </div>

      <Card className="glass p-6 mt-6">
        <h3 className="font-display font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Badge collection</h3>
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {badges.map(b => (
            <div key={b.name} className={`text-center ${!b.earned && "opacity-30 grayscale"}`}>
              <div className={`h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br ${b.color} grid place-items-center glow`}>
                <b.icon className="h-7 w-7 text-white" />
              </div>
              <div className="mt-2 text-xs font-medium">{b.name}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass p-6 mt-6">
        <h3 className="font-display font-semibold">Level path</h3>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {levels.map((l, i) => (
            <div key={l.lv} className={`p-3 rounded-xl text-center ${i <= cur ? "glass border-primary/30" : "glass opacity-50"}`}>
              <div className="font-display text-2xl font-bold">{l.lv}</div>
              <div className="text-xs font-semibold">{l.name}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{l.at.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
