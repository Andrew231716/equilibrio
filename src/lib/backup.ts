import { z } from "zod";
import { emotionSchema, categorySchema, diarySchema, checkInSchema } from "./schemas";

const timestamp = z.string().refine((v) => Number.isFinite(Date.parse(v)), "Data non valida");
const date = z.iso.date();
const id = z.string().min(1);
const intensity = z.number().min(1).max(10);
const goal = z.object({ id, text: z.string(), completed: z.boolean(), createdAt: timestamp });
export const preferencesSchema = z.object({
  name: z.string(), startDate: date, theme: z.enum(["light", "dark", "system"]),
  remindersEnabled: z.boolean(), reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  weeklyGoalDays: z.number().int().min(1).max(7), pathCycle: z.number().int().positive(),
  goals: z.array(goal), favoriteArticles: z.array(z.string()), aiConsent: z.boolean(),
});
const progress = z.object({
  day: z.number().int().min(1).max(30), completed: z.boolean(), completedAt: timestamp.optional(),
  exerciseAnswers: z.record(z.string(), z.string()), reflectionAnswers: z.record(z.string(), z.string()),
  completedActivities: z.array(z.string()), notes: z.string().optional(),
});
export const backupSchema = z.object({
  version: z.literal(1),
  preferences: preferencesSchema,
  checkIns: z.array(checkInSchema.extend({ id, date, createdAt: timestamp, note: z.string().optional(), situation: z.string().optional() })),
  diary: z.array(diarySchema.extend({ id, datetime: timestamp, createdAt: timestamp, updatedAt: timestamp,
    source: z.enum(["diario", "star", "strumento"]).optional() })),
  lessonProgress: z.record(z.string().regex(/^(?:[1-9]|[12][0-9]|30)$/), progress).refine(
    (entries) => Object.entries(entries).every(([key, value]) => Number(key) === value.day)),
  starSessions: z.array(z.object({ id, createdAt: timestamp,
    stop: z.object({ situation: z.string(), bodySignals: z.string(), urge: z.string() }),
    observe: z.object({ emotion: emotionSchema, intensity, thoughts: z.string(), facts: z.string() }),
    analyze: z.object({ realProblem: z.string(), automaticThoughts: z.string(), interpretations: z.string(), controllable: z.string(), notControllable: z.string() }),
    respond: z.object({ chosenAction: z.string(), helpfulThought: z.string(), nextStep: z.string() }),
    savedToDiary: z.boolean().optional(), diaryEntryId: z.string().optional(),
  })),
  toolSessions: z.array(z.object({ id, toolId: z.string(), createdAt: timestamp,
    data: z.record(z.string(), z.union([z.string(), z.number(), z.array(z.string())])) })),
  weeklyReviews: z.array(z.object({ id, weekStart: date, weekEnd: date, createdAt: timestamp,
    entriesCount: z.number().int().nonnegative(), checkInsCount: z.number().int().nonnegative(),
    avgStress: intensity.nullable(), topEmotions: z.array(z.object({ emotion: emotionSchema, count: z.number() })),
    topCategories: z.array(z.object({ category: categorySchema, count: z.union([z.string(), z.number()]) })),
    strategiesUsed: z.array(z.string()), notes: z.string(), strengths: z.string(), focusAreas: z.string(),
  })),
  badges: z.array(z.object({ id, unlockedAt: timestamp })),
});
