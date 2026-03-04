import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 });
  }

  try {
    const blob = await put(`videos/${session.user.id}/${Date.now()}_${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Upload error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
