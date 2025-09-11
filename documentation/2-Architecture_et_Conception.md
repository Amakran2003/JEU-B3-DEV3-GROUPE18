# Architecture du Système

## Structure du Projet

Le projet est organisé selon la structure suivante qui facilite la maintenance et l'évolution du code :

```
Projet jeu/
├── src/                     # Code source TypeScript
│   ├── canvas_settings.ts   # Configuration du canvas et logique principale
│   ├── interfaces.ts        # Définition des interfaces et types
│   ├── movements.ts         # Gestion des événements clavier
│   ├── rendering_utils.ts   # Utilitaires de rendu graphique
│   ├── ui.ts                # Gestion de l'interface utilisateur
│   ├── components/          # Composants modulaires
│   │   ├── healthBar.ts     # Gestion de la barre de santé
│   │   ├── lives.ts         # Gestion du système de vies
│   │   └── timer.ts         # Gestion du temps de jeu
│   └── game/                # Logique principale du jeu
│       ├── config.ts        # Configuration des paramètres du jeu
│       ├── players.ts       # Définition et initialisation des joueurs
│       ├── physics.ts       # Gestion de la physique et des collisions
│       ├── combat.ts        # Système de combat et d'attaques
│       ├── animation.ts     # Gestion des animations des personnages
│       ├── resources.ts     # Chargement et gestion des ressources
│       ├── lives_manager.ts # Gestion des vies et game over
│       └── main.ts          # Point d'entrée principal du jeu
├── assets/                  # Ressources graphiques et médias
│   ├── fonds/               # Arrière-plans et vidéos
│   └── images/              
│       ├── fonds/           # Images de fond statiques
│       ├── personnages/     # Spritesheets des personnages
│       │   ├── joueur1/     # Animations du joueur 1 (idle, run, jump, attack, death)
│       │   └── joueur2/     # Animations du joueur 2 (idle, run, jump, attack, death)
│       └── plateformes/     # Images des plateformes de jeu
├── documentation/           # Documentation technique
├── style.css                # Styles CSS
└── index.html               # Page HTML principale
```

Cette organisation sépare clairement le code source TypeScript, les ressources graphiques et la documentation, facilitant ainsi le travail collaboratif et la maintenance du projet.

## Modèles de Données Clés

Le système s'appuie sur plusieurs interfaces TypeScript qui définissent la structure des objets du jeu :

| Interface    | Description                                      | Propriétés principales                                                                        |
|-------------|--------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Emplacement | Base pour tout objet positionné dans le jeu      | x, y, width, height, color                                                                    |
| Animation   | Configuration d'une animation spécifique         | spritesheet, frameCount, frameWidth                                                           |
| Joueur1     | Propriétés spécifiques au joueur 1               | x, y, width, height, color, state, facingLeft, frameX, frameTimer, animations, velocity, isJumping, hasFallen, isDead, deathPlayed |
| Joueur2     | Propriétés spécifiques au joueur 2               | x, y, width, height, color, state, facingLeft, frameX, frameTimer, animations, velocity, isJumping, hasFallen, isDead, deathPlayed |
| LivesCounter | Gestion des vies des joueurs                    | remainingLives, maxLives, element, playerIdentifier, loseLife(), gainLife(), getRemainingLives() |

Ces interfaces garantissent la cohérence des données et facilitent le développement grâce au typage fort de TypeScript. Les nouvelles propriétés comme `velocity`, `isJumping`, et `isDead` permettent de gérer les mécaniques avancées de jeu comme les sauts, la gravité et les états de mort.

## Flux de Jeu

Le déroulement du jeu suit un cycle élaboré pour les jeux en temps réel avec physique et combat :

1. **Initialisation**
   - Chargement des ressources (vidéos, images, spritesheets)
   - Configuration du canvas pour qu'il soit responsive
   - Création des objets du jeu (plateforme, joueurs, interface utilisateur)
   - Initialisation des systèmes de vies et de combat
   - Configuration des contrôles et des états de jeu

