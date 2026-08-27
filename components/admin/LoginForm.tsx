"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, next: searchParams.get("next") || "/admin" }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Şifre hatalı.");
      return;
    }
    const data = (await res.json()) as { next: string };
    router.push(data.next || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div>
        <label htmlFor="admin-password">Yönetim şifresi</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn btn-navy" disabled={pending}>
        {pending ? "Giriş…" : "Giriş yap"}
      </button>
    </form>
  );
}
