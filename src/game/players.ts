import { Joueur1, Joueur2 } from '../interfaces.js';
import { 
    joueur1_idle, joueur1_run, joueur1_jump, joueur1_death,
    joueur2_idle, joueur2_run, joueur2_jump, joueur2_death
} from './resources.js';

// Initialisation des joueurs avec leurs animations
export let PLAYER1: Joueur1 = {
    x: 750,
    y: 600, // Ajusté pour être mieux positionné sur la plateforme
    width: 64,
    height: 64,
    color: "red",
    state: 'idle',
    facingLeft: false,
    frameX: 0,
    frameTimer: 0,
    animations: {
        idle: {
            spritesheet: joueur1_idle,
            frameCount: 8,
            frameWidth: 64
        },
        run: {
            spritesheet: joueur1_run,
            frameCount: 8,
            frameWidth: 64
        },
        jump: {
            spritesheet: joueur1_jump,
            frameCount: 8,
            frameWidth: 64
        },
        death: {
            spritesheet: joueur1_death,
            frameCount: 4,
            frameWidth: 64
        }
    },
    isDead: false,
    deathPlayed: false,
    hasFallen: false,
    spawnX: 750,
    spawnY: 600, // Ajusté pour la position de respawn
    deathTimer: 0,
    velocity: { x: 0, y: 0 },
    isJumping: false,
    canJump: true,
    jumpCooldown: 0
};

export let PLAYER2: Joueur2 = {
    x: 1250,
    y: 600, // Ajusté pour être mieux positionné sur la plateforme
    width: 64,
    height: 64,
    color: "blue",
    state: 'idle',
    facingLeft: false,
    frameX: 0,
    frameTimer: 0,
    animations: {
        idle: {
            spritesheet: joueur2_idle,
            frameCount: 8,
            frameWidth: 64
        },
        run: {
            spritesheet: joueur2_run,
            frameCount: 8,
            frameWidth: 64
        },
        jump: {
            spritesheet: joueur2_jump,
            frameCount: 8,
            frameWidth: 64
        },
        death: {
            spritesheet: joueur2_death,
            frameCount: 4,
            frameWidth: 64
        }
    },
    isDead: false,
    deathPlayed: false,
    hasFallen: false,
    spawnX: 1250,
    spawnY: 600, // Ajusté pour la position de respawn
    deathTimer: 0,
    velocity: { x: 0, y: 0 },
    isJumping: false,
    canJump: true,
    jumpCooldown: 0
};
