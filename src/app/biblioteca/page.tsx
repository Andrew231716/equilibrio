"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/data/articles";
import { useAppStore } from "@/stores/app-store";

export default function BibliotecaPage() {
  const favorites = useAppStore((s) => s.preferences.favoriteArticles);
  const [category, setCategory] = useState<string>("tutte");
  const [onlyFav, setOnlyFav] = useState(false);

  const list = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (category !== "tutte" && a.category !== category) return false;
      if (onlyFav && !favorites.includes(a.id)) return false;
      return true;
    });
  }, [category, onlyFav, favorites]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">Biblioteca</h1>
        <p className="mt-2 text-[var(--muted)]">
          Articoli educativi su stress, emozioni e pratiche di equilibrio. {ARTICLES.length} contenuti.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("tutte")}
          className={`rounded-full border px-3 py-1.5 text-sm ${category === "tutte" ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_16%,transparent)]" : "border-[var(--border)]"}`}
        >
          Tutte
        </button>
        {ARTICLE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1.5 text-sm ${category === c ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_16%,transparent)]" : "border-[var(--border)]"}`}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOnlyFav((v) => !v)}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${onlyFav ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_16%,transparent)]" : "border-[var(--border)]"}`}
        >
          <Heart size={14} /> Preferiti
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((a) => (
          <Link key={a.id} href={`/biblioteca/${a.id}`}>
            <Card className="h-full transition hover:border-[var(--sage-deep)]">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{a.category}</p>
              <h2 className="font-display mt-1 text-xl text-[var(--forest)]">{a.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{a.summary}</p>
              <p className="mt-3 text-xs text-[var(--muted)]">{a.readingMinutes} min · {favorites.includes(a.id) ? "Nei preferiti" : "Apri"}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
