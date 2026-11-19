import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/coach")({ component: Coach });

const prompts = [
  "How can I reduce my carbon footprint?",
  "Analyze my sustainability habits",
  "Create a green lifestyle plan",
  "Suggest eco-friendly alternatives",
];

function mockReply(q: string): string {
  const lq = q.toLowerCase();
  if (lq.includes("reduce")) return "Based on your last 30 days, **transport is 38% of your footprint**. Try:\n\n1. Swap 2 car commutes/week for public transit (-9 kg CO₂/wk)\n2. Combine errands into single trips (-3 kg CO₂/wk)\n3. Enable EV mode on weekends (-12 kg CO₂/wk)\n\nProjected reduction: **~22% in 4 weeks**.";
  if (lq.includes("habit") || lq.includes("analyze")) return "Your sustainability profile:\n\n- **Strengths:** Low food waste, good recycling streak (21 days)\n- **Opportunities:** AC usage is 18% above average; flights drove 24 kg CO₂ last month\n- **Eco DNA:** Conscious Commuter (top 12%)\n\nWant a personalized 30-day plan?";
  if (lq.includes("plan") || lq.includes("lifestyle")) return "**Your 30-Day Green Plan:**\n\nWeek 1 — Audit: Track every category daily.\nWeek 2 — Transport: Swap 3 trips for walking/transit.\nWeek 3 — Energy: Install smart plug + LED audit.\nWeek 4 — Food: Try 4 plant-based meals.\n\nTarget: -25% footprint, +600 Eco Points.";
  if (lq.includes("alternative")) return "Top swaps for you:\n\n- ☕ Reusable cup → -2 kg CO₂/month\n- 🚲 E-bike for <5 km trips → -18 kg CO₂/month\n- 🌱 Plant protein 3×/week → -12 kg CO₂/month\n- 💡 LED bulbs → -8 kg CO₂/month";
  return "Great question! Based on your activity, the highest-leverage move right now is **reducing AC usage by 2 hours/day** (saves ~3 kg CO₂/day). Want me to set that as a goal?";
}

type Msg = { role: "user" | "assistant"; content: string };

function Coach() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your AI Climate Coach 🌱 Ask me anything about reducing your footprint, building greener habits, or making smarter sustainability choices." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [msgs, thinking]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput(""); setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", content: mockReply(text) }]);
      setThinking(false);
    }, 900);
  }

  return (
    <AppShell title="AI Climate Coach" subtitle="Your personal sustainability advisor">
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="glass p-4 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-8 w-8 grid place-items-center rounded-lg gradient-bg"><Brain className="h-4 w-4 text-primary-foreground" /></span>
            <div><div className="font-display font-semibold text-sm">Coach</div><div className="text-xs text-muted-foreground">Online · Powered by Lovable AI</div></div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Suggested prompts</p>
          <div className="space-y-2">
            {prompts.map(p => (
              <button key={p} onClick={() => send(p)} className="w-full text-left text-sm p-3 rounded-lg glass hover:border-primary/40 transition flex items-start gap-2">
                <Sparkles className="h-3 w-3 mt-0.5 text-primary shrink-0" /> {p}
              </button>
            ))}
          </div>
        </Card>

        <Card className="glass p-0 lg:col-span-3 flex flex-col h-[70vh]">
          <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && <span className="h-8 w-8 grid place-items-center rounded-lg gradient-bg shrink-0"><Brain className="h-4 w-4 text-primary-foreground" /></span>}
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "gradient-bg text-primary-foreground" : "glass"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {thinking && <div className="flex gap-3"><span className="h-8 w-8 grid place-items-center rounded-lg gradient-bg"><Brain className="h-4 w-4 text-primary-foreground" /></span><div className="glass rounded-2xl p-3.5 text-sm text-muted-foreground">Thinking…</div></div>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-white/5 p-4 flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your climate coach anything…" className="flex-1" />
            <Button type="submit" className="gradient-bg text-primary-foreground border-0"><Send className="h-4 w-4" /></Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
