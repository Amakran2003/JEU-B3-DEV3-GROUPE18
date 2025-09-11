import { Lives } from '../components/lives.js';
import { PLAYER1, PLAYER2 } from './players.js';
import { playSound } from './sound_manager.js';
import { player1HP, player2HP } from './combat.js';
// Variable pour suivre si le jeu est terminé
export let gameOver = false;
export let winner = null;
// Initialisation des compteurs de vies
export const player1Lives = new Lives('player1-lives', 3);
export const player2Lives = new Lives('player2-lives', 3);
// Le timer est maintenant géré via import dynamique
// Fonction pour déterminer le gagnant à la fin du temps imparti
export function determineWinnerByScore() {
    // Récupérer les vies et HP actuels
    const p1Lives = player1Lives.getRemainingLives();
    const p2Lives = player2Lives.getRemainingLives();
    // Si un joueur a plus de vies, il gagne
    if (p1Lives > p2Lives) {
        return 'red'; // Joueur 1 (rouge) gagne
    }
    else if (p2Lives > p1Lives) {
        return 'blue'; // Joueur 2 (bleu) gagne
    }
    // Si les vies sont égales, comparer les HP
    if (player1HP > player2HP) {
        return 'red'; // Joueur 1 a plus de HP
    }
    else if (player2HP > player1HP) {
        return 'blue'; // Joueur 2 a plus de HP
    }
    // Si tout est égal, c'est un match nul
    return 'tie';
}
// Fonction pour créer l'écran de victoire ou de fin de jeu
export function showVictoryScreen(winnerColor, timeUp = false) {
    // Arrêter le timer via import dynamique pour éviter les cycles
    import('./main.js').then(({ gameTimer }) => {
        if (gameTimer) {
            gameTimer.stop();
        }
    }).catch(err => {
        console.error("Erreur lors de l'arrêt du timer:", err);
    });
    // Marquer le jeu comme terminé
    gameOver = true;
    if (winnerColor !== 'tie') {
        winner = winnerColor;
    }
    // Créer un élément div pour l'écran de fin
    const victoryScreen = document.createElement('div');
    victoryScreen.id = 'victory-screen';
    victoryScreen.style.position = 'fixed';
    victoryScreen.style.top = '0';
    victoryScreen.style.left = '0';
    victoryScreen.style.width = '100vw';
    victoryScreen.style.height = '100vh';
    victoryScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    victoryScreen.style.color = '#fff';
    victoryScreen.style.display = 'flex';
    victoryScreen.style.flexDirection = 'column';
    victoryScreen.style.justifyContent = 'center';
    victoryScreen.style.alignItems = 'center';
    victoryScreen.style.zIndex = '1000';
    // Titre
    const title = document.createElement('h1');
    title.style.fontSize = '3em';
    title.style.marginBottom = '30px';
    if (winnerColor === 'tie') {
        title.style.color = '#FFD700'; // Or pour match nul
        title.textContent = 'Match nul !';
    }
    else {
        title.style.color = winnerColor;
        title.textContent = `Le joueur ${winnerColor === 'red' ? 'Rouge' : 'Bleu'} a gagné!`;
    }
    // Afficher le motif de la fin
    const reasonDisplay = document.createElement('h3');
    reasonDisplay.style.fontSize = '1.5em';
    reasonDisplay.style.marginBottom = '20px';
    reasonDisplay.style.color = '#ffffff';
    reasonDisplay.textContent = timeUp
        ? 'Temps écoulé !'
        : (winnerColor !== 'tie' ? 'Victoire par K.O. !' : 'Égalité parfaite !');
    // Afficher les statistiques
    const p1Lives = player1Lives.getRemainingLives();
    const p2Lives = player2Lives.getRemainingLives();
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'stats-display';
    statsDisplay.innerHTML = `
        <h3>Statistiques finales</h3>
        <div class="player-stats">
            <span class="player-name red">Joueur Rouge</span>
            <span>${p1Lives} vies, ${player1HP} HP</span>
        </div>
        <div class="player-stats">
            <span class="player-name blue">Joueur Bleu</span>
            <span>${p2Lives} vies, ${player2HP} HP</span>
        </div>
    `;
    // Afficher le temps de jeu ou temps restant
    const timeElement = document.getElementById('timer');
    const timeDisplay = document.createElement('h2');
    timeDisplay.style.fontSize = '1.6em';
    timeDisplay.style.marginTop = '20px';
    timeDisplay.style.marginBottom = '20px';
    timeDisplay.style.color = '#ffffff';
    timeDisplay.textContent = timeUp
        ? 'Temps écoulé !'
        : `Temps restant: ${timeElement ? timeElement.textContent.replace('Temps :', '') : '00:00'}`;
    // Bouton pour recommencer
    const restartButton = document.createElement('button');
    restartButton.style.fontSize = '1.5em';
    restartButton.style.padding = '10px 20px';
    restartButton.style.margin = '20px';
    restartButton.style.cursor = 'pointer';
    restartButton.textContent = 'Rejouer';
    restartButton.onclick = () => {
        window.location.reload(); // Recharge la page pour recommencer
    };
    // Bouton pour retourner au menu
    const menuButton = document.createElement('button');
    menuButton.style.fontSize = '1.5em';
    menuButton.style.padding = '10px 20px';
    menuButton.style.margin = '20px';
    menuButton.style.cursor = 'pointer';
    menuButton.textContent = 'Menu Principal';
    menuButton.onclick = () => {
        // Cacher l'écran de jeu et montrer le menu
        document.getElementById('game-ui').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
        document.body.removeChild(victoryScreen);
        gameOver = false;
        winner = null;
    };
    // Ajouter les éléments à l'écran
    victoryScreen.appendChild(title);
    victoryScreen.appendChild(reasonDisplay);
    victoryScreen.appendChild(statsDisplay);
    victoryScreen.appendChild(timeDisplay);
    victoryScreen.appendChild(restartButton);
    victoryScreen.appendChild(menuButton);
    // Ajouter l'écran à la page
    document.body.appendChild(victoryScreen);
    // Animation de confettis (bonus visuel) - uniquement pour les victoires, pas en cas de match nul
    if (winnerColor !== 'tie') {
        createConfetti(winnerColor);
    }
    else {
        // Pour les matchs nuls, créer des confettis dorés
        createGoldConfetti();
    }
}
// Fonction pour créer des confettis dorés (pour match nul)
function createGoldConfetti() {
    const confettiCount = 200;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '999';
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        // Nuances de doré et d'argent pour match nul
        confetti.style.backgroundColor =
            Math.random() > 0.5
                ? `rgba(${Math.random() * 30 + 225}, ${Math.random() * 30 + 190}, ${Math.random() * 50}, 0.8)` // Or
                : `rgba(${Math.random() * 30 + 200}, ${Math.random() * 30 + 200}, ${Math.random() * 30 + 220}, 0.8)`; // Argent
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + '%';
        const duration = Math.random() * 3 + 2;
        const leftOffset = Math.random() * 40 - 20;
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${leftOffset}vw) rotate(${Math.random() * 360}deg)`, opacity: 0.3 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });
        container.appendChild(confetti);
    }
    document.body.appendChild(container);
    // Supprimer les confettis après un délai
    setTimeout(() => {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }, 6000);
}
// Fonction pour créer des confettis
function createConfetti(color) {
    const confettiCount = 200;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '999';
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = color === 'red' ?
            `rgba(${Math.random() * 55 + 200}, ${Math.random() * 50}, ${Math.random() * 50}, 0.8)` :
            `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 55 + 200}, 0.8)`;
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + '%';
        const duration = Math.random() * 3 + 2;
        const leftOffset = Math.random() * 40 - 20;
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${leftOffset}vw) rotate(${Math.random() * 360}deg)`, opacity: 0.3 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });
        container.appendChild(confetti);
    }
    document.body.appendChild(container);
    // Supprimer les confettis après un délai
    setTimeout(() => {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }, 6000);
}
// Fonction asynchrone pour récupérer les vies d'un joueur avec Promise
export async function getPlayerLivesAsync(playerType) {
    return new Promise((resolve, reject) => {
        try {
            // Simuler une opération asynchrone (par exemple, récupération depuis un serveur)
            setTimeout(() => {
                try {
                    if (playerType === 'player1') {
                        const lives = player1Lives.getRemainingLives();
                        console.log(`Récupération asynchrone des vies du joueur 1: ${lives}`);
                        resolve(lives);
                    }
                    else if (playerType === 'player2') {
                        const lives = player2Lives.getRemainingLives();
                        console.log(`Récupération asynchrone des vies du joueur 2: ${lives}`);
                        resolve(lives);
                    }
                    else {
                        reject(new Error(`Type de joueur invalide: ${playerType}`));
                    }
                }
                catch (innerError) {
                    console.error(`Erreur lors de la récupération des vies:`, innerError);
                    reject(innerError);
                }
            }, 100); // Délai court pour simuler une opération asynchrone
        }
        catch (error) {
            console.error(`Exception lors de la récupération des vies:`, error);
            reject(error);
        }
    });
}
// Fonction pour gérer la perte de vie
export async function handlePlayerFall(player) {
    // Ne rien faire si le jeu est déjà terminé
    if (gameOver)
        return;
    let remainingLives = 0;
    try {
        // Jouer l'animation de mort d'abord si elle n'est pas déjà en cours
        // Note: L'animation est maintenant déclenchée dans physics.ts, donc on vérifie juste l'état
        if (player.isDead && player.state === 'death' && !player.deathPlayed) {
            // L'animation est déjà en cours, attendons qu'elle finisse
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        // Ensuite, gérer la perte de vie
        if (player === PLAYER1) {
            player1Lives.loseLife();
            // Utilisation de notre fonction asynchrone
            try {
                remainingLives = await getPlayerLivesAsync('player1');
            }
            catch (livesError) {
                console.error("Erreur lors de la récupération asynchrone des vies:", livesError);
                // Fallback à la méthode synchrone en cas d'erreur
                remainingLives = player1Lives.getRemainingLives();
            }
            console.log(`Joueur 1 (Rouge) a perdu une vie! Vies restantes: ${remainingLives}`);
            // Si plus de vies, déclarer le joueur 2 gagnant
            if (remainingLives <= 0) {
                gameOver = true;
                winner = 'blue';
                console.log("GAME OVER! Le joueur Bleu a gagné!");
                await playSound('game-over');
                setTimeout(() => showVictoryScreen('blue'), 1000);
                return; // Ne pas réinitialiser le joueur
            }
        }
        else if (player === PLAYER2) {
            player2Lives.loseLife();
            // Utilisation de notre fonction asynchrone
            try {
                remainingLives = await getPlayerLivesAsync('player2');
            }
            catch (livesError) {
                console.error("Erreur lors de la récupération asynchrone des vies:", livesError);
                // Fallback à la méthode synchrone en cas d'erreur
                remainingLives = player2Lives.getRemainingLives();
            }
            console.log(`Joueur 2 (Bleu) a perdu une vie! Vies restantes: ${remainingLives}`);
            // Si plus de vies, déclarer le joueur 1 gagnant
            if (remainingLives <= 0) {
                gameOver = true;
                winner = 'red';
                console.log("GAME OVER! Le joueur Rouge a gagné!");
                await playSound('game-over');
                setTimeout(() => showVictoryScreen('red'), 1000);
                return; // Ne pas réinitialiser le joueur
            }
        }
        // Réinitialiser la position du joueur si le jeu continue
        player.x = player.spawnX || player.x;
        player.y = player.spawnY || player.y;
        // Réinitialiser l'état du joueur
        player.hasFallen = false;
        player.isDead = false;
        player.velocity = { x: 0, y: 0 };
        player.isJumping = false;
        player.state = 'idle';
    }
    catch (error) {
        console.error("Erreur critique lors de la gestion de la perte de vie:", error);
        // Même en cas d'erreur, essayons de réinitialiser la position du joueur
        try {
            player.x = player.spawnX || player.x;
            player.y = player.spawnY || player.y;
            player.hasFallen = false;
            player.isDead = false;
            player.velocity = { x: 0, y: 0 };
            player.isJumping = false;
            player.state = 'idle';
        }
        catch (resetError) {
            console.error("Impossible de réinitialiser le joueur après une erreur:", resetError);
        }
    }
}
