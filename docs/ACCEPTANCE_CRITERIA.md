# Criteri di accettazione e test

## Profilo e onboarding
- [ ] L'app propone i dati iniziali: 88 kg, 180 cm, obiettivo 80 kg.
- [ ] Età e sesso usati per il calcolo sono modificabili/confermabili.
- [ ] Circonferenza vita appare come “da misurare”.
- [ ] Vengono raccolti i dati relativi alle limitazioni e all'autorizzazione clinica.
- [ ] L'utente può saltare i campi non essenziali senza bloccare l'app.

## Dashboard e percorso
- [ ] Mostra giorno corretto in base alla data d'inizio.
- [ ] Mostra le 4 fasi (1–7, 8–14, 15–21, 22–30).
- [ ] La checklist è salvata separatamente per ogni data.
- [ ] Modificare un giorno precedente non modifica gli altri.
- [ ] Dopo il giorno 30 viene mostrato il report.

## Alimentazione
- [ ] Target iniziale mostrato come stima modificabile, non prescrizione.
- [ ] Macro iniziali: 130 g proteine, 200 g carboidrati, 65 g grassi.
- [ ] Pasti esempio e porzioni sono visibili.
- [ ] Weekend e dolci sono gestiti senza etichette punitive.
- [ ] Non esistono suggerimenti di digiuno o compensazione.

## Progressi
- [ ] Peso e girovita possono essere inseriti, modificati e cancellati.
- [ ] Nessuna misura mancante viene sostituita da un valore inventato.
- [ ] Media peso settimanale calcolata solo con dati sufficienti.
- [ ] Grafici hanno assi, unità e date leggibili.
- [ ] Il report non dichiara che tutto il calo di peso è grasso.

## Sicurezza
- [ ] Senza autorizzazione clinica, nessun circuito/esercizio viene prescritto.
- [ ] Nessun esercizio addominale o carico è raccomandato automaticamente.
- [ ] L'utente può inserire le attività autorizzate dal professionista.
- [ ] Sono presenti i segnali d'allarme neurologici e indicazioni di assistenza urgente.
- [ ] Nessun consiglio su farmaci o diagnosi.

## Privacy e qualità
- [ ] Dati persistono dopo refresh.
- [ ] Export JSON funziona e include tutti i dati.
- [ ] Import JSON valida schema e chiede conferma.
- [ ] Cancellazione dati richiede conferma.
- [ ] Nessuna chiamata di rete/analytics nella prima versione.
- [ ] Responsive e utilizzabile su iPhone.
- [ ] Accessibilità base: label, focus, contrasto, tastiera.
