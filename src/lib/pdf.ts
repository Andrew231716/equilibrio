"use client";

import { jsPDF } from "jspdf";
import type { WeeklyReview } from "@/types";
import { emotionLabel, categoryLabel, formatDateIT } from "./utils";

export async function exportWeeklyReviewPdf(review: WeeklyReview, userName?: string) {
  const doc = new jsPDF();
  let y = 20;
  const line = (text: string, size = 11) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);
    y += lines.length * (size * 0.45) + 4;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  line("EQUILIBRIO – Revisione", 18);
  if (userName) line(`Per: ${userName}`);
  line(`Periodo: ${formatDateIT(review.weekStart)} – ${formatDateIT(review.weekEnd)}`);
  line(`Voci diario: ${review.entriesCount} · Check-in: ${review.checkInsCount}`);
  line(`Media stress: ${review.avgStress ?? "n/d"}`);
  line(
    `Emozioni top: ${review.topEmotions.map((e) => `${emotionLabel(e.emotion)} (${e.count})`).join(", ") || "n/d"}`,
  );
  line(
    `Ambiti top: ${review.topCategories.map((c) => `${categoryLabel(c.category)} (${c.count})`).join(", ") || "n/d"}`,
  );
  line(`Strategie: ${review.strategiesUsed.join("; ") || "nessuna annotata"}`);
  line(`Note: ${review.notes || "—"}`);
  line(`Punti di forza: ${review.strengths || "—"}`);
  line(`Aree di lavoro: ${review.focusAreas || "—"}`);
  line("Questo report descrive i tuoi dati personali. Non è una diagnosi.");
  doc.save(`equilibrio-revisione-${review.weekStart}.pdf`);
}
