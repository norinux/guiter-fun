import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: "名前、メールアドレス、パスワードは必須です" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "パスワードは8文字以上にしてください" },
      { status: 400 }
    );
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);

    const existing = await sql`SELECT id FROM users WHERE email = ${email.trim()}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (gen_random_uuid()::text, ${name.trim()}, ${email.trim()}, ${passwordHash})
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Signup error:", message);
    return NextResponse.json(
      { error: "サーバーエラー: " + message },
      { status: 500 }
    );
  }
}
