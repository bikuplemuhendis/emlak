import { NextResponse } from "next/server";
import { addInquiry, getInquiries } from "@/lib/store";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(getInquiries());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    propertyId?: string;
    propertySlug?: string;
    source?: "contact" | "property" | "office" | "newsletter";
  } | null;
  if (!body?.name || !body.email || !body.phone || !body.message) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }
  const saved = addInquiry({
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    message: String(body.message).trim(),
    propertyId: body.propertyId,
    propertySlug: body.propertySlug,
    source: body.source || "contact",
  });
  return NextResponse.json(saved);
}