2. **Boucle de jeu principale (`gameLoop`)**
   - Calcul du temps écoulé depuis la dernière frame (delta time)
   - Vérification de l'état global du jeu (en cours ou game over)
   - Mise à jour des positions et états des joueurs via `update_player()`
   - Application de la physique (gravité, sauts, vélocité) et détection des collisions
   - Gestion des attaques et de leurs effets (dégâts, knockback)
   - Mise à jour des animations via `updateAnimation()`
   - Mise à jour du système de combat via `updateCombat(deltaTime)`
   - Rendu graphique via `redessiner()`
   - Planification de la prochaine frame avec `requestAnimationFrame()`

3. **Gestion des entrées utilisateur**
   - Écoute des événements clavier grâce au module `movements.ts`
   - Mise à jour de l'état des touches via l'objet `keys`
   - Détection des nouvelles pressions pour les actions ponctuelles (saut, attaque)
   - Traduction des touches appuyées en actions dans le jeu

4. **Système de physique**
   - Application de la gravité et gestion des sauts
   - Détection de collision avec la plateforme et les bords de l'écran
   - Gestion de la vélocité horizontale et verticale
   - Système de knockback lors des attaques

5. **Système de combat**
   - Détection des attaques via `checkAttackKeyPressed`
   - Vérification de la portée des attaques avec `isInAttackRange`
   - Application des dégâts et effet de knockback
   - Gestion des cooldowns entre les attaques
   - Mise à jour de l'interface de santé

6. **Gestion des vies**
   - Détection des chutes hors plateforme et des collisions avec les pics
   - Réduction de la santé lors des attaques
   - Perte de vie lorsque la santé atteint zéro
   - Vérification des conditions de game over

7. **Rendu adaptatif**
   - Adaptation du jeu à la taille de l'écran via `resizeCanvas()`
   - Calcul des positions relatives pour maintenir la cohérence visuelle
   - Rendu des éléments d'interface utilisateur (barres de santé, compteurs de vies)

Ce flux élaboré garantit une exécution fluide, une physique réaliste et un système de combat immersif, le tout adapté à différentes tailles d'écran.

## Gestion des Animations

Le système d'animation repose sur une approche par spritesheet optimisée pour les jeux 2D, avec un support étendu pour diverses actions de jeu :

1. **Structure des spritesheets**
   - Chaque type d'animation (idle, run, jump, attack, death) est stocké dans une image unique
   - Les frames sont disposées horizontalement sur une seule ligne
   - Chaque frame a une taille uniforme (généralement 64×64 pixels)

2. **Cycle d'animation**
   - Un compteur (`frameTimer`) s'incrémente à chaque frame du jeu
   - Lorsque le compteur atteint un seuil prédéfini, on passe à la frame suivante
   - La propriété `frameX` détermine quelle portion du spritesheet afficher
   - L'animation boucle grâce à l'opérateur modulo (`frameX % frameCount`) pour les animations continues
   - Les animations non-bouclées (comme la mort) sont gérées avec des drapeaux spéciaux

3. **États d'animation**
   - 'idle' : personnage immobile
   - 'run-left' : déplacement vers la gauche
   - 'run-right' : déplacement vers la droite
   - 'jump' : personnage en l'air (saut ou chute)
   - 'attack' : personnage en train d'attaquer
   - 'death' : animation de mort du personnage

4. **Persistance d'orientation**
   - La propriété `facingLeft` mémorise l'orientation du personnage
   - Même en état d'inactivité (idle), le personnage reste orienté dans sa dernière direction

5. **Gestion d'états spéciaux**
   - `isJumping` : indique si le joueur est en l'air
   - `isDead` : indique si le joueur est en train de mourir
   - `deathPlayed` : indique si l'animation de mort a été jouée complètement
   - `hasFallen` : indique si le joueur est tombé de la plateforme

6. **Transitions d'état**
   - Réinitialisation des compteurs d'animation lors d'un changement d'état
   - Détection intelligente des transitions (par exemple, retour à l'état idle après un saut)
   - Priorité des états (la mort a priorité sur les autres états)

Cette approche élaborée permet d'avoir des animations fluides et cohérentes pour toutes les actions possibles du joueur, tout en optimisant les ressources puisque chaque animation est contenue dans une seule image.
