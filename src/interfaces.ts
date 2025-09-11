export interface Emplacement {
    x : number;
    y : number;
    width : number;
    height : number;
    color : string;
}

export interface Animation {
    spritesheet: HTMLImageElement;
    frameCount: number;    // Nombre de frames dans cette animation
    frameWidth: number;    // Largeur d'une frame dans le spritesheet
}

export interface Joueur extends Emplacement {
    state: 'idle' | 'run-left' | 'run-right' | 'death' | 'jump';
    facingLeft: boolean;
    frameX: number;        // Frame actuelle
    frameTimer: number;    // Minuteur pour l'animation
    animations: {          // Objet contenant toutes les animations
        idle: Animation;
        run: Animation;
        death: Animation;
        jump: Animation;
    };
    isDead?: boolean;
    deathPlayed?: boolean;
    deathTimer?: number;   // Compteur pour la durée de l'animation de mort
    spawnX?: number;       // Position de respawn X dans coordonnées jeu
    spawnY?: number;       // Position de respawn Y dans coordonnées jeu
    dying?: boolean;       // Flag when player is in dying state (freezes on spikes)
    deathCountdown?: number; // Frames left before respawn
    hasFallen?: boolean;   // Indique si le joueur est tombé sous la plateforme
    velocity?: { x: number; y: number }; // Vecteur de vitesse pour le saut
    isJumping?: boolean;   // Indique si le joueur est en train de sauter
    canJump?: boolean;     // Indique si le joueur peut sauter (sur une plateforme)
    jumpCooldown?: number; // Compteur pour le délai entre les sauts
}

// Types pour une meilleure lisibilité et compatibilité avec le code existant
export type Joueur1 = Joueur;
export type Joueur2 = Joueur;
