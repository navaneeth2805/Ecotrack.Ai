import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, StopCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AGENTS, type AgentId } from "@/lib/agents";
import { toast } from "sonner";

export const Route = createFileRoute("/app/agents/$agentId")({
  beforeLoad: ({ params }) => {
    if (!(params.agentId in AGENTS)) throw notFound();
  },
  component: AgentChatPage,
});

function AgentChatPage() {
  const { agentId } = useParams({ from: "/app/agents/$agentId" });
  const agent = AGENTS[agentId as AgentId];
  const Icon = agent.icon;
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    id: agent.id,
    transport: new DefaultChatTransport({ api: "/api/agents/chat" }),
    onError: (err) => toast.error(err.message || "Agent request failed"),
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, [agent.id, status]);

  const isBusy = status === "submitted" || status === "streaming";

  async function handleSubmit(message: { text?: string }) {
    const text = (message.text ?? input).trim();
    if (!text || isBusy) return;
    setInput("");
    await sendMessage(
      { text },
      { body: { agentId: agent.id } },
    );
  }

  function pickPrompt(p: string) {
    if (isBusy) return;
    sendMessage({ text: p }, { body: { agentId: agent.id } });
  }

  return (
    <AppShell title="" subtitle="">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/app/agents">
            <ArrowLeft className="h-4 w-4 mr-1" /> All agents
          </Link>
        </Button>
      </div>

      <Card className="backdrop-blur-xl bg-background/40 border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-white/5">
          <div className={`h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${agent.accent}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold">{agent.name}</h1>
              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                {agent.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{agent.description}</p>
          </div>
        </div>

        {/* Chat surface */}
        <div className="flex flex-col h-[calc(100vh-22rem)] min-h-[480px]">
          <Conversation className="flex-1">
            <ConversationContent>
              {messages.length === 0 ? (
                <EmptyState agent={agent} onPick={pickPrompt} />
              ) : (
                messages.map((m) => {
                  const text = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  if (m.role === "user") {
                    return (
                      <Message key={m.id} from="user">
                        <MessageContent>{text}</MessageContent>
                      </Message>
                    );
                  }
                  return (
                    <Message key={m.id} from="assistant">
                      <MessageContent>
                        <MessageResponse>{text || " "}</MessageResponse>
                      </MessageContent>
                    </Message>
                  );
                })
              )}
              {status === "submitted" && (
                <Message from="assistant">
                  <MessageContent>
                    <Shimmer>Thinking…</Shimmer>
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Composer */}
          <div className="border-t border-white/5 p-4">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask the ${agent.name}…`}
              />
              <PromptInputFooter className="justify-end">
                {isBusy ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    onClick={() => stop()}
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <PromptInputSubmit
                    status={status}
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </PromptInputSubmit>
                )}
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}

function EmptyState({
  agent,
  onPick,
}: {
  agent: (typeof AGENTS)[AgentId];
  onPick: (q: string) => void;
}) {
  const Icon = agent.icon;
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className={`h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center ${agent.accent} mb-4`}>
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold">{agent.tagline}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">{agent.description}</p>

      <div className="mt-6 grid gap-2 w-full max-w-2xl sm:grid-cols-2">
        {agent.suggested.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="text-left text-sm p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
