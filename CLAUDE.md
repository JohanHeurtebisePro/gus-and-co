# CLAUDE.md — Gus&Co

## Projet

Site vitrine de **Gus&Co**, marque de streetwear indépendante. Slogan : « Shine like a star, live with your HEART. »
En ligne : https://gus-and-co.com · Instagram : https://www.instagram.com/gusandcobrand/

- Produit actuel : **Le Bonnet**, 20,00 €, taille unique, 2 coloris, 50 % laine / 50 % acrylique anti-boulochage.
- Le site ne vend pas directement : « Acheter » renvoie vers la boutique Shopify, un produit par coloris :
  `https://drgj8a-g1.myshopify.com/products/bonnet-blanc-noir` (Blanc / Noir) et `…/products/bonnet-noir-et-blanc` (Noir / Blanc).
- Une seule personne maintient le site. **Il est en production : `main` = ce qui est en ligne.**
- La v2 du site sort le **1er décembre 2026 à 20 h** (heure de Paris), avec le nouveau drop des bonnets. Le bandeau `.announce` (attribut `data-drop`) bascule automatiquement de « bientôt » à « disponible » à l'heure du drop.

## Stack

- HTML / CSS / JS natifs, **sans build ni npm**.
- Aucune bibliothèque JS : `assets/js/main.js` gère l'en-tête, les apparitions au défilement, le sélecteur de coloris et la visionneuse photo.
- Google Fonts : Playfair Display (titres) et Space Grotesk (texte, infos), les polices d'origine du site. Logo : image `assets/img/brand/logo-wordmark.png` (à empattements).

## Structure

```
index.html                     Accueil (film, bonnet en 2 coloris, histoire, infos pratiques)
produits.html                  Shop
product-bonnet.html            Fiche produit (sélecteur de coloris, galerie + visionneuse)
mentions-legales.html          Mentions légales (obligatoires)
assets/css/main.css            Styles partagés (variables de thème dans :root)
assets/js/main.js              JS partagé : chaque bloc vérifie que ses éléments existent
assets/img/brand/              Logo (logo-wordmark.png), favicon
assets/img/products/<produit>/ Photos produit
assets/img/og-cover.jpg        Image de partage réseaux sociaux (1200×630)
assets/video/                  Film d'accueil et son image d'attente (poster)
archive/                       Assets inutilisés conservés, NON publiés
CNAME, google*.html            Domaine personnalisé, vérification Google Search Console
_config.yml                    Config Jekyll de GitHub Pages (fichiers exclus de la publication)
```

Les pages HTML restent à la racine : leurs URL sont publiques (liens partagés, Google). Ne pas les renommer ni les déplacer sans plan de redirection.

## Lancer en local

```bash
python3 -m http.server 8000
```

Puis http://localhost:8000. Après un déplacement de fichiers, recharger sans cache (navigation privée ou Cmd+Shift+R).

## Déploiement

- GitHub Pages, « Deploy from a branch » : `main`, dossier racine. Chaque push sur `main` est en ligne en ~1 min.
- Pages passe par Jekyll : les fichiers et dossiers commençant par `_` ou `.` ne sont pas publiés, ni ceux listés dans `exclude` de `_config.yml`. **Tout nouveau fichier interne (docs, scripts) doit y être ajouté.**
- GitHub Pages est sensible à la casse, macOS non : noms en minuscules, chemins identiques à la casse près.
- DNS et proxy Cloudflare (enregistrements A vers GitHub). Si des assets sont renommés ou supprimés : purger le cache Cloudflare après la mise en ligne.
- Pas d'environnement de préproduction : tout se vérifie en local avant le merge.

## Conventions

- Noms de fichiers : anglais, minuscules, kebab-case. Photos : `assets/img/products/<produit>/<produit>-<description>.jpeg`.
- Chemins relatifs sans `/` initial (`assets/css/main.css`).
- Tout le CSS dans `main.css` ; pas de `<style>` ni d'attribut `style` dans les pages.
- JS : un seul `main.js`, sans dépendance ; tout bloc propre à une page commence par vérifier que ses éléments existent.
- En-tête et pied de page sont copiés dans chaque page : toute modification doit être reportée dans les 4 pages.
- Si une bibliothèque CDN devient nécessaire : version exacte, jamais `latest`.
- Textes : courts et factuels, sans formules creuses (« Pas X. Pas Y. Z. ») ; ne jamais inventer un fait (matière, délai, origine).
- Un fait inconnu s'écrit `<mark class="todo">[À compléter : …]</mark>` (surligné en jaune). **Aucune page contenant `class="todo"` ne part en production** : vérifier avec `grep -rn 'class="todo"' *.html`.
- Images : **retirer les métadonnées EXIF (GPS) avant tout commit** ; viser ≤ 1600 px de large et < 300 Ko ; `alt` descriptif en français.
- Contenu du site en français ; code, noms de fichiers et messages de commit en anglais.

## Git

- Jamais de travail direct sur `main`. Une branche par sujet : `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- Commits petits et atomiques, format Conventional Commits : `feat:`, `fix:`, `refactor:`, `perf:`, `style:`, `docs:`, `chore:`.
- Déplacer les fichiers avec `git mv` pour garder l'historique.
- Fusion vers `main` par Pull Request (checklist dans `.github/pull_request_template.md`), méthode « Rebase and merge ».
- Un tag par version du site : `vMAJEUR.MINEUR.CORRECTIF` (`v1.1.0` = nouveau produit ou fonctionnalité, `v1.0.1` = correction).
- Jamais de secrets (clés API, tokens, `.env`) dans le dépôt.

## Règles de travail avec Claude

- Répondre en français.
- Avancer étape par étape ; résumer à la fin de chaque étape et attendre le feu vert.
- Aucune modification, aucun déplacement ni aucune suppression de fichier sans plan écrit validé.
- Une réorganisation ne doit changer ni le rendu ni le comportement du site. En cas de doute sur un fichier (utilisé ou non), demander.
- Ne jamais pousser, merger ni mettre en production sans demande explicite.
- Décision structurante (framework, build, hébergement) : proposer 2-3 options avec avantages et inconvénients, laisser choisir.
- Signaler immédiatement tout secret repéré dans le dépôt ou son historique.
- Nouvelle fonctionnalité : reformuler et poser les questions → plan court (fichiers, approche, risques) et accord → branche `feat/<nom>`, commits atomiques → test local et explication pour vérifier → message de PR, puis feu vert avant tout merge.

## Points connus (novembre 2026)

- Refonte v2 (branche `feat/redesign-v2`) : textes et mentions légales contiennent des repères `[À compléter]` à remplir avant la mise en ligne.
- Le film d'accueil (`hero.mp4`) montre encore l'ancien logo à empattements à partir de 6 s.
- Pas de vidéo verticale : sur mobile, le film est affiché en entier (format cinéma) plutôt que recadré.
- Photos non redimensionnées (ni WebP ni `srcset`).
- Polices chargées depuis Google Fonts (adresse IP transmise à Google) : les héberger sur le site serait préférable pour le RGPD.
- La meilleure photo de face du bonnet noir n'existe que sur la boutique Shopify.
