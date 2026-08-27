"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  if (!images.length) {
    return <div className="aspect-[16/9] rounded-md bg-cream" />;
  }
  const current = images[index] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-cream">
        <Image src={current} alt={`${title} görseli ${index + 1}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 70vw" priority />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-white/90 p-2"
              aria-label="Önceki görsel"
              onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/90 p-2"
              aria-label="Sonraki görsel"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md ring-2 ${i === index ? "ring-gold" : "ring-transparent"}`}
              aria-label={`Görsel ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
