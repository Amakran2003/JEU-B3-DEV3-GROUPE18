# Guide des Composants

Ce chapitre détaille les composants essentiels du jeu "Red vs Blue", en expliquant leur structure et leur fonctionnement. Le jeu comprend des systèmes de physique, de combat, de gestion des vies et d'interface utilisateur qui travaillent en harmonie pour créer une expérience de jeu complète.

## Interfaces

Les interfaces définissent la structure des données utilisées dans le jeu et assurent une cohérence entre les différents composants.

### Interface `Emplacement`

```typescript
export interface Emplacement {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}
```

Cette interface définit la structure de base des objets positionnés dans le jeu :
- `x`, `y` : Position de l'objet en pixels
- `width`, `height` : Dimensions de l'objet en pixels
- `color` : Couleur de remplissage (format CSS)

Utilisée principalement pour la plateforme statique sur laquelle les joueurs se déplacent.

### Interface `Animation`

```typescript
export interface Animation {
    spritesheet: HTMLImageElement;
    frameCount: number;
    frameWidth: number;
}
```

Structure qui configure une animation spécifique :
- `spritesheet` : Image contenant toutes les frames d'animation alignées horizontalement
- `frameCount` : Nombre total de frames dans l'animation
- `frameWidth` : Largeur d'une frame individuelle en pixels

### Interface `Joueur1` et `Joueur2`

```typescript
export interface Joueur1 {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    state: 'idle' | 'run-left' | 'run-right' | 'jump' | 'death';
    facingLeft: boolean;
    frameX: number;
    frameTimer: number;
    velocity: { x: number; y: number };
    isJumping: boolean;
    hasFallen: boolean;
    isDead: boolean;
    deathPlayed: boolean;
    animations: {
        idle: Animation;
        run: Animation;
        jump: Animation;
        death: Animation;
        attack: Animation;
        attack_from_air: Animation;
        pray: Animation;
    };
}
```

Ces interfaces définissent la structure complète d'un joueur avec :
- Propriétés de positionnement et dimensions (`x`, `y`, `width`, `height`)
- `color` : Couleur identifiant le joueur ('rouge' ou 'bleu')
- `state` : État actuel avec typage strict étendu pour inclure les nouveaux états
- `facingLeft` : Booléen indiquant si le joueur est orienté vers la gauche
- `frameX` : Index de la frame actuelle dans l'animation en cours
- `frameTimer` : Compteur pour contrôler la vitesse d'animation
- `velocity` : Vecteur de vitesse pour la physique du joueur (horizontal et vertical)
- `isJumping` : Indique si le joueur est actuellement en l'air
- `hasFallen` : Indique si le joueur est tombé de la plateforme
- `isDead` : Indique si le joueur est en état de mort
- `deathPlayed` : Flag pour suivre si l'animation de mort a été complétée
- `animations` : Objet contenant toutes les configurations d'animations disponibles

L'interface `Joueur2` est identique à `Joueur1`, permettant d'ajouter des propriétés spécifiques à chaque joueur si nécessaire.

## Fonctions Principales

### `updateAnimation(player: Joueur1 | Joueur2)`

Cette fonction est au cœur du système d'animation et fait progresser l'animation du joueur en passant à la frame suivante à intervalles réguliers.

```typescript
function updateAnimation(player: Joueur1 | Joueur2) {
    // Détermine quelle animation est en cours
    const currentAnim = player.state === 'idle' ? player.animations.idle : player.animations.run;
    
    // Avancer le timer d'animation
    player.frameTimer++;
    
    // Changer de frame toutes les 6 frames du jeu (environ 10 FPS à 60 FPS de jeu)
    if (player.frameTimer > 6) {
        player.frameTimer = 0;
        player.frameX = (player.frameX + 1) % currentAnim.frameCount;
    }
}
```

