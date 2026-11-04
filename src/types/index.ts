export type EmotionId =
  | "sereno"
  | "motivato"
  | "felice"
  | "preoccupato"
  | "ansioso"
  | "stressato"
  | "frustrato"
  | "arrabbiato"
  | "triste"
  | "stanco";

export type DiaryCategory =
  | "lavoro"
  | "rapporti"
  | "sentimentali"
  | "famiglia"
  | "aspettative"
  | "futuro"
  | "imprevisti"
  | "altro";

export type ThemeMode = "light" | "dark" | "system";

export type ControlCircleZone = "controllare" | "influire" | "non_controllare";

export interface EmotionMeta {
  id: EmotionId;
  label: string;
  color: string;
}

export interface DailyCheckIn {
  id: string;
  date: string; // yyyy-MM-dd
  emotion: EmotionId;
  intensity: number; // 1-10
  note?: string;
  situation?: string;
  createdAt: string;
}

export interface StressEntry {
  id: string;
  datetime: string;
  category: DiaryCategory;
  description: string;
  primaryEmotion: EmotionId;
  secondaryEmotions: EmotionId[];
  emotionIntensity: number;
  stressIntensity: number;
  thoughts?: string;
  reaction?: string;
  physicalSymptoms?: string;
  strategy?: string;
  outcome?: string;
  couldDoDifferently?: string;
  learned?: string;
  source?: "diario" | "star" | "strumento";
  createdAt: string;
  updatedAt: string;
}

export interface LessonActivity {
  id: string;
  label: string;
}

export interface Lesson {
  day: number;
  module: 1 | 2 | 3 | 4;
  moduleTitle: string;
  title: string;
  objective: string;
  theory: string;
  example: string;
  exercise: {
    title: string;
    instructions: string;
    prompts: string[];
  };
  reflectionQuestions: string[];
  activities: LessonActivity[];
  summary: string;
}

export interface LessonProgress {
  day: number;
  completed: boolean;
  completedAt?: string;
  exerciseAnswers: Record<string, string>;
  reflectionAnswers: Record<string, string>;
  completedActivities: string[];
  notes?: string;
}

export interface StarSession {
  id: string;
  createdAt: string;
  stop: {
    situation: string;
    bodySignals: string;
    urge: string;
  };
  observe: {
    emotion: EmotionId;
    intensity: number;
    thoughts: string;
    facts: string;
  };
  analyze: {
    realProblem: string;
    automaticThoughts: string;
    interpretations: string;
    controllable: string;
    notControllable: string;
  };
  respond: {
    chosenAction: string;
    helpfulThought: string;
    nextStep: string;
  };
  savedToDiary?: boolean;
  diaryEntryId?: string;
}

export interface ToolSession {
  id: string;
  toolId: string;
  createdAt: string;
  data: Record<string, string | number | string[]>;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  createdAt: string;
  entriesCount: number;
  checkInsCount: number;
  avgStress: number | null;
  topEmotions: { emotion: EmotionId; count: number }[];
  topCategories: { category: DiaryCategory; count: string | number }[];
  strategiesUsed: string[];
  notes: string;
  strengths: string;
  focusAreas: string;
}

export interface Badge {
  id: string;
  unlockedAt: string;
}

export interface PersonalGoal {
  id: string;
  text: string;
  createdAt: string;
  completed: boolean;
}

export interface UserPreferences {
  name: string;
  startDate: string;
  theme: ThemeMode;
  remindersEnabled: boolean;
  reminderTime: string;
  weeklyGoalDays: number;
  pathCycle: number;
  goals: PersonalGoal[];
  favoriteArticles: string[];
  aiConsent: boolean;
}

export interface AppState {
  preferences: UserPreferences;
  checkIns: DailyCheckIn[];
  diary: StressEntry[];
  lessonProgress: Record<number, LessonProgress>;
  starSessions: StarSession[];
  toolSessions: ToolSession[];
  weeklyReviews: WeeklyReview[];
  badges: Badge[];
  hydrated: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  definition: string;
  explanation: string;
  examples: string[];
  application: string;
  exercise: string;
  readingMinutes: number;
}

export interface ExerciseSeed {
  id: string;
  title: string;
  relatedDays: number[];
  description: string;
  steps: string[];
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
}
