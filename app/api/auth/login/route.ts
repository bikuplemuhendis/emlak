import { NextResponse } from "next/server";
import { AUTH_COOKIE, adminPassword, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string; next?: string } | null;
  if (!body?.password || body.password !== adminPassword()) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true, next: body.next || "/admin" });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
