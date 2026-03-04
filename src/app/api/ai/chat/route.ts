import { streamText } from "ai";
import { aiModel } from "@/lib/ai/config";
import { practiceAssistantPrompt } from "@/lib/ai/prompts";
import { auth } from "../../../../../auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await request.json();

  const result = streamText({
    model: aiModel,
    system: practiceAssistantPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
