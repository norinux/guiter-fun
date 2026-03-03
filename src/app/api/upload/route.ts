import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET() {
  return NextResponse.json({
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not set" }, { status: 500 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska",
          ],
          maximumSizeInBytes: 50 * 1024 * 1024,
          tokenPayload: JSON.stringify({ userId: session.user!.id }),
        };
      },
      onUploadCompleted: async () => {
        // Video record is created separately via POST /api/videos
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
