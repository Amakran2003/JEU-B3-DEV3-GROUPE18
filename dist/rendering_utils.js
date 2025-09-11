/**
 * Utilitaires de rendu pour améliorer la qualité des images pixel art et animations
 */
/**
 * Configure le contexte de rendu pour un rendu pixel art optimal
 * @param ctx Le contexte de rendu 2D du canvas
 */
export function configurePixelArtRendering(ctx) {
    // Désactive l'anti-aliasing pour un rendu net des pixels
    ctx.imageSmoothingEnabled = false;
    // Alternative pour les navigateurs plus anciens
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
}
/**
 * Calcule les dimensions optimales pour un rendu pixel art
 * @param sourceWidth La largeur originale du sprite en pixels
 * @param targetWidth La largeur cible d'affichage
 * @returns Les dimensions optimisées qui préservent les pixels nets
 */
export function calculatePixelPerfectDimensions(sourceWidth, targetWidth) {
    // Trouve le multiple entier le plus proche de la taille source
    // qui s'approche au mieux de la taille cible
    const pixelRatio = Math.max(1, Math.round(targetWidth / sourceWidth));
    return sourceWidth * pixelRatio;
}
/**
 * Dessine une image avec un rendu pixel art optimal
 * @param ctx Contexte du canvas
 * @param img Image à dessiner
 * @param sx Position X source dans l'image
 * @param sy Position Y source dans l'image
 * @param sw Largeur source dans l'image
 * @param sh Hauteur source dans l'image
 * @param dx Position X destination sur le canvas
 * @param dy Position Y destination sur le canvas
 * @param dw Largeur destination sur le canvas
 * @param dh Hauteur destination sur le canvas
 */
export function drawPixelPerfect(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    // Sauvegarde des paramètres du contexte
    ctx.save();
    // Configure pour un rendu pixel art
    configurePixelArtRendering(ctx);
    // Ajuste les dimensions pour qu'elles soient des multiples entiers de la taille source
    const optimalWidth = calculatePixelPerfectDimensions(sw, dw);
    const optimalHeight = calculatePixelPerfectDimensions(sh, dh);
    // Dessine l'image avec les dimensions optimisées
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, optimalWidth, optimalHeight);
    // Restaure les paramètres du contexte
    ctx.restore();
}
/**
 * Retourne horizontalement un sprite avec un rendu pixel art optimal
 * @param ctx Contexte du canvas
 * @param img Image à dessiner
 * @param sx Position X source dans l'image
 * @param sy Position Y source dans l'image
 * @param sw Largeur source dans l'image
 * @param sh Hauteur source dans l'image
 * @param dx Position X destination sur le canvas
 * @param dy Position Y destination sur le canvas
 * @param dw Largeur destination sur le canvas
 * @param dh Hauteur destination sur le canvas
 */
export function drawFlippedPixelPerfect(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    // Sauvegarde des paramètres du contexte
    ctx.save();
    // Configure pour un rendu pixel art
    configurePixelArtRendering(ctx);
    // Ajuste les dimensions pour qu'elles soient des multiples entiers de la taille source
    const optimalWidth = calculatePixelPerfectDimensions(sw, dw);
    const optimalHeight = calculatePixelPerfectDimensions(sh, dh);
    // Applique une transformation pour inverser horizontalement l'image
    ctx.translate(dx + optimalWidth, 0);
    ctx.scale(-1, 1);
    // Dessine l'image avec les dimensions optimisées (x est maintenant 0 car on a translaté)
    ctx.drawImage(img, sx, sy, sw, sh, 0, dy, optimalWidth, optimalHeight);
    // Restaure les paramètres du contexte
    ctx.restore();
}
