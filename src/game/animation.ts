import { Joueur1, Joueur2 } from '../interfaces.js';

export function updateAnimation(player: Joueur1 | Joueur2) {
    let currentAnim;
    
    // Forcer l'état de mort si isDead est true
    if (player.isDead && player.state !== 'death') {
        player.state = 'death';
        player.frameX = 0;
        player.frameTimer = 0;
        player.deathPlayed = false;
        console.log(`Forcé l'état death pour le joueur ${player.color}`);
    }
    
    // Afficher l'état actuel du joueur pour le débogage
    if (player.isJumping) {
        console.log(`Animation pour ${player.color}: état=${player.state}, isJumping=${player.isJumping}`);
    }
    
    if (player.state === 'death') {
        currentAnim = player.animations.death;
    } else if (player.state === 'jump' || player.isJumping) {
        currentAnim = player.animations.jump;
        // Force l'animation de saut si le joueur est en train de sauter
        if (player.state !== 'jump') {
            player.state = 'jump';
        }
    } else if (player.state === 'idle') {
        currentAnim = player.animations.idle;
    } else {
        currentAnim = player.animations.run;
    }
    
    player.frameTimer++;
    
    if (player.state === 'death') {
        // Débogage détaillé pour le diagnostic d'animation de mort
        console.log(`Animation mort ${player.color}: timer=${player.frameTimer}, frame=${player.frameX}/${currentAnim.frameCount}, deathPlayed=${player.deathPlayed}`);
        
        // Animation de mort plus lente (vitesse réduite)
        if (player.frameTimer >= 12 && !player.deathPlayed) {
            player.frameTimer = 0;
            player.frameX++;
            
            if (player.frameX >= currentAnim.frameCount) {
                player.frameX = currentAnim.frameCount - 1; // Rester sur la dernière frame
                player.deathPlayed = true;
                console.log(`Animation de mort ${player.color} terminée! Frame finale: ${player.frameX}`);
            }
        }
        
        // Si l'animation de mort est terminée, continuer à la montrer pendant un moment
        if (player.deathPlayed) {
            player.deathTimer = (player.deathTimer || 0) + 1;
            
            // Après 60 frames (environ 1 seconde à 60 FPS), arrêter de compter
            // La réinitialisation se fait maintenant dans handlePlayerFall
            if (player.deathTimer >= 60) {
                // Ne pas réinitialiser ici - laissons handlePlayerFall s'en occuper
                player.deathTimer = 60; // Bloquer à 60 pour éviter dépassement
            }
        }
    } else {
        if (player.frameTimer > 6) {
            player.frameTimer = 0;
            player.frameX = (player.frameX + 1) % currentAnim.frameCount;
        }
    }
}

// Fonction pour réinitialiser le joueur après sa mort
export function resetPlayer(player: Joueur1 | Joueur2) {
    // Réinitialiser la position
    player.x = player.spawnX || player.x;
    player.y = player.spawnY || player.y;
    
    // Réinitialiser les états
    player.state = 'idle';
    player.isDead = false;
    player.deathPlayed = false;
    player.hasFallen = false;
    player.frameX = 0;
    player.frameTimer = 0;
    player.deathTimer = 0;
    
    // Réinitialiser les propriétés de saut
    player.velocity = { x: 0, y: 0 };
    player.isJumping = false;
    player.canJump = true;
    player.jumpCooldown = 0;
    
    // S'assurer que les bonnes animations sont attribuées
    if (player.color === "red") {
        // Joueur 1 (rouge)
        console.log("Réinitialisation du joueur ROUGE avec ses animations spécifiques");
    } else if (player.color === "blue") {
        // Joueur 2 (bleu)
        console.log("Réinitialisation du joueur BLEU avec ses animations spécifiques");
    }
    
    console.log(`Joueur ${player.color} réinitialisé à sa position d'origine`);
}
