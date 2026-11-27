# Piano 30 Giorni

Web app personale (italiano, mobile-first) per un percorso di 30 giorni su alimentazione, abitudini, peso e girovita.

## Stack

- Vite + React + TypeScript
- Persistenza locale (`localStorage`) con schema versionato
- Recharts per i grafici, Lucide per le icone
- Vitest per i test

## Avvio

```bash
npm install
npm run dev
```

## Script

- `npm run build` — typecheck + build produzione
- `npm test` — test unitari
- `npm run lint` — lint

## Privacy

Tutti i dati restano sul dispositivo. Nessun account, backend o analytics. Export/import JSON e cancellazione disponibili nel Profilo.

## Nota

Strumento di organizzazione e auto-monitoraggio, non un dispositivo medico. I target nutrizionali sono stime modificabili. L’attività fisica è subordinata all’autorizzazione clinica dell’utente.
