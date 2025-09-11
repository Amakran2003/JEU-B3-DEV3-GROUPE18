// Dimensions fixes du jeu (ratio 16:9 strict)
export const GAME_WIDTH = 1600; // Largeur fixe
export const GAME_HEIGHT = 900; // Hauteur fixe (ratio 16:9)
// Récupération du canvas et du contexte
export const canvas = document.getElementById("gamespace");
export const context = canvas.getContext('2d');
