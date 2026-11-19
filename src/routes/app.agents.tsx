import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AGENT_LIST } from "@/lib/agents";

export const Route = createFileRoute("/app/agents")({ component: AgentsHub });

function AgentsHub() {
  return (
    <AppShell
      title="AI Agent Ecosystem"
      subtitle="Six specialized agents, each an expert in one slice of sustainability."
    >
      <div className="mb-6 flex items-center gap-2">
        <Badge variant="outline" className="border-primary/30 text-primary">
          <Sparkles className="w-3 h-3 mr-1" /> Powered by Lovable AI
        </Badge>
        <span className="text-sm text-muted-foreground">
          Pick the agent best suited to your question.
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {AGENT_LIST.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                to="/app/agents/$agentId"
                params={{ agentId: a.id }}
                className="block group h-full"
              >
                <Card className="h-full p-6 backdrop-blur-xl bg-background/40 border border-white/10 hover:border-primary/40 transition relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                  <div className="flex items-start justify-between">
                    <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${a.accent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{a.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{a.role}</p>
                  <p className="mt-3 text-sm text-foreground/80">{a.tagline}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
