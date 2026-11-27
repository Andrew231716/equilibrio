export const COPY = {
  welcome:
    'Benvenuto nel tuo percorso di 30 giorni. L’obiettivo è costruire abitudini sostenibili, monitorare il girovita e migliorare la regolarità. Non serve essere perfetti: conta la continuità.',
  localizedFat:
    'Non possiamo scegliere da quale zona perdere grasso. La riduzione avviene a livello complessivo; il girovita è una misura utile per osservare i cambiamenti nel tempo.',
  calorieTarget:
    'Circa 1.900 kcal al giorno è una stima iniziale, non una prescrizione. Il fabbisogno reale può essere diverso. Rivaluta il target con un medico o dietista se hai condizioni cliniche, assumi farmaci o noti malessere.',
  weightNote:
    'Il peso può variare da un giorno all’altro per acqua, sale, glicogeno e digestione. Guarda la tendenza, non il singolo numero.',
  waistNote:
    'Misura una volta a settimana, al mattino se possibile, all’altezza dell’ombelico, in posizione rilassata e senza stringere il metro. Usa sempre lo stesso metodo.',
  sweets:
    'Non devi eliminare i dolci. Decidi una porzione, gustala senza fretta e poi torna alla tua normale routine. Non servono digiuni o allenamenti compensatori.',
  mealsOut:
    'Un pasto fuori fa parte della vita normale. Scegli ciò che ti piace, cura le porzioni e riprendi la routine al pasto successivo.',
  activityBlocked:
    'Prima di impostare allenamenti, confrontati con il medico o fisioterapista. Con il tuo problema lombare e il dolore irradiato, l’app non può stabilire quali esercizi siano sicuri.',
  activityAllowed:
    'Segui le indicazioni ricevute dal professionista. Registra solo le attività autorizzate e interrompi se il dolore irradiato peggiora o compaiono nuovi sintomi.',
  endOfDay:
    'Una giornata non deve essere perfetta per essere utile. Nota cosa ha funzionato e scegli un piccolo passo per domani.',
  endOfPlan:
    'Il risultato più importante è ciò che hai imparato sulle tue abitudini. Usa i dati per decidere il prossimo passo, senza aumentare automaticamente le restrizioni.',
  urgentSymptoms:
    'Chiedi assistenza medica urgente (112/118) se compaiono sintomi nuovi come: difficoltà a urinare o perdita di controllo di vescica/intestino; perdita di sensibilità nella zona genitale/perineale; debolezza importante o progressiva a una o entrambe le gambe.',
  privacy:
    'Nella prima versione tutti i dati restano sul tuo dispositivo. Nessun account, cloud o analytics. Puoi esportare, importare o cancellare tutto quando vuoi.',
  disclaimer:
    'Questa app è uno strumento di organizzazione e auto-monitoraggio, non un dispositivo medico, un dietologo o un fisioterapista.',
} as const

export type MealExample = {
  title: string
  items: string[]
}

export const MEAL_EXAMPLES: MealExample[] = [
  {
    title: 'Colazione',
    items: [
      'Yogurt greco 0–2%: 200 g',
      'Avena: 40 g',
      'Banana: circa 100 g',
      'Mandorle: 10 g',
    ],
  },
  {
    title: 'Pranzo',
    items: [
      'Riso: 80 g a crudo',
      'Petto di pollo: 150 g',
      'Verdure: 200 g',
      'Olio EVO: 10 g',
    ],
  },
  {
    title: 'Spuntino',
    items: ['Skyr: 150 g', 'Un frutto'],
  },
  {
    title: 'Cena',
    items: [
      'Pesce: circa 180 g',
      'Patate: circa 200 g',
      'Verdure: 200 g',
      'Olio EVO: 10 g',
    ],
  },
]

export const LUNCH_ROTATION = [
  { day: 'Lunedì', meal: 'Riso, pollo e zucchine' },
  { day: 'Martedì', meal: 'Pasta integrale, tonno e pomodorini' },
  { day: 'Mercoledì', meal: 'Cous cous, tacchino e verdure' },
  { day: 'Giovedì', meal: 'Riso basmati, salmone e broccoli' },
  { day: 'Venerdì', meal: 'Pasta e legumi con verdure' },
  { day: 'Sabato / domenica', meal: 'Pasto fuori o casalingo flessibile' },
]

export const SHOPPING_LIST = [
  'Yogurt greco / skyr',
  'Avena',
  'Frutta di stagione',
  'Verdure miste',
  'Riso / pasta / cous cous',
  'Petto di pollo / tacchino',
  'Pesce / tonno / salmone',
  'Legumi',
  'Olio extravergine d’oliva',
  'Mandorle',
  'Patate',
]

export const ENCOURAGEMENTS = [
  'Piccoli passi, ogni giorno.',
  'La continuità batte la perfezione.',
  'Oggi basta fare ciò che puoi.',
  'I dati ti aiutano a capire, non a giudicarti.',
  'Riparti dal prossimo pasto, sempre.',
]
