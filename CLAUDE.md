# CLAUDE.md — Gus&Co

## Projet

Site vitrine de **Gus&Co**, marque de streetwear indépendante. Slogan : « Shine like a star, live with your HEART. »
En ligne : https://gus-and-co.com · Instagram : https://www.instagram.com/gusandcobrand/

- Produit actuel : **Le Bonnet**, 20,00 €, taille unique, 2 coloris, 50 % laine / 50 % acrylique anti-boulochage.
- Le site ne vend pas directement : « Acheter » renvoie vers la boutique Shopify `https://drgj8a-g1.myshopify.com/`.
- Une seule personne maintient le site. **Il est en production : `main` = ce qui est en ligne.**

## Stack

- HTML / CSS / JS natifs, **sans build ni npm**.
- CDN, versions figées : GSAP 3.12.2 + ScrollTrigger, Lenis 1.0.29, Three.js r128 (accueil uniquement).
- Google Fonts : Space Grotesk, Playfair Display.

## Structure

```
index.html                     Accueil (vidéo hero, histoire, drops, pièce du moment)
produits.html                  Catalogue (Shop)
product-bonnet.html            Fiche produit du bonnet (galerie + lightbox)
assets/css/style.css           Styles partagés (variables de thème dans :root)
assets/js/script.js            JS partagé : chaque bloc vérifie que ses éléments existent
assets/img/brand/              Logo, favicon
assets/img/products/<produit>/ Photos produit
assets/video/                  Vidéo hero
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
- Chemins relatifs sans `/` initial (`assets/css/style.css`).
- CSS partagé dans `style.css` ; un `<style>` dans une page uniquement pour ce qui lui est propre.
- JS : un seul `script.js` ; tout bloc propre à une page commence par vérifier que ses éléments existent.
- Bibliothèques CDN : version exacte, jamais `latest`.
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

## Points connus (audit du 9 novembre 2026)

- `og:image` pointe vers `og-cover.jpg`, qui n'existe pas ; `produits.html` et `product-bonnet.html` n'ont ni meta description ni Open Graph.
- L'accueil annonce « laine mérinos extra-fine » : faux, la composition est 50 % laine / 50 % acrylique anti-boulochage.
- Section « Prochains drops » datée (06.03).
- `product-bonnet.html` déborde légèrement en largeur sur mobile (384 px pour 375 px).
- Code mort : effet `#trigger-logo`, `sticky-mobile-bar` (lien vers `shop.gusandco.fr`, domaine mort), ~20 classes CSS inutilisées, newsletter commentée.
- Accessibilité : hamburger et accordéons inutilisables au clavier, pas de style de focus, pas de `prefers-reduced-motion`.
- Performance : vidéo hero de 4,9 Mo, photos non redimensionnées (ni WebP ni `srcset`), Three.js ~600 Ko.
