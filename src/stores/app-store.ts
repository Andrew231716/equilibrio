"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { APP_STORAGE_KEY } from "@/lib/constants";
import { todayKey, uid } from "@/lib/utils";
import type {
  AppState,
  Badge,
  DailyCheckIn,
  LessonProgress,
  PersonalGoal,
  StarSession,
  StressEntry,
  ThemeMode,
  ToolSession,
  UserPreferences,
  WeeklyReview,
} from "@/types";
import { backupSchema } from "@/lib/backup";
import { LESSONS } from "@/data/lessons";

const defaultPreferences = (): UserPreferences => ({
  name: "",
  startDate: todayKey(),
  theme: "system",
  remindersEnabled: false,
  reminderTime: "20:00",
  weeklyGoalDays: 5,
  pathCycle: 1,
  goals: [],
  favoriteArticles: [],
  aiConsent: false,
});

type Actions = {
  setHydrated: (v: boolean) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  setTheme: (theme: ThemeMode) => void;
  addCheckIn: (input: Omit<DailyCheckIn, "id" | "createdAt">) => void;
  addDiaryEntry: (entry: Omit<StressEntry, "id" | "createdAt" | "updatedAt">) => string;
  updateDiaryEntry: (id: string, patch: Partial<StressEntry>) => void;
  deleteDiaryEntry: (id: string) => void;
  upsertLessonProgress: (day: number, patch: Partial<LessonProgress>) => void;
  completeLesson: (day: number) => void;
  saveStarSession: (session: Omit<StarSession, "id" | "createdAt">) => string;
  saveToolSession: (toolId: string, data: ToolSession["data"]) => void;
  addWeeklyReview: (review: Omit<WeeklyReview, "id" | "createdAt">) => void;
  toggleFavoriteArticle: (id: string) => void;
  addGoal: (text: string) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  unlockBadge: (id: string) => void;
  evaluateBadges: () => void;
  exportData: () => string;
  importData: (json: string) => { ok: boolean; error?: string };
  resetAllData: () => void;
  restartPath: () => void;
  currentPathDay: () => number;
  completedLessonsCount: () => number;
};

export type EquilibrioStore = AppState & Actions;

function emptyState(): AppState {
  return {
    preferences: defaultPreferences(),
    checkIns: [],
    diary: [],
    lessonProgress: {},
    starSessions: [],
    toolSessions: [],
    weeklyReviews: [],
    badges: [],
    hydrated: false,
  };
}

function withBadge(badges: Badge[], id: string): Badge[] {
  if (badges.some((b) => b.id === id)) return badges;
  return [...badges, { id, unlockedAt: new Date().toISOString() }];
}

