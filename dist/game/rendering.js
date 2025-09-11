import { GAME_WIDTH, GAME_HEIGHT, context } from './config.js';
import { backgroundVideo, background_pics, static_platforme } from './resources.js';
import { PLAYER1, PLAYER2 } from './players.js';
import { configurePixelArtRendering, drawPixelPerfect, drawFlippedPixelPerfect } from '../rendering_utils.js';
export function drawPlayerAnimation(player, x, y, width, height, debugColor) {
    let currentAnim;
    // Déterminer quelle animation utiliser
    if (player.state === 'death' || player.isDead) {
        currentAnim = player.animations.death;
        // Forcer l'état death si isDead est true mais que l'état n'est pas 'death'
        if (player.state !== 'death' && player.isDead) {
            player.state = 'death';
            player.frameX = 0; // Réinitialiser l'animation
        }
    }
    else if (player.state === 'jump' || player.isJumping) {
        currentAnim = player.animations.jump;
    }
    else if (player.state === 'idle') {
        currentAnim = player.animations.idle;
    }
    else {
        currentAnim = player.animations.run;
    }
    const spriteSheet = currentAnim.spritesheet;
    const frameWidth = currentAnim.frameWidth;
    // S'assurer que les images sont chargées avant de dessiner
    if (!spriteSheet.complete) {
        return; // Ne pas dessiner si l'image n'est pas chargée
    }
    // Dessiner l'animation
    if ((player.state === 'run-left' || player.facingLeft) && player.state !== 'death') {
        // Ne pas retourner l'animation de mort
        drawFlippedPixelPerfect(context, spriteSheet, player.frameX * frameWidth, 0, frameWidth, frameWidth, x, y, width, height);
    }
    else {
        drawPixelPerfect(context, spriteSheet, player.frameX * frameWidth, 0, frameWidth, frameWidth, x, y, width, height);
    }
    // Zone de collision (invisible)
    if (debugColor) {
        context.save();
        context.globalAlpha = 0;
        context.fillStyle = debugColor;
        context.fillRect(x + width / 2 - 20 - 3, y + height - 64 - 7, 37, 64);
        context.restore();
    }
}
export function redessiner() {
    // Utiliser les dimensions fixes
    const W = GAME_WIDTH;
    const H = GAME_HEIGHT;
    // Effacer tout le canvas
    context.clearRect(0, 0, W, H);
    // 1) Fond vidéo plein écran
    if (backgroundVideo.readyState >= 2) {
        context.save();
        context.imageSmoothingEnabled = true; // Lissage pour la vidéo
        context.drawImage(backgroundVideo, 0, 0, W, H);
        context.restore();
        // Réactiver le mode pixel art pour le reste du contenu
        configurePixelArtRendering(context);
    }
    // 2) Pics en bas de l'écran
    const spikesHeight = H * 0.10; // 10% de la hauteur
    const srcRatio = background_pics.width / background_pics.height || (120 / 90);
    const spikesWidth = spikesHeight * srcRatio;
    // Position en bas de l'écran
    const spikesY = H - spikesHeight * 0.9;
    // Dessiner les pics avec rendu optimisé
    for (let x = 0; x < W; x += spikesWidth) {
        drawPixelPerfect(context, background_pics, 0, 0, background_pics.width, background_pics.height, x, spikesY, spikesWidth, spikesHeight);
    }
    // 3) Plateforme centrée
    const platWidth = W * 0.60; // 60% de la largeur
    const platHeight = H * 0.22; // 22% de la hauteur
    // Position centrée au-dessus des pics
    const platX = (W - platWidth) / 2;
    const platY = H - spikesHeight * 2.2;
    context.fillStyle = static_platforme.color;
    context.fillRect(platX, platY, platWidth, platHeight);
    // 4) Joueurs - Tailles augmentées
    const playerWidth = W * 0.09; // 9% de la largeur (augmenté de 6% à 9%)
    const playerHeight = H * 0.15; // 15% de la hauteur (augmenté de 11% à 15%)
    // Calculer l'échelle entre les coordonnées de jeu et les coordonnées d'affichage
    const platScale = platWidth / static_platforme.width;
    // Positions sur la plateforme
    const p1x = platX + (PLAYER1.x - static_platforme.x) * platScale;
    const p2x = platX + (PLAYER2.x - static_platforme.x) * platScale;
    // Calculer la position verticale avec l'échelle et offset
    const verticalScale = playerHeight / PLAYER1.height; // ~2.1
    const p1y = platY - (platY - PLAYER1.y) * verticalScale + 5;
    const p2y = platY - (platY - PLAYER2.y) * verticalScale + 5;
    // Dessiner les joueurs avec debug collision
    drawPlayerAnimation(PLAYER1, p1x, p1y, playerWidth, playerHeight, '#f00');
    drawPlayerAnimation(PLAYER2, p2x, p2y, playerWidth, playerHeight, '#00f');
}
