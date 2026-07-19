# Documentation API Score

## Vue d'ensemble

API JSON publique qui renvoie un score SEO pour l'URL d'un site.

## URL de base

`https://score.monsieurclick.com`

## Endpoints

### `GET /api/health`

Santé de l'edge du site Monsieur Click.

### Enregistrement soft d'agent

`POST https://monsieurclick.fr/api/agent/register`

Déclaration optionnelle. Aucun identifiant OAuth n'est requis pour la découverte publique.

### Identité soft

`POST https://monsieurclick.fr/api/agent/identity`

Renvoie une assertion d'identité soft pour les agents qui souhaitent se déclarer.

## Authentification

La découverte en lecture seule et le calculateur public ne nécessitent pas de jeton bearer.

