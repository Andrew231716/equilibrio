"use client";

import { Button } from "./Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Elimina",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="card w-full max-w-md p-5" role="dialog" aria-modal="true">
        <h3 className="font-display text-lg text-[var(--forest)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Annulla
          </Button>
          <Button variant="danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