export const useAppStore = create<EquilibrioStore>()(
  persist(
    (set, get) => ({
      ...emptyState(),

      setHydrated: (v) => set({ hydrated: v }),

      updatePreferences: (patch) =>
        set((s) => ({ preferences: { ...s.preferences, ...patch } })),

      setTheme: (theme) => set((s) => ({ preferences: { ...s.preferences, theme } })),

      addCheckIn: (input) => {
        const entry: DailyCheckIn = {
          ...input,
          id: uid("checkin"),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ checkIns: [entry, ...s.checkIns.filter((c) => c.date !== entry.date)] }));
        get().evaluateBadges();
      },

      addDiaryEntry: (entry) => {
        const id = uid("diary");
        const now = new Date().toISOString();
        const full: StressEntry = { ...entry, id, createdAt: now, updatedAt: now };
        set((s) => ({ diary: [full, ...s.diary] }));
        get().evaluateBadges();
        return id;
      },

      updateDiaryEntry: (id, patch) =>
        set((s) => ({
          diary: s.diary.map((e) =>
            e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e,
          ),
        })),

      deleteDiaryEntry: (id) => set((s) => ({ diary: s.diary.filter((e) => e.id !== id) })),

      upsertLessonProgress: (day, patch) =>
        set((s) => {
          const prev = s.lessonProgress[day] ?? {
            day,
            completed: false,
            exerciseAnswers: {},
            reflectionAnswers: {},
            completedActivities: [],
          };
          return {
            lessonProgress: {
              ...s.lessonProgress,
              [day]: { ...prev, ...patch, day },
            },
          };
        }),

      completeLesson: (day) => {
        get().upsertLessonProgress(day, {
          completed: true,
          completedAt: new Date().toISOString(),
        });
        get().evaluateBadges();
      },

      saveStarSession: (session) => {
        const id = uid("star");
        const full: StarSession = { ...session, id, createdAt: new Date().toISOString() };
        set((s) => ({ starSessions: [full, ...s.starSessions] }));
        get().evaluateBadges();
        return id;
      },

      saveToolSession: (toolId, data) => {
        const session: ToolSession = {
          id: uid("tool"),
          toolId,
          createdAt: new Date().toISOString(),
          data,
        };
        set((s) => ({ toolSessions: [session, ...s.toolSessions] }));
        get().evaluateBadges();
      },

      addWeeklyReview: (review) => {
        const full: WeeklyReview = {
          ...review,
          id: uid("review"),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ weeklyReviews: [full, ...s.weeklyReviews] }));
        get().evaluateBadges();
      },

      toggleFavoriteArticle: (id) =>
        set((s) => {
          const favs = s.preferences.favoriteArticles;
          const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
          return { preferences: { ...s.preferences, favoriteArticles: next } };
        }),

      addGoal: (text) => {
        const goal: PersonalGoal = {
          id: uid("goal"),
          text,
          createdAt: new Date().toISOString(),
          completed: false,
        };
        set((s) => ({
          preferences: { ...s.preferences, goals: [...s.preferences.goals, goal] },
        }));
      },

      toggleGoal: (id) =>
        set((s) => ({
          preferences: {
            ...s.preferences,
            goals: s.preferences.goals.map((g) =>
              g.id === id ? { ...g, completed: !g.completed } : g,
            ),
          },
        })),

      deleteGoal: (id) =>
        set((s) => ({
          preferences: {
            ...s.preferences,
            goals: s.preferences.goals.filter((g) => g.id !== id),
          },
        })),

      unlockBadge: (id) => set((s) => ({ badges: withBadge(s.badges, id) })),

      evaluateBadges: () => {
        const s = get();
        let badges = s.badges;
        if (s.checkIns.length >= 1) badges = withBadge(badges, "first-checkin");
        if (s.checkIns.length >= 5) badges = withBadge(badges, "five-observe");
        if (s.diary.length >= 1) badges = withBadge(badges, "first-diary");
        if (s.starSessions.length >= 1) badges = withBadge(badges, "first-star");
        if (s.weeklyReviews.length >= 1) badges = withBadge(badges, "first-review");
        const completed = Object.values(s.lessonProgress).filter((p) => p.completed).length;
        if (completed >= 7) badges = withBadge(badges, "first-week");
        if (completed >= 30) badges = withBadge(badges, "path-complete");
        const toolIds = new Set(s.toolSessions.map((t) => t.toolId));
        if (toolIds.size >= 3) badges = withBadge(badges, "three-tools");
        if (badges !== s.badges) set({ badges });
      },

      exportData: () => {
        const s = get();
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          preferences: s.preferences,
          checkIns: s.checkIns,
          diary: s.diary,
          lessonProgress: s.lessonProgress,
          starSessions: s.starSessions,
          toolSessions: s.toolSessions,
          weeklyReviews: s.weeklyReviews,
          badges: s.badges,
        };
        return JSON.stringify(payload, null, 2);
      },

      importData: (json) => {
        try {
          const parsed = backupSchema.safeParse(JSON.parse(json));
          if (!parsed.success) return { ok: false, error: "Backup non valido o versione non supportata. I dati attuali non sono stati modificati." };
          const data = parsed.data;
          set({
            preferences: { ...defaultPreferences(), ...(data.preferences ?? {}) },
            checkIns: data.checkIns ?? [],
            diary: data.diary ?? [],
            lessonProgress: data.lessonProgress ?? {},
            starSessions: data.starSessions ?? [],
            toolSessions: data.toolSessions ?? [],
            weeklyReviews: data.weeklyReviews ?? [],
            badges: data.badges ?? [],
          });
          return { ok: true };
        } catch {
          return { ok: false, error: "JSON non leggibile" };
        }
      },

      resetAllData: () => set({ ...emptyState(), hydrated: true }),

      restartPath: () =>
        set((s) => ({
          lessonProgress: {},
          preferences: {
            ...s.preferences,
            pathCycle: s.preferences.pathCycle + 1,
            startDate: todayKey(),
          },
        })),

      currentPathDay: () => {
        const progress = get().lessonProgress;
        for (let d = 1; d <= LESSONS.length; d++) {
          if (!progress[d]?.completed) return d;
        }
        return LESSONS.length;
      },

      completedLessonsCount: () =>
        Object.values(get().lessonProgress).filter((p) => p.completed).length,
    }),
    {
      name: APP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        preferences: s.preferences,
        checkIns: s.checkIns,
        diary: s.diary,
        lessonProgress: s.lessonProgress,
        starSessions: s.starSessions,
        toolSessions: s.toolSessions,
        weeklyReviews: s.weeklyReviews,
        badges: s.badges,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