Comportement :
1. Sélectionne l'animation appropriée selon l'état du joueur
2. Incrémente le compteur d'animation à chaque frame du jeu
3. Lorsque le compteur atteint un seuil (6), passe à la frame suivante
4. Utilise l'opérateur modulo pour boucler l'animation

Cette fonction permet d'obtenir une animation fluide à environ 10 images par seconde, un rythme adapté au style pixel art du jeu.

### `drawPlayerAnimation(player, x, y, width, height)`

Cette fonction est responsable du rendu des personnages animés à l'écran, en gérant à la fois la sélection de frame et l'orientation du sprite.

```typescript
function drawPlayerAnimation(player: Joueur1 | Joueur2, x: number, y: number, width: number, height: number) {
    context.imageSmoothingEnabled = false;

    // Détermine quelle animation est en cours
    const currentAnim = player.state === 'idle' ? player.animations.idle : player.animations.run;
    const spriteSheet = currentAnim.spritesheet;
    const frameWidth = currentAnim.frameWidth;
    
    // Dessiner la frame courante avec gestion de l'orientation
    if (player.state === 'run-left' || player.facingLeft) {
        // Dessin du sprite inversé horizontalement
        context.save();
        context.translate(x + width, 0);
        context.scale(-1, 1);
        context.drawImage(
            spriteSheet,
            player.frameX * frameWidth, 0, frameWidth, frameWidth,
            0, y, width, height
        );
        context.restore();
    } else {
        // Dessin normal
        context.drawImage(
            spriteSheet,
            player.frameX * frameWidth, 0, frameWidth, frameWidth,
            x, y, width, height
        );
    }
}
```

Caractéristiques principales :
1. Désactive le lissage d'image pour un rendu pixel art net
2. Détermine la bonne animation à utiliser selon l'état du joueur
3. Gère l'orientation du sprite :
   - Si le joueur regarde à gauche, inverse le sprite horizontalement
   - Sinon, dessine le sprite normalement
4. Extrait la portion correcte du spritesheet correspondant à la frame actuelle

La technique d'inversion utilise les transformations du contexte canvas (`save`, `translate`, `scale`, `restore`) pour éviter de créer des images supplémentaires.

### `update_player()`

Cette fonction met à jour la position et l'état des joueurs en fonction des touches appuyées.

```typescript
function update_player() {
    const speed = 10;
    
    // Joueur 1
    let previousState = PLAYER1.state;
    
    if (keys.q) {
        PLAYER1.x -= speed;
        PLAYER1.state = 'run-left';
        PLAYER1.facingLeft = true;
    } else if (keys.d) {
        PLAYER1.x += speed;
        PLAYER1.state = 'run-right';
        PLAYER1.facingLeft = false;
    } else {
        PLAYER1.state = 'idle';
    }
    
    // Réinitialiser l'animation si l'état change
    if (previousState !== PLAYER1.state) {
        PLAYER1.frameX = 0;
        PLAYER1.frameTimer = 0;
    }
    
    // Même logique pour le joueur 2
    // ...
    
    // Mise à jour des animations
    updateAnimation(PLAYER1);
    updateAnimation(PLAYER2);
}
```

Cette fonction :
1. Vérifie les touches actuellement appuyées via l'objet `keys`
2. Modifie la position des joueurs selon les touches directionnelles
3. Met à jour l'état des joueurs ('idle', 'run-left', 'run-right')
4. Réinitialise les animations lors des changements d'état
5. Appelle `updateAnimation()` pour faire avancer les animations des deux joueurs

### `redessiner()`

Fonction principale de rendu qui dessine tous les éléments du jeu à chaque frame.

```typescript
function redessiner() {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  context.clearRect(0, 0, W, H);

  // 1) Fond vidéo
  if (backgroundVideo.readyState >= 2) {
    context.drawImage(backgroundVideo, 0, 0, W, H);
  }

  // 2) Pics au bas de l'écran
  // ...

  // 3) Plateforme
  // ...

  // 4) Joueurs avec leurs animations
  // ...
}
```

