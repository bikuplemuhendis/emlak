"use client";

import { FormEvent, useState } from "react";

export function InquiryForm({
  propertyId,
  propertySlug,
  source,
}: {
  propertyId?: string;
  propertySlug?: string;
  source: "contact" | "property" | "office";
}) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
        propertyId,
        propertySlug,
        source,
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Talep gönderilemedi. Lütfen alanları kontrol edin.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-md bg-cream p-4 text-sm">
        Talebiniz ofise iletildi. En kısa sürede sizi arayacağız.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div>
        <label htmlFor={`${source}-name`}>Ad soyad</label>
        <input id={`${source}-name`} name="name" required autoComplete="name" />
      </div>
      <div>
        <label htmlFor={`${source}-email`}>E-posta</label>
        <input id={`${source}-email`} name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label htmlFor={`${source}-phone`}>Telefon</label>
        <input id={`${source}-phone`} name="phone" required autoComplete="tel" />
      </div>
      <div>
        <label htmlFor={`${source}-message`}>Mesaj</label>
        <textarea id={`${source}-message`} name="message" required minLength={8} />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn btn-gold" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Talep gönder"}
      </button>
    </form>
  );
}
