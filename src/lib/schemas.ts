import { z } from "zod";

export const emotionSchema = z.enum([
  "sereno",
  "motivato",
  "felice",
  "preoccupato",
  "ansioso",
  "stressato",
  "frustrato",
  "arrabbiato",
  "triste",
  "stanco",
]);

export const categorySchema = z.enum([
  "lavoro",
  "rapporti",
  "sentimentali",
  "famiglia",
  "aspettative",
  "futuro",
  "imprevisti",
  "altro",
]);

export const checkInSchema = z.object({
  emotion: emotionSchema,
  intensity: z.number().min(1).max(10),
  note: z.string().max(500).optional(),
  situation: z.string().max(500).optional(),
});

export const diarySchema = z.object({
  datetime: z.string().min(1, "Data e ora obbligatorie"),
  category: categorySchema,
  description: z.string().min(3, "Descrivi la situazione (min. 3 caratteri)"),
  primaryEmotion: emotionSchema,
  secondaryEmotions: z.array(emotionSchema).default([]),
  emotionIntensity: z.number().min(1).max(10),
  stressIntensity: z.number().min(1).max(10),
  thoughts: z.string().optional(),
  reaction: z.string().optional(),
  physicalSymptoms: z.string().optional(),
  strategy: z.string().optional(),
  outcome: z.string().optional(),
  couldDoDifferently: z.string().optional(),
  learned: z.string().optional(),
});

export type CheckInFormValues = z.infer<typeof checkInSchema>;
export type DiaryFormValues = z.infer<typeof diarySchema>;
