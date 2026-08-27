import { NextResponse } from "next/server";
import { addInquiry } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
  }
  addInquiry({
    name: "Bülten",
    email,
    phone: "-",
    message: "Bülten kaydı",
    source: "newsletter",
  });
  return NextResponse.json({ ok: true });
}
