// Fichier point d'entrée qui importe tous les modules nécessaires
import './game/config.js';
import './game/resources.js';
import './game/players.js';
import './game/animation.js';
import './game/physics.js';
import './game/rendering.js';
import { gameLoop, resizeCanvas } from './game/main.js';

// Exporter les fonctions principales pour les rendre disponibles
export { gameLoop, resizeCanvas };

// Le reste du code est maintenant importé depuis les fichiers correspondants
console.log("Module canvas_settings.ts chargé - Structure modulaire");
