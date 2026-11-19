import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, GraduationCap, Users, Calendar, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/campus")({ component: Campus });

const depts = [
  { name: "Computer Science", score: 92 },
  { name: "Mechanical", score: 71 },
  { name: "Architecture", score: 88 },
  { name: "Bio-tech", score: 94 },
  { name: "Business", score: 64 },
  { name: "Arts", score: 78 },
];
const students = [
  { rank: 1, name: "Aanya Patel", dept: "Bio-tech", points: 4820 },
  { rank: 2, name: "Liam Chen", dept: "Architecture", points: 4120 },
  { rank: 3, name: "Maya Rao", dept: "Computer Science", points: 3950 },
  { rank: 4, name: "Noah Singh", dept: "Bio-tech", points: 3700 },
  { rank: 5, name: "Sofia Müller", dept: "Architecture", points: 3410 },
];

function Campus() {
  return (
    <AppShell title="Eco School & College Hub" subtitle="Drive campus-wide sustainability">
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="glass-strong p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10" />
          <div className="relative flex items-center gap-4">
            <span className="h-14 w-14 rounded-2xl gradient-bg grid place-items-center"><GraduationCap className="h-7 w-7 text-primary-foreground" /></span>
            <div className="flex-1">
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Campus Sustainability Score</div>
              <div className="font-display text-5xl font-bold gradient-text">86<span className="text-xl text-muted-foreground">/100</span></div>
              <Progress value={86} className="mt-2 h-2" />
            </div>
            <Badge className="gradient-bg text-primary-foreground border-0">Top 8% nationally</Badge>
          </div>
        </Card>
        <Card className="glass p-6"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><div className="text-xs uppercase text-muted-foreground">Active students</div><div className="font-display text-2xl font-bold">4,218</div></div></div>
          <div className="mt-3 flex items-center gap-3"><Trophy className="h-5 w-5 text-primary" /><div><div className="text-xs uppercase text-muted-foreground">Completed challenges</div><div className="font-display text-2xl font-bold">812</div></div></div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass p-6"><h3 className="font-display font-semibold">Department leaderboard</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={depts} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis type="number" stroke="#64748b" fontSize={11} /><YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={110} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Bar dataKey="score" fill="#00C853" radius={[0,8,8,0]} /></BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6"><h3 className="font-display font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Student green rankings</h3>
          <div className="mt-4 space-y-2">
            {students.map(s => (
              <div key={s.rank} className="flex items-center gap-3 p-2.5 rounded-lg hover:glass">
                <span className={`h-7 w-7 rounded-full grid place-items-center font-display text-xs font-bold ${s.rank === 1 ? "gradient-bg text-primary-foreground" : "bg-muted"}`}>{s.rank}</span>
                <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{s.name}</div><div className="text-[11px] text-muted-foreground">{s.dept}</div></div>
                <div className="font-mono text-xs text-primary">{s.points.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <Card className="glass p-6"><h3 className="font-display font-semibold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Green events</h3>
          <ul className="mt-3 space-y-2">
            {[
              { d: "Jun 28", t: "Campus tree-planting day", a: "412 going" },
              { d: "Jul 04", t: "Sustainability hackathon", a: "Open registration" },
              { d: "Jul 12", t: "Zero-waste fashion show", a: "Volunteers needed" },
            ].map(e => (
              <li key={e.t} className="flex items-center gap-3 p-3 rounded-lg glass"><div className="text-center"><div className="text-xs uppercase text-muted-foreground">{e.d.split(" ")[0]}</div><div className="font-display font-bold">{e.d.split(" ")[1]}</div></div><div className="flex-1"><div className="font-semibold text-sm">{e.t}</div><div className="text-xs text-muted-foreground">{e.a}</div></div><Button size="sm" variant="outline">Join</Button></li>
            ))}
          </ul>
        </Card>
        <Card className="glass p-6"><h3 className="font-display font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Active eco-challenges</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between p-3 rounded-lg glass"><span>"Walk to Class" Week</span><Badge>Live</Badge></li>
            <li className="flex justify-between p-3 rounded-lg glass"><span>Campus Lights-Off Friday</span><Badge>Live</Badge></li>
            <li className="flex justify-between p-3 rounded-lg glass"><span>Cafeteria meat-free Mondays</span><Badge variant="outline">Starts Mon</Badge></li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
