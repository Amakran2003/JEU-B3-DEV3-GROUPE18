import { GAME_WIDTH, GAME_HEIGHT, canvas, context } from './config.js';
import { update_player } from './physics.js';
import { redessiner } from './rendering.js';
import { configurePixelArtRendering } from '../rendering_utils.js';
import { getPlayerLivesAsync } from './lives_manager.js'; // Importer le gestionnaire de vies
import { initiateAttack, updateCombat, initCombat } from './combat.js'; // Importer le système de combat
import { initSounds, playBackgroundMusic } from './sound_manager.js'; // Importer le gestionnaire de sons
import { PLAYER1, PLAYER2 } from './players.js'; // Importer les joueurs
import { Timer } from '../components/timer.js'; // Importer le gestionnaire de temps

export function resizeCanvas() {
  // Utiliser des dimensions fixes pour le canvas (16:9)
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  
  // Configurer pour un rendu pixel art optimal
  configurePixelArtRendering(context);
  
  console.log(`Canvas initialisé avec dimensions fixes: ${GAME_WIDTH}x${GAME_HEIGHT}`);
}

// Variable pour calculer le temps écoulé entre chaque frame
let lastTime = 0;

// Création du timer global du jeu
export let gameTimer: Timer;

// Fonction pour mettre à jour le statut du jeu basé sur les vies des joueurs
export function updateGameStatus(player1Lives: number, player2Lives: number) {
    // Cette fonction pourrait être utilisée pour mettre à jour l'interface utilisateur
    // ou pour prendre des décisions basées sur le nombre de vies restantes
    
    // Exemple : changer la couleur du fond selon les vies restantes
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
        if (player1Lives <= 1 || player2Lives <= 1) {
            statusElement.textContent = "Attention : Dernier souffle!";
            statusElement.style.color = "orange";
        } else {
            statusElement.textContent = "Combat en cours!";
            statusElement.style.color = "white";
        }
    }
    
    // On pourrait aussi ajuster la difficulté ou d'autres paramètres en fonction des vies
}

export function gameLoop(currentTime = 0) { // cette boucle refresh la canvas en lançant la fonction redessiner
    // Calculer le temps écoulé depuis la dernière frame en millisecondes
    const deltaTime = lastTime ? currentTime - lastTime : 16.67; // 60 FPS par défaut
    lastTime = currentTime;
    
    // Mettre à jour la logique du jeu
    update_player();
    updateCombat(deltaTime);
    
    // Périodiquement, vérifier les vies de manière asynchrone (toutes les ~5 secondes)
    if (Math.random() < 0.003) { // Environ une chance sur 300 frames (~5s à 60 FPS)
        Promise.all([
            getPlayerLivesAsync('player1'),
            getPlayerLivesAsync('player2')
        ]).then(([p1Lives, p2Lives]) => {
            updateGameStatus(p1Lives, p2Lives);
        }).catch(error => {
            console.warn("Erreur lors de la vérification périodique des vies:", error);
        });
    }
    
    // Redessiner l'écran
    redessiner();
    
    // Redemander une frame au navigateur
    requestAnimationFrame(gameLoop);
}

// Gestionnaire d'événement pour le redimensionnement simple
// Nous n'avons plus besoin de redimensionner le canvas, juste de redessiner
window.addEventListener("resize", () => {
    // Le CSS s'occupera de la mise à l'échelle proportionnelle
    // Nous forçons juste un redessinage pour s'assurer que tout est correct
    redessiner();
    console.log("Redessiner après redimensionnement de la fenêtre");
});

// Fonction pour vérifier le chargement des ressources des joueurs
function verifierAnimationsJoueurs() {
    // Vérification des animations du joueur 1
    console.log("--- VÉRIFICATION DES ANIMATIONS JOUEUR 1 ---");
    console.log(`Idle: ${PLAYER1.animations.idle.spritesheet.complete}, frames: ${PLAYER1.animations.idle.frameCount}`);
    console.log(`Run: ${PLAYER1.animations.run.spritesheet.complete}, frames: ${PLAYER1.animations.run.frameCount}`);
    console.log(`Jump: ${PLAYER1.animations.jump.spritesheet.complete}, frames: ${PLAYER1.animations.jump.frameCount}`);
    console.log(`Death: ${PLAYER1.animations.death.spritesheet.complete}, frames: ${PLAYER1.animations.death.frameCount}`);
    
    // Vérification des animations du joueur 2
    console.log("--- VÉRIFICATION DES ANIMATIONS JOUEUR 2 ---");
    console.log(`Idle: ${PLAYER2.animations.idle.spritesheet.complete}, frames: ${PLAYER2.animations.idle.frameCount}`);
    console.log(`Run: ${PLAYER2.animations.run.spritesheet.complete}, frames: ${PLAYER2.animations.run.frameCount}`);
    console.log(`Jump: ${PLAYER2.animations.jump.spritesheet.complete}, frames: ${PLAYER2.animations.jump.frameCount}`);
    console.log(`Death: ${PLAYER2.animations.death.spritesheet.complete}, frames: ${PLAYER2.animations.death.frameCount}`);
}

// Initialisation du jeu avec dimensions fixes
window.addEventListener('load', async () => {
    try {
        // Initialiser le canvas avec les dimensions fixes
        resizeCanvas();
        
        // Initialiser le système de combat
        initCombat();
        
        // Vérifier les ressources des animations
        setTimeout(verifierAnimationsJoueurs, 1000);
        
        // Initialiser le timer avec 2 minutes (120 secondes)
        gameTimer = new Timer('timer', 120);
        
        // Définir ce qui se passe à la fin du compte à rebours
        gameTimer.setOnTimeUp(() => {
            console.log("Temps écoulé! Vérification du gagnant...");
            import('./lives_manager.js').then(livesManagerModule => {
                const { determineWinnerByScore, showVictoryScreen } = livesManagerModule;
                const result = determineWinnerByScore();
                console.log(`Résultat final: ${result}`);
                showVictoryScreen(result, true); // true indique que c'est dû au temps écoulé
            }).catch(err => {
                console.error("Erreur lors de la détermination du gagnant:", err);
            });
        });
        
        // Démarrer le compte à rebours
        gameTimer.start();
        
        // Initialiser le système audio de manière asynchrone
        try {
            await initSounds();
            
            // Jouer la musique de fond après l'initialisation des sons
            try {
                await playBackgroundMusic();
            } catch (musicError) {
                console.warn("Impossible de jouer la musique de fond:", musicError);
            }
        } catch (audioError) {
            console.error("Erreur lors de l'initialisation du système audio:", audioError);
            // Continuer l'initialisation du jeu malgré les erreurs audio
        }
        
        // Récupération asynchrone des vies des joueurs pour affichage initial
        try {
            const [player1Lives, player2Lives] = await Promise.all([
                getPlayerLivesAsync('player1'),
                getPlayerLivesAsync('player2')
            ]);
            
            console.log(`État initial des vies - Joueur 1: ${player1Lives}, Joueur 2: ${player2Lives}`);
            
            // On pourrait faire quelque chose avec ces informations si nécessaire
            updateGameStatus(player1Lives, player2Lives);
        } catch (livesError) {
            console.error("Erreur lors de la récupération des vies initiales:", livesError);
        }
        
        // Démarrer la boucle de jeu
        gameLoop();
        
        console.log("Jeu initialisé avec dimensions 16:9 fixes");
    } catch (error) {
        console.error("Erreur critique lors de l'initialisation du jeu:", error);
    }
});

console.log("Script chargé");
