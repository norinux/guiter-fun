import { generateText } from "ai";
import { aiModel } from "@/lib/ai/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hasKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!hasKey) {
      return NextResponse.json({
        status: "error",
        message: "GOOGLE_GENERATIVE_AI_API_KEY is not set",
      });
    }

    const { text } = await generateText({
      model: aiModel,
      prompt: "Say hello in Japanese in 5 words or less",
    });

    return NextResponse.json({ status: "ok", response: text });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: String(error),
    });
  }
}
