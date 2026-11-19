import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { AGENTS, type AgentId } from "@/lib/agents";

type Body = { messages?: unknown; agentId?: unknown };

export const Route = createFileRoute("/api/agents/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, agentId } = (await request.json()) as Body;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        if (typeof agentId !== "string" || !(agentId in AGENTS)) {
          return new Response("Invalid agentId", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const agent = AGENTS[agentId as AgentId];
        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: agent.systemPrompt,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Agent error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