Cette fonction :
1. Efface le canvas
2. Dessine l'arrière-plan vidéo
3. Dessine les pics en bas de l'écran
4. Dessine la plateforme principale
5. Calcule les positions relatives des joueurs et les dessine avec leurs animations

Tous les éléments sont dessinés avec des dimensions relatives à la taille du canvas, assurant ainsi un affichage responsive.

### `resizeCanvas()`

```typescript
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.floor(window.innerWidth);
  const h = Math.floor(window.innerHeight);

  // Taille CSS
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  // Résolution interne
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}
```

Cette fonction assure que le canvas s'adapte à la taille de la fenêtre du navigateur et tient compte de la densité de pixels de l'écran pour un rendu net sur les écrans haute résolution.

### `gameLoop()`

```typescript
function gameLoop(timestamp: number) {
    // Calculer le deltaTime pour les animations et la physique
    const now = timestamp;
    const deltaTime = now - lastTime;
    lastTime = now;
    
    // Ne pas mettre à jour le jeu si la partie est terminée
    if (!gameOver) {
        update_player();
        updateCombat(deltaTime);
    }
    
    redessiner();
    requestAnimationFrame(gameLoop);
}
```

Fonction qui implémente la boucle principale du jeu. Elle :
1. Calcule le temps écoulé depuis la dernière frame (deltaTime)
2. Vérifie si le jeu est toujours en cours
3. Met à jour les positions et états des joueurs
4. Met à jour le système de combat
5. Redessine tous les éléments
6. Planifie la prochaine frame via `requestAnimationFrame`

Cette approche assure une animation fluide et des calculs de physique cohérents, synchronisés avec le taux de rafraîchissement de l'écran.

## Système de Physique

Le système de physique est responsable du mouvement des joueurs, de la gravité, des sauts et des collisions.

### `update_player()`

Cette fonction gère toute la physique des joueurs, y compris :
- Déplacement horizontal en fonction des touches
- Application de la gravité
- Saut
- Détection de collision avec la plateforme
- Gestion des chutes
- Traitement des knockbacks après les attaques

```typescript
export function update_player() {
    // Ne pas mettre à jour le jeu si la partie est terminée
    if (gameOver) return;
    
    const speed = 5;
    const gravity = 0.4;
    const jumpForce = -10;
    
    // Vérifier les événements de saut
    const player1JumpPressed = checkJumpKeyPressed('z');
    const player2JumpPressed = checkJumpKeyPressed('ArrowUp');
    
    // Vérifier les événements d'attaque
    const player1AttackPressed = checkAttackKeyPressed('e');
    const player2AttackPressed = checkAttackKeyPressed('Shift');
    
    if (player1AttackPressed) {
        initiateAttack('player1');
    }
    
    if (player2AttackPressed) {
        initiateAttack('player2');
    }
    
    // Traiter les joueurs avec notre système d'événements
    handlePlayer(PLAYER1, keys.q, keys.d, player1JumpPressed);
    handlePlayer(PLAYER2, keys.ArrowLeft, keys.ArrowRight, player2JumpPressed);
    
    // Mettre à jour l'état précédent des touches pour le prochain frame
    updateJumpKeyStates();
    updateAttackKeyStates();
}
```

### `handlePlayer()`

Fonction utilitaire qui gère la physique pour un joueur spécifique, incluant :
- Déplacement horizontal
- Application de la vélocité après knockback
- Saut et gravité
- Collision avec la plateforme
- Détection de chute
- Détection de collision avec les pics

## Système de Combat

Le système de combat gère les attaques entre joueurs, les dégâts et les effets de knockback.

### `initiateAttack(player: 'player1' | 'player2')`

