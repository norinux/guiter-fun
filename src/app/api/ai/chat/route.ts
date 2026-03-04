import { streamText } from "ai";
import { aiModel } from "@/lib/ai/config";
import { getPracticeAssistantPrompt, type SkillLevel } from "@/lib/ai/prompts";
import { auth } from "../../../../../auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, level = "beginner" } = await request.json();

  const result = streamText({
    model: aiModel,
    system: getPracticeAssistantPrompt(level as SkillLevel),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
