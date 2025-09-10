"use strict";
// Fonctions principales du jeu

// Fonction pour dessiner le background et le pont sur le canvas
function dessinerBackgroundEtPont(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    // Charger l'image du background
    var bgImg = new Image(); // Crée un nouvel objet Image pour le fond
    bgImg.src = 'assets/fonds/background.png'; // Chemin du background
    bgImg.onload = function () {
        // Dessiner le background sur tout le canvas
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        // Après le fond, charger et dessiner le pont
        var pontImg = new Image(); // Crée un nouvel objet Image pour le pont
        pontImg.src = 'assets/plateformes/pont.png'; // Chemin de l'image du pont
        pontImg.onload = function () {
            // Dessiner le pont au centre du canvas
            var pontLargeur = canvas.width * 0.6; // Largeur du pont (60% du canvas)
            var pontHauteur = canvas.height * 0.4; // Hauteur du pont (15% du canvas)
            var x = (canvas.width - pontLargeur) / 2; // Position X centrée
            var y = canvas.height - pontHauteur; // Position Y tout en bas
            ctx.drawImage(pontImg, x, y, pontLargeur, pontHauteur); // Dessine l'image du pont
        };
    };
}

// Fonction pour lancer le jeu (afficher le canvas et dessiner le décor)
function lancerJeu() {
    var accueil = document.getElementById('accueil'); // Div de l'écran d'accueil
    var canvas = document.getElementById('gameCanvas'); // Canvas du jeu
    if (accueil)
        accueil.style.display = 'none'; // On cache l'accueil
    if (canvas) {
        canvas.style.display = 'block'; // On affiche le canvas
        dessinerBackgroundEtPont(canvas); // On dessine le décor
    }
}

// On rend la fonction accessible globalement
window.lancerJeu = lancerJeu;
