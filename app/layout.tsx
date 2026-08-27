import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { getSettings } from "@/lib/store";
import "./globals.css";

export const dynamic = "force-dynamic";

const display = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: {
      default: `${settings.agencyName} · ${settings.tagline}`,
      template: `%s · ${settings.agencyName}`,
    },
    description: settings.tagline,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSettings();
  return (
    <html
      lang="tr"
      className={`${display.variable} ${body.variable}`}
      style={
        {
          "--color-primary": settings.primaryColor,
          "--color-accent": settings.accentColor,
        } as React.CSSProperties
      }
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
