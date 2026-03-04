import { NextResponse } from "next/server";
import { generateText } from "ai";
import { aiModel } from "@/lib/ai/config";
import { videoReviewPrompt } from "@/lib/ai/prompts";
import { auth } from "../../../../../auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await request.json();

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "タイトルを入力してください" },
      { status: 400 }
    );
  }

  const prompt = description?.trim()
    ? `タイトル: ${title.trim()}\n説明文: ${description.trim()}`
    : `タイトル: ${title.trim()}\n説明文: なし`;

  const { text } = await generateText({
    model: aiModel,
    system: videoReviewPrompt,
    prompt,
  });

  return NextResponse.json({ review: text });
}
