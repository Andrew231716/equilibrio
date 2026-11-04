"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { getArticle } from "@/data/articles";
import { useAppStore } from "@/stores/app-store";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = getArticle(id);
  const favorites = useAppStore((s) => s.preferences.favoriteArticles);
  const toggleFavoriteArticle = useAppStore((s) => s.toggleFavoriteArticle);

  if (!article) {
    return (
      <Card>
        <p>Articolo non trovato.</p>
        <Link href="/biblioteca" className="btn btn-secondary mt-3 inline-flex">
          Torna alla biblioteca
        </Link>
      </Card>
    );
  }

  const fav = favorites.includes(article.id);

  return (
    <div className="space-y-4">
      <Link href="/biblioteca" className="inline-flex items-center gap-1 text-sm text-[var(--muted)]">
        <ArrowLeft size={16} /> Biblioteca
      </Link>
      <header className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--sage)_10%,var(--bg-elevated))] p-5">
        <p className="text-sm text-[var(--muted)]">{article.category} · {article.readingMinutes} min</p>
        <h1 className="font-display mt-1 text-3xl text-[var(--forest)]">{article.title}</h1>
        <p className="mt-3 text-[var(--muted)]">{article.summary}</p>
        <Button className="mt-4" type="button" variant="secondary" onClick={() => toggleFavoriteArticle(article.id)}>
          <Heart size={16} fill={fav ? "currentColor" : "none"} /> {fav ? "Nei preferiti" : "Aggiungi ai preferiti"}
        </Button>
      </header>

      <Card>
        <SectionTitle title="Definizione" />
        <p className="text-sm text-[var(--muted)]">{article.definition}</p>
      </Card>
      <Card>
        <SectionTitle title="Spiegazione" />
        <p className="text-sm text-[var(--muted)]">{article.explanation}</p>
      </Card>
      <Card>
        <SectionTitle title="Esempi" />
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          {article.examples.map((ex) => (
            <li key={ex}>• {ex}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <SectionTitle title="Applicazione" />
        <p className="text-sm text-[var(--muted)]">{article.application}</p>
      </Card>
      <Card>
        <SectionTitle title="Esercizio" />
        <p className="text-sm text-[var(--muted)]">{article.exercise}</p>
      </Card>
    </div>
  );
}
