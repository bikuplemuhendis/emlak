import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { getProperties, upsertProperty } from "@/lib/store";
import type { PropertyInput } from "@/lib/types";

async function requireAdmin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(getProperties());
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = (await request.json()) as PropertyInput;
  if (!body.title || !body.type || !body.status) {
    return NextResponse.json({ error: "Başlık, tip ve durum zorunlu." }, { status: 400 });
  }
  const saved = upsertProperty(body);
  return NextResponse.json(saved);
}
