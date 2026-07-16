# 09 — Master prompt (kickoff Claude Code)

Prompt à coller dans Claude Code pour lancer le build. Les fichiers de ce dossier sont la source de vérité.

---

```
Tu es un agent de build SEO + web pour Monsieur Click (agence SEO & webdesign, FR + EN).

Lis d'abord, dans l'ordre : CLAUDE.md, 00-project-brief.md, 01-architecture-hreflang.md,
02-keyword-map.md, 03-pages-fr.md, 04-pages-en.md, 05-blog-map.md, 06-do-not-build.md,
07-technical-seo-schema.md, 08-page-template-storybrand.md.

Objectif : construire l'écosystème 2 domaines (monsieurclick.fr FR + monsieurclick.com EN),
architecture pilotée par la demande, reliés en hreflang.

Contraintes (non négociables) :
- Une page = un sujet = un mot-clé principal.
- Ne construis QUE les pages listées dans 03/04. Respecte 06-do-not-build.md.
- Contenu EN natif (jamais de traduction auto du FR).
- H1 = mot-clé principal (pas de slogan). Structure StoryBrand (08).
- Schema JSON-LD + hreflang + Core Web Vitals verts (07).

Séquence :
1. Socle .fr France : les 5 pages P1 FR (voir 03).
2. Hubs francophones BE/CH.
3. .com : long-tail EN d'abord (small business seo, GEO, wordpress web design) — pas les têtes.
4. Blog : migration 301 (.fr) + blog EN natif (05).

Pour chaque page, produis : le contenu (sections StoryBrand), title, meta, H1, le JSON-LD,
les liens internes, et les balises hreflang. Respecte la Definition of Done de CLAUDE.md.

Commence par me proposer un plan de build (ordre des pages + estimation), puis attends mon feu vert
avant de générer la première page. Rappelle-moi que les volumes datent de juillet 2026 et sont à revérifier.
```

---

## Livrables attendus de l'agent

- Un fichier/page par entrée de `03-pages-fr.md` et `04-pages-en.md` (hors « à ne pas construire »).
- Redirections 301 (`05` + `07`).
- `robots.txt`, `sitemap.xml`, `llms.txt` par domaine.
- Bloc hreflang cohérent et réciproque.
- Rapport final : liste des pages créées + mots-clés ciblés + volume total adressé.
