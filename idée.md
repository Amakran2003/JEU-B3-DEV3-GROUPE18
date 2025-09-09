# Draft du projet de jeu 2D multijoueur (TP sur 2 jours)

## Concept général
- Jeu 2D de plateforme en vue de côté, très simple.
- Multijoueur local : 2 joueurs s'affrontent sur le même écran.
- Objectif : sauter sur une plateforme, combattre l'autre joueur. Soit en le tuant soit en le fesant sortir de la plateforme (frappes simples).
- Style graphique : pixel art, sprites animés (idle, saut, frappe), images/gif simples.
- Technologies : TypeScript, HTML, CSS.

## Fonctionnalités à réaliser
- Déplacements des joueurs (gauche/droite, saut).
- Animation des sprites selon l'état (idle, saut, frappe).
- Collisions avec plateforme et entre joueurs.
- Système de score (points et vies).
- Interface de début (écran d'accueil) et de fin (victoire/défaite).
- Affichage des scores et état du jeu.

## Suggestions graphiques
- Utiliser des sprites pixel art libres (ex: [kenney.nl](https://kenney.nl/assets), [itch.io](https://itch.io/game-assets/tag-pixel-art)).
- Créer des GIF simples pour les animations (idle, saut, frappe) ou utiliser des PNG.
- Plateforme : rectangle coloré ou image pixel art.
- Fond : couleur unie ou image simple.

## Timeline réaliste (2 jours)
### Jour 1 : JavaScript moderne & fondamentaux

#### Matin
1. **Initialisation du projet**
    - Créer le dossier du projet et l’arborescence recommandée.
    - Ajouter les fichiers principaux (`index.html`, `main.js`, `style.css`).
    - Vérifier le bon affichage de la page HTML de base.

2. **Prise en main ES6+**
    - Écrire des exemples de variables avec `let` et `const`.
    - Créer des fonctions fléchées pour des actions simples (ex: calculs, affichage).
    - Utiliser la destructuration pour extraire des valeurs d’objets ou tableaux.
    - Mettre en place un module JS simple (import/export).

3. **Premiers scripts du jeu**
    - Implémenter le déplacement horizontal d’un joueur (gauche/droite).
    - Afficher le joueur sur le canvas ou dans le DOM.
    - Tester l’affichage et le déplacement avec des touches clavier.

#### Après-midi
4. **Approfondissement JS**
    - Créer des exemples de closures pour gérer l’état du joueur (score, position).
    - Illustrer l’utilisation de `this` dans des objets ou classes.
    - Manipuler le DOM pour afficher dynamiquement les joueurs et l’écran d’accueil.

5. **Prototype d’interface**
    - Concevoir un écran d’accueil simple (titre, bouton démarrer).
    - Ajouter une liste de joueurs (affichage des noms ou avatars).
    - Permettre la sélection ou l’ajout de joueurs.

6. **Début de la logique de jeu**
    - Implémenter la détection de collision entre le joueur et les plateformes.
    - Créer des plateformes statiques et vérifier la position du joueur.
    - Tester les interactions et corriger les bugs éventuels.

---

### Jour 2 : Asynchronisme, API, TypeScript

#### Matin
1. **Gestion de l’asynchronisme**
    - Créer des promesses pour simuler le chargement d’assets (images, sprites).
    - Utiliser `async/await` pour attendre le chargement avant de démarrer le jeu.
    - Afficher un écran de chargement pendant l’attente.

2. **Logique de score et interface de fin**
    - Ajouter un système de score ou de vies pour chaque joueur.
    - Mettre à jour l’affichage du score en temps réel.
    - Créer un écran de fin (victoire/défaite) avec bouton de retour ou recommencer.

3. **Conversion TypeScript**
    - Renommer les fichiers JS principaux en `.ts`.
    - Ajouter des interfaces pour les entités du jeu (joueur, plateforme).
    - Typage des variables et fonctions principales.

#### Après-midi
4. **Finalisation des animations et collisions**
    - Ajouter des animations pour les états du joueur (idle, saut, frappe).
    - Tester et améliorer la détection de collision entre joueurs et plateformes.
    - Corriger les bugs et optimiser le code.

5. **Tests et amélioration de l’UI**
    - Vérifier le bon fonctionnement de toutes les fonctionnalités.
    - Améliorer l’interface utilisateur (boutons, affichages, transitions).
    - Ajouter des commentaires dans le code pour expliquer les choix.

6. **Rendu et documentation**
    - Préparer un README.md avec instructions d’installation et d’utilisation.
    - Vérifier la structure du projet et la clarté du code.
    - Faire une dernière passe de tests avant la remise finale.

## Contraintes pédagogiques à intégrer
- Utiliser ES6+ : let/const, fonctions fléchées, template literals, destructuration, spread, modules.
- Manipuler le DOM pour l'interface.
- Utiliser closures et le mot-clé this dans la logique du jeu.
- Gérer l'asynchronisme (promesses, async/await) pour des effets ou chargements.
- Utiliser TypeScript pour typage et interfaces sur les entités du jeu (joueurs, plateformes).

## Arborescence du projet

```
jeu/
├── index.html
├── main.js / main.ts
├── calculs.js / calculs.ts
├── style.css
├── assets/
│   ├── sprites/
│   ├── plateformes/
│   └── fonds/
└── README.md
```

- `index.html` : page principale du jeu.
- `main.js` / `main.ts` : logique du jeu.
- `calculs.js` / `calculs.ts` : fonctions utilitaires.
- `style.css` : styles.
- `assets/` : images, sprites, gifs.
- `README.md` : documentation rapide.
