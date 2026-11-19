import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { Trophy, Flame } from "lucide-react";
import { leaderboard } from "@/lib/mock";

export const Route = createFileRoute("/app/challenges")({ component: Challenges });

type Challenge = { id: string; title: string; description: string; category: string; xp_reward: number; duration_days: number; icon: string; difficulty: string };
type UC = { id: string; challenge_id: string; status: string; progress: number };

function Challenges() {
  const [challs, setChalls] = useState<Challenge[]>([]);
  const [mine, setMine] = useState<UC[]>([]);

  async function load() {
    const [{ data: c }, { data: m }] = await Promise.all([
      supabase.from("challenges").select("*"),
      supabase.from("user_challenges").select("*"),
    ]);
    setChalls((c as Challenge[]) || []); setMine((m as UC[]) || []);
  }
  useEffect(() => { load(); }, []);

  async function join(challenge_id: string) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("user_challenges").insert({ user_id: u.user.id, challenge_id });
    if (error) return toast.error(error.message);
    toast.success("Challenge joined!"); load();
  }
  async function bump(uc: UC) {
    const np = Math.min(100, uc.progress + 20);
    await supabase.from("user_challenges").update({ progress: np, status: np >= 100 ? "completed" : "active", completed_at: np >= 100 ? new Date().toISOString() : null }).eq("id", uc.id);
    if (np >= 100) toast.success("Challenge completed! 🏆");
    load();
  }

  return (
    <AppShell title="Challenges" subtitle="Earn XP, level up, and save the planet">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-semibold">Available challenges</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {challs.map(c => {
              const Icon = (Icons as any)[c.icon] || Trophy;
              const uc = mine.find(m => m.challenge_id === c.id);
              return (
                <Card key={c.id} className="glass p-5">
                  <div className="flex items-center justify-between">
                    <span className="h-11 w-11 grid place-items-center rounded-xl gradient-bg glow"><Icon className="h-5 w-5 text-primary-foreground" /></span>
                    <Badge variant="outline" className="capitalize">{c.difficulty}</Badge>
                  </div>
                  <h3 className="mt-3 font-display font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-primary" /> {c.xp_reward} XP</span>
                    <span>{c.duration_days} days</span>
                  </div>
                  {uc ? (
                    <>
                      <Progress value={uc.progress} className="mt-3 h-2" />
                      {uc.status === "completed" ? (
                        <Badge className="mt-3 gradient-bg text-primary-foreground border-0">Completed</Badge>
                      ) : (
                        <Button size="sm" className="mt-3 w-full" onClick={() => bump(uc)}>Mark progress +20%</Button>
                      )}
                    </>
                  ) : (
                    <Button size="sm" className="mt-3 w-full gradient-bg text-primary-foreground border-0" onClick={() => join(c.id)}>Join challenge</Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="glass p-6 h-fit">
          <h3 className="font-display font-semibold flex items-center gap-2"><Flame className="h-4 w-4 text-orange-400" /> Global leaderboard</h3>
          <div className="mt-4 space-y-2">
            {leaderboard.map((l) => (
              <div key={l.rank} className="flex items-center gap-3 p-2 rounded-lg hover:glass transition">
                <span className={`h-7 w-7 grid place-items-center rounded-full font-display text-xs font-bold ${l.rank === 1 ? "gradient-bg text-primary-foreground" : "bg-muted"}`}>{l.rank}</span>
                <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{l.name}</div><div className="text-[10px] text-muted-foreground">{l.badge}</div></div>
                <div className="font-mono text-xs text-primary">{l.points.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
