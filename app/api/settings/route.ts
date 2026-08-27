import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/store";
import type { SiteSettings } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = (await request.json()) as SiteSettings;
  if (!body.agencyName || !body.primaryColor || !body.accentColor) {
    return NextResponse.json({ error: "Zorunlu ayarlar eksik." }, { status: 400 });
  }
  return NextResponse.json(saveSettings(body));
}
