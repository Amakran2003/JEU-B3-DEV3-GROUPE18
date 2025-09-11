import { configurePixelArtRendering, drawPixelPerfect, drawFlippedPixelPerfect } from '../rendering_utils.js';
import { backgroundVideo, background_pics, static_platforme } from './assets.js';
import * as Constants from './constants.js';
// Get canvas and context
const canvas = document.getElementById("gamespace");
export const context = canvas.getContext('2d');
/**
 * Draw player animation with proper flipping and debug visuals
 */
export function drawPlayerAnimation(player, x, y, width, height, debugColor) {
    let currentAnim;
    if (player.state === 'death') {
        currentAnim = player.animations.death;
    }
    else if (player.state === 'idle') {
        currentAnim = player.animations.idle;
    }
    else {
        currentAnim = player.animations.run;
    }
    const spriteSheet = currentAnim.spritesheet;
    const frameWidth = currentAnim.frameWidth;
    if (player.state === 'run-left' || player.facingLeft) {
        drawFlippedPixelPerfect(context, spriteSheet, player.frameX * frameWidth, 0, frameWidth, frameWidth, x, y, width, height);
    }
    else {
        drawPixelPerfect(context, spriteSheet, player.frameX * frameWidth, 0, frameWidth, frameWidth, x, y, width, height);
    }
    // Debug: dessiner la zone de collision au niveau des pieds, décalée de 3px à gauche et 7px plus haut
    if (debugColor) {
        context.save();
        context.globalAlpha = 0;
        context.fillStyle = debugColor;
        context.fillRect(x + width / 2 - 20 - 3, y + height - 64 - 7, 37, 64);
        context.restore();
    }
}
/**
 * Main render function, draws all game elements
 */
export function redessiner(player1, player2) {
    // Dimensions constants
    const W = Constants.GAME_WIDTH;
    const H = Constants.GAME_HEIGHT;
    // Clear canvas
    context.clearRect(0, 0, W, H);
    // 1) Background video
    if (backgroundVideo.readyState >= 2) {
        context.save();
        context.imageSmoothingEnabled = true; // Smoothing for video
        context.drawImage(backgroundVideo, 0, 0, W, H);
        context.restore();
        // Re-enable pixel art rendering for other content
        configurePixelArtRendering(context);
    }
    // 2) Spikes at bottom of screen
    const spikesHeight = H * Constants.SPIKES_HEIGHT_RATIO; // 10% of height
    const srcRatio = background_pics.width / background_pics.height || (120 / 90);
    const spikesWidth = spikesHeight * srcRatio;
    // Position at bottom of screen
    const spikesY = H - spikesHeight * 0.9;
    // Draw spikes with optimized rendering
    for (let x = 0; x < W; x += spikesWidth) {
        drawPixelPerfect(context, background_pics, 0, 0, background_pics.width, background_pics.height, x, spikesY, spikesWidth, spikesHeight);
    }
    // Debug: draw box around spikes
    context.save();
    context.strokeStyle = '#ff0000'; // Red for debug
    context.lineWidth = 2;
    context.strokeRect(0, spikesY, W, spikesHeight);
    context.restore();
    // 3) Centered platform
    const platWidth = W * Constants.PLATFORM_WIDTH_RATIO; // 60% of width
    const platHeight = H * Constants.PLATFORM_HEIGHT_RATIO; // 22% of height
    // Position centered above spikes
    const platX = (W - platWidth) / 2;
    const platY = H - spikesHeight * Constants.SPIKES_VERTICAL_OFFSET_MULT;
    context.fillStyle = static_platforme.color;
    context.fillRect(platX, platY, platWidth, platHeight);
    // Debug: Draw vertical lines at platform edges
    context.save();
    context.strokeStyle = '#00ff00'; // Green for platform left edge
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(platX, platY - 10);
    context.lineTo(platX, platY + platHeight + 10);
    context.stroke();
    context.strokeStyle = '#ffff00'; // Yellow for platform right edge
    context.beginPath();
    context.moveTo(platX + platWidth, platY - 10);
    context.lineTo(platX + platWidth, platY + platHeight + 10);
    context.stroke();
    context.restore();
    // 4) Players - Increased sizes
    const playerWidth = W * 0.09; // 9% of width
    const playerHeight = H * 0.15; // 15% of height
    // Calculate scale between game coordinates and display coordinates (horizontal)
    const platScale = platWidth / static_platforme.width;
    // Horizontal positions on platform (screen-space)
    const p1x = platX + (player1.x - static_platforme.x) * platScale;
    const p2x = platX + (player2.x - static_platforme.x) * platScale;
    // Vertical transform: use same reference as game-space y
    const verticalScale = playerHeight / player1.height; // player1.height == player2.height
    const p1y = platY + (player1.y - static_platforme.y) * verticalScale + 3;
    const p2y = platY + (player2.y - static_platforme.y) * verticalScale + 3;
    // Draw players with debug collisions
    drawPlayerAnimation(player1, p1x, p1y, playerWidth, playerHeight, '#f00');
    drawPlayerAnimation(player2, p2x, p2y, playerWidth, playerHeight, '#00f');
    // Add explicit debug hitbox visualization
    context.save();
    context.strokeStyle = '#ff0000';
    context.lineWidth = 2;
    const p1HitboxLeft = p1x + playerWidth / 2 - (Constants.COLLISION_BOX_WIDTH * platScale) / 2 + (Constants.RIGHT_BIAS * platScale);
    context.strokeRect(p1HitboxLeft, p1y + playerHeight - 64, Constants.COLLISION_BOX_WIDTH * platScale, 4);
    // P2 hitbox
    context.strokeStyle = '#0000ff';
    const p2HitboxLeft = p2x + playerWidth / 2 - (Constants.COLLISION_BOX_WIDTH * platScale) / 2 + (Constants.RIGHT_BIAS * platScale);
    context.strokeRect(p2HitboxLeft, p2y + playerHeight - 64, Constants.COLLISION_BOX_WIDTH * platScale, 4);
    context.restore();
}
/**
 * Initialize the canvas size
 */
export function resizeCanvas() {
    // Use fixed dimensions for the canvas (16:9)
    canvas.width = Constants.GAME_WIDTH;
    canvas.height = Constants.GAME_HEIGHT;
    // Configure for optimal pixel art rendering
    configurePixelArtRendering(context);
    console.log(`Canvas initialisé avec dimensions fixes: ${Constants.GAME_WIDTH}x${Constants.GAME_HEIGHT}`);
}
