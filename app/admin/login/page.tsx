import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSettings } from "@/lib/store";

export default function AdminLoginPage() {
  const settings = getSettings();
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md rounded-md bg-white p-8 card-shadow">
        <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">{settings.agencyName}</p>
        <h1 className="mt-2 font-serif text-3xl">Yönetim girişi</h1>
        <p className="mt-2 text-sm text-muted">Tek ofis paneli. Demo şifre README dosyasındadır.</p>
        <div className="mt-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold underline-offset-4 hover:underline">
          Siteye dön
        </Link>
      </div>
    </div>
  );
}