```typescript
export function initiateAttack(player: 'player1' | 'player2'): void {
    if (player === 'player1' && canAttack(player1AttackCooldown)) {
        player1IsAttacking = true;
        player1AttackCooldown = ATTACK_COOLDOWN;
        
        // Vérifier si le joueur 2 est à portée
        if (isInAttackRange(PLAYER1, PLAYER2) && !PLAYER2.isDead) {
            // Réduire les HP du joueur 2
            damagePlayer('player2');
            
            // Pousser le joueur 2 dans la direction opposée au joueur 1
            const direction = PLAYER1.x < PLAYER2.x ? 1 : -1;
            knockbackPlayer(PLAYER2, direction);
            
            // Si le joueur n'a plus de HP, le faire tomber
            if (player2HP <= 0) {
                player2Lives.loseLife();
                player2HP = MAX_HP; // Réinitialiser pour la prochaine vie
                updateHealthDisplay('player2-health', player2HP, MAX_HP);
            }
        }
    } 
    // Logique similaire pour player2
}
```

### `knockbackPlayer(player, direction)`

```typescript
function knockbackPlayer(player: typeof PLAYER1, direction: number): void {
    // direction: 1 pour droite, -1 pour gauche
    player.velocity = player.velocity || { x: 0, y: 0 };
    player.velocity.x = KNOCKBACK_FORCE * direction;
    
    // Ajouter un saut plus prononcé pour un effet visuel plus dramatique
    player.velocity.y = -20;
    
    // Assurer que le joueur est en l'air pour le knockback
    player.isJumping = true;
}
```

### `updateCombat(deltaTime)`

```typescript
export function updateCombat(deltaTime: number): void {
    // Réduire les temps de recharge
    if (player1AttackCooldown > 0) {
        player1AttackCooldown -= deltaTime;
    }
    
    if (player2AttackCooldown > 0) {
        player2AttackCooldown -= deltaTime;
    }
}
```

## Système de Vies

Le système de vies gère le nombre de vies restantes pour chaque joueur et les conditions de fin de partie.

### Classe `LivesCounter`

```typescript
export class LivesCounter {
    remainingLives: number;
    maxLives: number;
    element: HTMLElement;
    playerIdentifier: string;
    
    constructor(playerId: string, initialLives: number = 3) {
        this.remainingLives = initialLives;
        this.maxLives = initialLives;
        this.playerIdentifier = playerId;
        this.element = document.getElementById(`${playerId}-lives`) || document.createElement('div');
        this.updateDisplay();
    }
    
    loseLife(): void {
        if (this.remainingLives > 0) {
            this.remainingLives--;
            this.updateDisplay();
            console.log(`${this.playerIdentifier} a perdu une vie! Vies restantes: ${this.remainingLives}`);
            
            // Vérifier si le joueur a perdu toutes ses vies
            if (this.remainingLives <= 0) {
                this.gameOver();
            }
        }
    }
    
    gainLife(): void {
        if (this.remainingLives < this.maxLives) {
            this.remainingLives++;
            this.updateDisplay();
        }
    }
    
    getRemainingLives(): number {
        return this.remainingLives;
    }
    
    updateDisplay(): void {
        if (this.element) {
            this.element.innerHTML = '❤️'.repeat(this.remainingLives);
        }
    }
    
    gameOver(): void {
        console.log(`GAME OVER - ${this.playerIdentifier} n'a plus de vies!`);
        // Logique de fin de partie
    }
}
```

### `handlePlayerFall(player)`

```typescript
export function handlePlayerFall(player: typeof PLAYER1): void {
    // Déterminer quel joueur est tombé
    const isPlayer1 = player.color === 'rouge';
    
    // Faire perdre une vie au joueur correspondant
    if (isPlayer1) {
        player1Lives.loseLife();
    } else {
        player2Lives.loseLife();
    }
    
    // Réinitialiser le joueur s'il a encore des vies
    if ((isPlayer1 && player1Lives.getRemainingLives() > 0) || 
        (!isPlayer1 && player2Lives.getRemainingLives() > 0)) {
        resetPlayer(player);
    }
}
```
