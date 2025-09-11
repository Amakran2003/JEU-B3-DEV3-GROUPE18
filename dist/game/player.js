import { static_platforme, joueur1_idle, joueur1_run, joueur1_death, joueur2_idle, joueur2_run, joueur2_death } from './assets.js';
/**
 * Initialize player 1
 */
export function createPlayer1() {
    // Calculate initial Y based on platform top
    const initialY = static_platforme.y - 64; // platform top - player height
    return {
        x: static_platforme.x + static_platforme.width * 0.30, // 30% from left of platform
        y: initialY,
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
            death: {
                spritesheet: joueur1_death,
                frameCount: 4,
                frameWidth: 64
            }
        },
        isDead: false,
        deathPlayed: false,
        deathTimer: 0,
        spawnX: static_platforme.x + static_platforme.width * 0.30,
        spawnY: initialY,
        dying: false,
        deathCountdown: 0
    };
}
/**
 * Initialize player 2
 */
export function createPlayer2() {
    // Calculate initial Y based on platform top
    const initialY = static_platforme.y - 64; // platform top - player height
    return {
        x: static_platforme.x + static_platforme.width * 0.70, // 70% from left of platform
        y: initialY,
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
            death: {
                spritesheet: joueur2_death,
                frameCount: 4,
                frameWidth: 64
            }
        },
        isDead: false,
        deathPlayed: false,
        deathTimer: 0,
        spawnX: static_platforme.x + static_platforme.width * 0.70,
        spawnY: initialY,
        dying: false,
        deathCountdown: 0
    };
}
