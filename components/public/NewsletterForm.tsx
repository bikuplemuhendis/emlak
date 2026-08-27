"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      setError("Kayıt alınamadı. E-posta adresini kontrol edin.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="mt-4 text-sm text-gold">Listenize eklendi. Teşekkürler.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        E-posta
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e-posta@adresiniz.com"
        className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
      />
      <button type="submit" className="btn btn-gold">
        Kaydol
      </button>
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
    </form>
  );
}
