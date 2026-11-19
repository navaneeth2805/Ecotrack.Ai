import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Target, Plus, Trash2, CheckCircle2, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/app/goals")({ component: Goals });

type Goal = { id: string; title: string; description: string | null; target_value: number; current_value: number; unit: string | null; status: string; deadline: string | null };

function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", target_value: 100, unit: "%", deadline: "" });

  async function load() {
    const { data } = await supabase.from("goals").select("*").order("created_at", { ascending: false });
    setGoals((data as Goal[]) || []);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("goals").insert({ ...form, user_id: u.user.id, deadline: form.deadline || null });
    if (error) return toast.error(error.message);
    setOpen(false); setForm({ title: "", description: "", target_value: 100, unit: "%", deadline: "" });
    toast.success("Goal created"); load();
  }
  async function update(id: string, current_value: number) {
    await supabase.from("goals").update({ current_value }).eq("id", id);
    load();
  }
  async function complete(id: string) {
    await supabase.from("goals").update({ status: "completed", current_value: 100 }).eq("id", id);
    toast.success("Goal completed! 🏆"); load();
  }
  async function del(id: string) {
    await supabase.from("goals").delete().eq("id", id); load();
  }

  const active = goals.filter(g => g.status === "active");
  const done = goals.filter(g => g.status === "completed");

  return (
    <AppShell title="Goals" subtitle="Set, track, and crush your sustainability targets"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gradient-bg text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1" /> New goal</Button></DialogTrigger>
          <DialogContent className="glass-strong">
            <DialogHeader><DialogTitle>Create new goal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Reduce emissions by 20%" /></div>
              <div><Label>Description</Label><Input className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Target value</Label><Input type="number" className="mt-1.5" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: +e.target.value })} /></div>
                <div><Label>Unit</Label><Input className="mt-1.5" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
              </div>
              <div><Label>Deadline</Label><Input type="date" className="mt-1.5" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={create} className="gradient-bg text-primary-foreground border-0">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }>
      {goals.length === 0 ? (
        <Card className="glass p-12 text-center">
          <Target className="h-10 w-10 mx-auto text-primary" />
          <h3 className="mt-4 font-display font-semibold text-lg">Set your first goal</h3>
          <p className="text-sm text-muted-foreground mt-1">Track progress, earn badges, and stay accountable.</p>
        </Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            {active.map(g => {
              const pct = Math.round((g.current_value / g.target_value) * 100);
              return (
                <Card key={g.id} className="glass p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-semibold">{g.title}</h3>
                      {g.description && <p className="text-sm text-muted-foreground mt-1">{g.description}</p>}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => del(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1.5"><span>{g.current_value} / {g.target_value} {g.unit}</span><span className="text-primary">{pct}%</span></div>
                    <Progress value={pct} className="h-2" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Input type="number" className="h-9" placeholder="Update progress" onKeyDown={(e: any) => { if (e.key === "Enter") update(g.id, +e.target.value); }} />
                    <Button size="sm" variant="outline" onClick={() => complete(g.id)}><CheckCircle2 className="h-4 w-4 mr-1" /> Complete</Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {done.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Completed</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {done.map(g => (
                  <Card key={g.id} className="glass p-4 opacity-80">
                    <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="h-4 w-4 text-primary" /><Badge className="gradient-bg text-primary-foreground border-0 text-[10px]">Done</Badge></div>
                    <div className="font-semibold text-sm">{g.title}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
