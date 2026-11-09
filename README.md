# Gus&Co — site web

Site vitrine de **Gus&Co**, marque de streetwear indépendante : https://gus-and-co.com

Le site présente la marque et ses pièces. La vente se fait sur la boutique Shopify de la marque, vers laquelle renvoient les boutons « Acheter ».

## Technologies

- HTML, CSS et JavaScript natifs, sans étape de build, sans bibliothèque ni dépendance à installer.
- Polices : Inter Tight, Archivo et IBM Plex Mono (Google Fonts).

## Structure

```
index.html                 Accueil
produits.html              Shop
product-bonnet.html        Fiche produit « Le bonnet »
mentions-legales.html      Mentions légales
assets/
  css/main.css             Styles partagés
  js/main.js               Scripts partagés
  img/brand/               Logo et favicon
  img/products/<produit>/  Photos produit
  video/                   Vidéo de l'accueil
archive/                   Assets non utilisés (non publiés)
```

## Lancer le site en local

Prérequis : Python 3 (déjà installé sur macOS).

```bash
git clone https://github.com/JohanHeurtebisePro/gus-and-co.git
cd gus-and-co
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Déploiement

- Hébergement : **GitHub Pages**, publié depuis la branche `main` (dossier racine).
- Domaine : `gus-and-co.com` (fichier `CNAME`), DNS et proxy **Cloudflare**.
- Tout push sur `main` est en ligne en une minute environ : `main` correspond toujours au site en production.
- Ne sont pas publiés : `archive/`, `README.md`, `CLAUDE.md` (voir `_config.yml`) et les fichiers ou dossiers commençant par `.` ou `_`.

## Contribuer

1. Créer une branche depuis `main` : `feat/…`, `fix/…`, `chore/…` ou `docs/…`.
2. Faire des commits petits et atomiques, en anglais, au format [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat: add t-shirt product page`).
3. Tester en local.
4. Ouvrir une Pull Request vers `main` et cocher la checklist de mise en production.
5. Après le merge : vérifier le site en ligne, purger le cache Cloudflare si des fichiers ont été renommés ou supprimés, et créer un tag de version si besoin (`v1.1.0`).

Conventions détaillées : voir [`CLAUDE.md`](CLAUDE.md).
