# Septeo Avocat Closing Lab

Application de simulation mobile-first pour une formation de 3 heures autour du closing Septeo Avocat.

Le principe pedagogique : le closing n'est pas un moment de pression, mais l'aboutissement logique d'une decouverte structuree qui a fait emerger les enjeux, les consequences et la pertinence de la solution.

## Modules

- `Prise de notes` : enjeux, consequences, solution pertinente, objection, closing, resultat et debrief.
- `Commercial` : GPS d'entretien en 10 etapes, de la prise de contact au closing.
- `Client` : 3 cas avocats prets a jouer en binome, avec objections et reponses rapides.

Les donnees restent dans le navigateur via `localStorage`. Les exports `.txt` et `.json` sont generes cote client, sans backend.

## Commandes

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
```

## Deploiement Vercel

Le projet est un Next.js App Router statique, sans API route, sans base de donnees et sans variable d'environnement.

Pour le deploiement :

1. Pousser le code sur le depot GitHub `Lofp34/Septeo_avocats_appli_closing`.
2. Importer le depot dans Vercel.
3. Conserver les reglages Next.js detectes automatiquement par Vercel.

## Asset de marque

Le logo Septeo est servi localement depuis `public/brand/septeo-logo.jpg`.
