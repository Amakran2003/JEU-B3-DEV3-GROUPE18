// Point d'entrée principal du jeu
// Ce fichier importe tous les modules nécessaires et démarre le jeu

// Importer les configurations et modules du jeu
import './game/config.js';
import './game/resources.js';
import './game/players.js';
import './game/animation.js';
import './game/physics.js';
import './game/rendering.js';
import { gameLoop, resizeCanvas } from './game/main.js';

// Démarrer le jeu
window.addEventListener('load', () => {
    console.log("Initialisation du jeu avec structure modulaire");
    // Initialiser le canvas avec les dimensions fixes
    resizeCanvas();
    
    // Démarrer la boucle de jeu
    gameLoop();
});

console.log("Module principal chargé");
