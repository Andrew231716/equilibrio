# Modello dati suggerito

Usare TypeScript e un singolo schema versionato per localStorage o IndexedDB. Tutti i dati sono locali nella prima versione.

```ts
type UserProfile = {
  schemaVersion: number;
  name?: string;
  age: number;                 // default 26, modificabile
  sexForFormula: "male" | "female" | "unspecified";
  heightCm: number;            // 180
  startWeightKg: number;       // 88
  goalWeightKg: number;        // 80
  startDate: string;           // YYYY-MM-DD
  calorieTargetKcal: number;   // default 1900, clearly estimated
  proteinTargetG: number;      // 130
  carbsTargetG: number;        // 200
  fatTargetG: number;          // 65
  lunchRoutine: "home" | "other";
  weekendMealsOut: number;     // default 1-2, configurable
  sweetsPreference: boolean;
  health: {
    lumbarDiscHernia: boolean;
    radiatingLegPain: boolean;
    previousInguinalHerniaRepair: boolean;
    clinicianClearedActivity: boolean | null;
    allowedActivities: string[];
    restrictedMovements: string[];
    notes?: string;
  };
};

type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
  note?: string;
};

type WaistEntry = {
  id: string;
  date: string;
  waistCm: number;
  note?: string;
};

type DailyLog = {
  date: string;
  dayNumber: number;           // 1..30
  habits: {
    portions: boolean;
    protein: boolean;
    fruitVegetables: boolean;
    sweetsManaged: boolean;
    hydration: boolean;
    restAndAllowedActivity: boolean;
  };
  dayStatus: "not-started" | "partial" | "completed";
  mealsOut?: number;
  sweetsNote?: string;
  notes?: string;
  activity?: {
    type: string;
    durationMinutes?: number;
    symptomsDuringOrAfter?: string;
  };
};

type AppState = {
  profile: UserProfile;
  weightEntries: WeightEntry[];
  waistEntries: WaistEntry[];
  dailyLogs: DailyLog[];
};
```

## Regole di calcolo

- Giorno programma = differenza tra data locale corrente e startDate + 1; clamp 1–30. Se prima della data, mostra “Il percorso inizia il…”. Dopo 30, mostra report e opzione nuovo ciclo.
- BMI = peso / (altezza in metri)^2; etichettarlo come indicatore orientativo.
- BMR Mifflin-St Jeor: usare sesso/parametro scelto dall'utente; se non specificato, non inventare e chiedere oppure mostrare stima non calcolata.
- Per profilo maschile: BMR = 10*peso + 6.25*altezza - 5*età + 5.
- TDEE sedentario indicativo = BMR * 1.2; mostrare range/approssimazione e disclaimer.
- Media settimanale peso: media aritmetica delle misurazioni nella settimana; non calcolare se meno di 2 misurazioni, oppure indicare “dati insufficienti”.
- Variazione girovita = ultima misura - prima misura.
- Mai calcolare “grasso perso” direttamente dal solo peso.
- Non estrapolare una previsione precisa di peso finale.

## Persistenza e privacy

- Chiave localStorage versionata, es. `piano30.state.v1`.
- Validare i dati letti; gestire JSON malformato senza crash.
- Migrazione schema version.
- Esportazione JSON e CSV.
- Importazione con validazione e conferma prima di sovrascrivere.
- Nessuna telemetria, tracking o backend nella prima release.
