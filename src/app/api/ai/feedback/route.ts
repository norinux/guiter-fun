import { NextResponse } from "next/server";
import { generateText } from "ai";
import { aiModel } from "@/lib/ai/config";
import { performanceFeedbackPrompt } from "@/lib/ai/prompts";
import { auth } from "../../../../../auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { description } = await request.json();

  if (!description?.trim()) {
    return NextResponse.json(
      { error: "練習内容を入力してください" },
      { status: 400 }
    );
  }

  const { text } = await generateText({
    model: aiModel,
    system: performanceFeedbackPrompt,
    prompt: description.trim(),
  });

  return NextResponse.json({ feedback: text });
}
