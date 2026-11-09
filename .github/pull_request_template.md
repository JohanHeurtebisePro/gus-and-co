## Description

<!-- Quoi, et pourquoi. -->

## Type

- [ ] Nouvelle fonctionnalité (`feat`)
- [ ] Correction (`fix`)
- [ ] Maintenance ou réorganisation (`chore`, `refactor`)
- [ ] Documentation (`docs`)

## Checklist avant mise en production

### Liens et assets
- [ ] Toutes les pages s'ouvrent en local (`python3 -m http.server 8000`), sans erreur dans la console
- [ ] Aucune requête en 404 (onglet Réseau)
- [ ] Liens internes, bouton « Acheter » (Shopify) et lien Instagram fonctionnent
- [ ] Noms de fichiers en minuscules, chemins identiques à la casse près
- [ ] Nouveaux fichiers internes (docs, scripts) ajoutés à `exclude` dans `_config.yml`

### Mobile
- [ ] Testé à 375 px et 768 px : pas de défilement horizontal, menu mobile fonctionnel
- [ ] Testé sur un vrai téléphone

### Performance
- [ ] Nouvelles images ≤ 1600 px de large, < 300 Ko, EXIF retiré
- [ ] `loading="lazy"` sur les images situées sous le premier écran
- [ ] Pas de nouvelle bibliothèque lourde sans raison

### SEO
- [ ] `<title>` unique et `meta description` sur chaque page ajoutée ou modifiée
- [ ] Balises Open Graph (titre, description, image en URL absolue)
- [ ] Textes `alt` descriptifs sur les images

### Contenu
- [ ] Prix, composition, disponibilités et dates à jour
- [ ] Textes relus

### Sécurité
- [ ] Aucun secret (clé API, token, `.env`) dans les fichiers modifiés

## Après le merge

- [ ] Build GitHub Pages terminé sans erreur
- [ ] Pages modifiées vérifiées sur https://gus-and-co.com (en navigation privée)
- [ ] Cache Cloudflare purgé si des fichiers ont été renommés ou supprimés
- [ ] Tag de version créé s'il s'agit d'une nouvelle version du site
