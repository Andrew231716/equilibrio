"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diarySchema, type DiaryFormValues } from "@/lib/schemas";
import { DIARY_CATEGORIES, EMOTIONS } from "@/lib/constants";
import { IntensitySlider } from "@/components/ui/IntensitySlider";
import { Button } from "@/components/ui/Button";
import { localDateTime } from "@/lib/utils";
import type { EmotionId } from "@/types";

export function DiaryForm({
  defaultValues,
  onSubmit,
  submitLabel = "Salva voce",
}: {
  defaultValues?: Partial<DiaryFormValues>;
  onSubmit: (values: DiaryFormValues) => void;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DiaryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(diarySchema) as any,
    defaultValues: {
      datetime: defaultValues?.datetime ?? localDateTime(),
      category: defaultValues?.category ?? "lavoro",
      description: defaultValues?.description ?? "",
      primaryEmotion: defaultValues?.primaryEmotion ?? "stressato",
      secondaryEmotions: defaultValues?.secondaryEmotions ?? [],
      emotionIntensity: defaultValues?.emotionIntensity ?? 5,
      stressIntensity: defaultValues?.stressIntensity ?? 5,
      thoughts: defaultValues?.thoughts ?? "",
      reaction: defaultValues?.reaction ?? "",
      physicalSymptoms: defaultValues?.physicalSymptoms ?? "",
      strategy: defaultValues?.strategy ?? "",
      outcome: defaultValues?.outcome ?? "",
      couldDoDifferently: defaultValues?.couldDoDifferently ?? "",
      learned: defaultValues?.learned ?? "",
    },
  });

  const secondary = useWatch({ control, name: "secondaryEmotions" }) ?? [];
  const primary = useWatch({ control, name: "primaryEmotion" });

  function toggleSecondary(id: EmotionId) {
    if (id === primary) return;
    const next = secondary.includes(id) ? secondary.filter((x) => x !== id) : [...secondary, id];
    setValue("secondaryEmotions", next);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="datetime">
            Data e ora
          </label>
          <input id="datetime" type="datetime-local" className="input" {...register("datetime")} />
          {errors.datetime ? <p className="mt-1 text-sm text-[var(--danger)]">{errors.datetime.message}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="category">
            Ambito
          </label>
          <select id="category" className="select" {...register("category")}>
            {DIARY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          Descrizione
        </label>
        <textarea id="description" className="textarea" {...register("description")} />
        {errors.description ? (
          <p className="mt-1 text-sm text-[var(--danger)]">{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <p className="label">Emozione principale</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setValue("primaryEmotion", e.id)}
              className="rounded-xl border px-2 py-2 text-sm"
              style={{
                borderColor: primary === e.id ? e.color : "var(--border)",
                background:
                  primary === e.id ? `color-mix(in oklab, ${e.color} 20%, transparent)` : "transparent",
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Emozioni secondarie</p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.filter((e) => e.id !== primary).map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => toggleSecondary(e.id)}
              className="rounded-full border px-3 py-1 text-xs"
              style={{
                borderColor: secondary.includes(e.id) ? e.color : "var(--border)",
                background: secondary.includes(e.id)
                  ? `color-mix(in oklab, ${e.color} 18%, transparent)`
                  : "transparent",
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <Controller
        control={control}
        name="emotionIntensity"
        render={({ field }) => (
          <IntensitySlider label="Intensità emozione" value={field.value} onChange={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="stressIntensity"
        render={({ field }) => (
          <IntensitySlider label="Intensità stress" value={field.value} onChange={field.onChange} />
        )}
      />

      {(
        [
          ["thoughts", "Pensieri"],
          ["reaction", "Reazione"],
          ["physicalSymptoms", "Sintomi fisici"],
          ["strategy", "Strategia usata"],
          ["outcome", "Risultato"],
          ["couldDoDifferently", "Cosa avrei potuto fare diversamente"],
          ["learned", "Cosa ho imparato"],
        ] as const
      ).map(([name, label]) => (
        <div key={name}>
          <label className="label" htmlFor={name}>
            {label}
          </label>
          <textarea id={name} className="textarea" {...register(name)} />
        </div>
      ))}

      <Button type="submit" className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
