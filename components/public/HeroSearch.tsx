"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CITIES, PROPERTY_TYPES, STATUSES } from "@/lib/constants";
import { cn } from "@/lib/format";

export function HeroSearch({
  compact = false,
  defaultValues,
}: {
  compact?: boolean;
  defaultValues?: {
    q?: string;
    status?: string;
    type?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValues?.q ?? "");
  const [status, setStatus] = useState(defaultValues?.status ?? "");
  const [type, setType] = useState(defaultValues?.type ?? "");
  const [city, setCity] = useState(defaultValues?.city ?? "");
  const [minPrice, setMinPrice] = useState(defaultValues?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(defaultValues?.maxPrice ?? "");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/ilanlar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "grid gap-3",
        compact
          ? "md:grid-cols-2 lg:grid-cols-6"
          : "rounded-md bg-white/95 p-4 shadow-2xl backdrop-blur md:grid-cols-2 lg:grid-cols-6 lg:p-5",
      )}
    >
      <div className="lg:col-span-2">
        <label htmlFor="hero-q">Anahtar kelime</label>
        <input
          id="hero-q"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Örn. Nişantaşı, villa, teras"
        />
      </div>
      <div>
        <label htmlFor="hero-status">Durum</label>
        <select id="hero-status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tümü</option>
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="hero-type">Tip</label>
        <select id="hero-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tümü</option>
          {PROPERTY_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="hero-city">Konum</label>
        <select id="hero-city" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Tüm şehirler</option>
          {CITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:col-span-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="hero-min">Min. fiyat</label>
          <input
            id="hero-min"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="hero-max">Maks. fiyat</label>
          <input
            id="hero-max"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Sınırsız"
          />
        </div>
        <button type="submit" className="btn btn-gold mt-5 w-full lg:mt-0 lg:min-w-40">
          İlanları getir
        </button>
      </div>
      {!compact ? (
        <p className="lg:col-span-6">
          <Link href="/ilanlar" className="text-sm font-semibold text-navy underline-offset-4 hover:underline">
            Gelişmiş arama ve harita görünümü
          </Link>
        </p>
      ) : null}
    </form>
  );
}
