import { keys } from '../movements.js';
import { handlePlayer } from './physics.js';
import { redessiner, resizeCanvas } from './renderer.js';
import { createPlayer1, createPlayer2 } from './player.js';
// Initialize players
const PLAYER1 = createPlayer1();
const PLAYER2 = createPlayer2();
/**
 * Update game state
 */
function update_player() {
    // Update player 1
    handlePlayer(PLAYER1, keys.q, keys.d);
    // Update player 2
    handlePlayer(PLAYER2, keys.ArrowLeft, keys.ArrowRight);
}
/**
 * Main game loop
 */
export function gameLoop() {
    update_player();
    redessiner(PLAYER1, PLAYER2);
    requestAnimationFrame(gameLoop); // Request next frame
}
/**
 * Initialize the game
 */
export function initGame() {
    // Initialize the canvas with fixed dimensions
    resizeCanvas();
    // Start the game loop
    gameLoop();
    console.log("Jeu initialisé avec dimensions 16:9 fixes");
}
// Set resize handler
window.addEventListener("resize", () => {
    // CSS will handle proportional scaling
    // Force redraw to ensure everything is correct
    redessiner(PLAYER1, PLAYER2);
    console.log("Redessiner après redimensionnement de la fenêtre");
});
