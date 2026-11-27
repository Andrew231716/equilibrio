# Product Specification — Piano 30 Giorni

## 1. Visione

Realizzare una web app responsive, mobile-first, in italiano, che guidi l'utente per 30 giorni in un percorso graduale di gestione dell'alimentazione, monitoraggio del peso e della circonferenza vita, abitudini quotidiane e attività compatibile con le indicazioni dei professionisti sanitari.

Il prodotto deve essere semplice, incoraggiante e concreto. Non deve colpevolizzare l'utente per pasti fuori, dolci o giornate non perfette.

## 2. Utente e obiettivo

Profilo iniziale fornito dall'utente:
- Uomo, 26 anni (dato riferito in precedenti conversazioni; rendere modificabile).
- Altezza: 180 cm.
- Peso iniziale attuale dichiarato: 88 kg.
- BMI calcolato: circa 27,2; mostrare solo come indicatore orientativo, senza etichette stigmatizzanti.
- Obiettivo di lungo periodo dichiarato: 80 kg.
- Obiettivo del primo ciclo: avviare abitudini sostenibili e monitorare l'andamento; non promettere il raggiungimento di 80 kg in 30 giorni.
- Circonferenza vita iniziale: non ancora misurata.
- Attività iniziale: sedentaria.
- Pranzo: abitualmente a casa / preparato da sé.
- Weekend: 1–2 pasti fuori.
- Tendenza: mangiare dolci.
- Vincoli di salute: ernia lombare con dolore irradiato talvolta alla gamba sinistra (sciatalgia riferita); precedente intervento per ernia inguinale, attualmente riferita come risolta.

L'utente vuole perdere grasso soprattutto su pancia e fianchi. Spiegare con tatto che non è possibile scegliere la zona da cui perdere grasso: la riduzione avviene a livello complessivo e il girovita si monitora come indicatore.

## 3. Principi di prodotto

- Mobile-first, leggibile e utilizzabile rapidamente da smartphone.
- Italiano naturale, non giudicante.
- Nessuna gamification punitiva.
- Nessun obbligo di perfezione: permettere di saltare o recuperare una giornata.
- Tutti i dati personali restano sul dispositivo per impostazione predefinita.
- Nessun account, cloud, analytics o invio dati a terzi nella prima versione.
- Dati modificabili e cancellabili dall'utente.
- L'app deve funzionare anche offline dopo il primo caricamento, se implementata come PWA.
- Nessuna funzione deve fingere di salvare su server.
- Unità metriche: kg, cm, kcal, grammi e minuti.

## 4. Funzionalità principali

### Dashboard
- Giorno corrente del percorso (1–30), data di inizio configurabile.
- Stato del percorso e avanzamento.
- Peso iniziale, ultima media peso disponibile, differenza dal peso iniziale.
- Ultima circonferenza vita e variazione, se presente.
- Riepilogo delle abitudini del giorno.
- Prossimo controllo/misurazione.
- Messaggio breve e incoraggiante, mai basato su giudizi.

### Piano 30 giorni
- Visualizzazione calendario/lista dei 30 giorni.
- Fasi:
  - Giorni 1–7: partenza e organizzazione.
  - Giorni 8–14: regolarità.
  - Giorni 15–21: consolidamento.
  - Giorni 22–30: valutazione.
- Ogni giorno mostra obiettivo alimentare, abitudini e attività consentita.
- Attività fisica sempre subordinata alle autorizzazioni cliniche e alla tolleranza dei sintomi.
- L'utente può contrassegnare il giorno come completato, parziale o non completato, senza penalità.

### Diario quotidiano / checklist
Checklist proposta:
1. Ho rispettato le porzioni previste.
2. Ho assunto proteine nei pasti principali.
3. Ho mangiato frutta e verdura.
4. Ho gestito i dolci senza eccessi (formulazione non giudicante).
5. Ho bevuto regolarmente.
6. Ho rispettato il riposo e l'attività consentita.

- Ogni voce può essere spuntata o lasciata vuota.
- Campo note facoltativo.
- Possibilità di correggere i giorni precedenti.
- La checklist deve avere storico per ciascun giorno: non usare una sola checklist temporanea che si azzera cambiando giorno.

### Alimentazione
- Mostrare il target calorico iniziale come stima modificabile, non prescrizione.
- Valore iniziale proposto: circa 1.900 kcal/die, da rivalutare.
- Macronutrienti iniziali orientativi: proteine 130 g, carboidrati 200 g, grassi 65 g (totale matematico circa 1.905 kcal).
- Non presentare i macro come obbligo medico.
- Mostrare esempi di pasti e porzioni.
- Permettere sostituzioni alimentari e preferenze.
- Gestione dei pasti fuori e dei dolci senza “sgarri”, punizioni o compensazioni.
- Non consigliare di saltare pasti o fare digiuni compensatori.

### Diario peso e misure
- Registrazione peso con data e ora facoltativa.
- Registrazione circonferenza vita.
- Indicazioni per misurare sempre nelle stesse condizioni.
- Peso: facoltativamente 2–3 mattine a settimana, non obbligatorio quotidiano.
- Mostrare media settimanale quando ci sono almeno 2 misurazioni nella settimana; spiegare il metodo.
- Girovita: una volta a settimana, stesso punto (altezza ombelico), metro non stretto.
- Grafici separati per peso e girovita.
- Non dedurre risultati da una singola misurazione.
- Se il peso oscilla, spiegare che acqua, sale, glicogeno e digestione possono influire.

### Report giorno 30
- Confronto tra inizio e fine.
- Variazione del peso e girovita, se i dati sono presenti.
- Aderenza alle abitudini, senza punteggio punitivo.
- Riepilogo di cosa ha funzionato e cosa è stato difficile.
- Suggerimento di continuare con un nuovo ciclo, non di intensificare automaticamente il deficit.

## 5. Requisiti non funzionali

- Layout accessibile, contrasto adeguato, font leggibili, target touch ampi.
- Responsive per iPhone e desktop.
- Navigazione semplice: Dashboard, Piano, Alimentazione, Progressi, Impostazioni.
- Persistenza locale robusta (localStorage o IndexedDB).
- Esportazione dati JSON/CSV e importazione backup facoltativa.
- Conferma prima di cancellare tutti i dati.
- Gestione degli stati vuoti.
- Form validation per peso, altezza, vita e date.
- Nessun numero inventato: i dati mancanti devono essere indicati come “da inserire”.

## 6. Fuori ambito

- Diagnosi o trattamento di ernia lombare/sciatalgia.
- Prescrizione di fisioterapia o allenamenti terapeutici.
- Diagnosi di obesità o altre condizioni.
- Calcolo di calorie “esatte”.
- Collegamento a bilance, smartwatch o cartelle cliniche.
- Consigli su farmaci o modifiche farmacologiche.
