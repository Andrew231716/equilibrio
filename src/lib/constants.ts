import type { DiaryCategory, EmotionMeta, ToolDefinition } from "@/types";

export const APP_NAME = "EQUILIBRIO";
export const APP_STORAGE_KEY = "equilibrio-v1";

export const EMOTIONS: EmotionMeta[] = [
  { id: "sereno", label: "Sereno", color: "#7FA88A" },
  { id: "motivato", label: "Motivato", color: "#5B8C6A" },
  { id: "felice", label: "Felice", color: "#C4A35A" },
  { id: "preoccupato", label: "Preoccupato", color: "#B89A5A" },
  { id: "ansioso", label: "Ansioso", color: "#C17B5A" },
  { id: "stressato", label: "Stressato", color: "#A65D4F" },
  { id: "frustrato", label: "Frustrato", color: "#8B6B5A" },
  { id: "arrabbiato", label: "Arrabbiato", color: "#9B4D3F" },
  { id: "triste", label: "Triste", color: "#6B7C8F" },
  { id: "stanco", label: "Stanco", color: "#8A8A7A" },
];

export const DIARY_CATEGORIES: { id: DiaryCategory; label: string }[] = [
  { id: "lavoro", label: "Lavoro e responsabilità" },
  { id: "rapporti", label: "Rapporti sociali" },
  { id: "sentimentali", label: "Situazioni sentimentali" },
  { id: "famiglia", label: "Famiglia" },
  { id: "aspettative", label: "Aspettative personali" },
  { id: "futuro", label: "Futuro e incertezza" },
  { id: "imprevisti", label: "Situazioni impreviste" },
  { id: "altro", label: "Altro" },
];

export const MODULES = [
  { id: 1 as const, title: "Riconoscere lo stress", days: [1, 7] },
  { id: 2 as const, title: "Gestire le emozioni", days: [8, 14] },
  { id: 3 as const, title: "Trasformare lo stress in energia", days: [15, 21] },
  { id: 4 as const, title: "Consolidare l'equilibrio", days: [22, 30] },
];

export const TOOLS: ToolDefinition[] = [
  {
    id: "pausa",
    slug: "pausa",
    title: "Pausa consapevole",
    description: "Interrompi il pilota automatico e riprendi contatto con te stesso.",
    icon: "Pause",
  },
  {
    id: "respirazione",
    slug: "respirazione",
    title: "Respirazione guidata",
    description: "Ritmi personalizzabili per calmare il sistema nervoso.",
    icon: "Wind",
  },
  {
    id: "pensieri",
    slug: "pensieri",
    title: "Analisi dei pensieri",
    description: "Distingui fatti, interpretazioni e alternative più utili.",
    icon: "Brain",
  },
  {
    id: "controllo",
    slug: "controllo",
    title: "Cerchio del controllo",
    description: "Separa ciò che puoi controllare, influenzare o accettare.",
    icon: "CircleDot",
  },
  {
    id: "frustrazione",
    slug: "frustrazione",
    title: "Gestione frustrazione",
    description: "Trasforma l'irritazione in chiarezza e azione concreta.",
    icon: "Flame",
  },
  {
    id: "pressione",
    slug: "pressione",
    title: "Pressione → azione",
    description: "Converti la pressione in un passo piccolo e realistico.",
    icon: "Target",
  },
  {
    id: "recupero",
    slug: "recupero",
    title: "Recupero mentale",
    description: "Ripristina energie dopo una giornata impegnativa.",
    icon: "Leaf",
  },
];

export const BADGE_DEFS = [
  { id: "first-checkin", title: "Primo check-in", description: "Hai registrato come ti senti." },
  { id: "first-week", title: "Prima settimana", description: "7 giornate del percorso completate." },
  { id: "first-star", title: "Primo S.T.A.R.", description: "Hai usato il metodo S.T.A.R." },
  { id: "five-observe", title: "5 giorni di osservazione", description: "Cinque check-in registrati." },
  { id: "first-review", title: "Primo bilancio", description: "Hai completato una revisione settimanale." },
  { id: "path-complete", title: "Percorso 30 giorni", description: "Hai completato tutto il percorso." },
  { id: "first-diary", title: "Primo diario", description: "Hai scritto la prima voce nel diario." },
  { id: "three-tools", title: "Tre strumenti", description: "Hai usato tre strumenti diversi." },
] as const;

export const MOTIVATIONAL_MESSAGES = [
  "Oggi basta un passo piccolo e chiaro.",
  "Lo stress non è un nemico: è un segnale da ascoltare.",
  "Puoi osservare un'emozione senza obbedirle.",
  "L'equilibrio si costruisce con pratica quotidiana, non con perfezione.",
  "Accettare ciò che non controlli libera energia per ciò che puoi fare.",
  "Una pausa consapevole vale più di dieci reazioni impulsive.",
  "Il progresso è spesso silenzioso: conta anche quando non lo vedi.",
];
