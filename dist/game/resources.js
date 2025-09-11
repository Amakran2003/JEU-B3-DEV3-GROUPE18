// Fonction pour précharger une image
function preloadImage(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        console.log(`Image chargée avec succès: ${url}`);
    };
    img.onerror = () => {
        console.error(`ERREUR: Impossible de charger l'image: ${url}`);
    };
    return img;
}
// Création et configuration de la vidéo d'arrière-plan
export const backgroundVideo = document.createElement('video');
backgroundVideo.src = "./assets/fonds/bg-ezgif.com-video-speed.mp4";
backgroundVideo.loop = true;
backgroundVideo.muted = true;
backgroundVideo.play();
// Chargement de l'image de pics
export const background_pics = new Image();
background_pics.src = './assets/images/fonds/pics.png';
// Définition de la plateforme statique
export const static_platforme = {
    x: 350,
    y: 725,
    width: 1200,
    height: 230,
    color: "white"
};
// Chargement des images de spritesheet pour le joueur 1 avec préchargement
export const joueur1_idle = preloadImage('assets/images/personnages/joueur1/Idle1.png');
export const joueur1_run = preloadImage('assets/images/personnages/joueur1/run1.png');
export const joueur1_jump = preloadImage('assets/images/personnages/joueur1/jump1.png');
export const joueur1_death = preloadImage('assets/images/personnages/joueur1/death1.png');
// Chargement des images de spritesheet pour le joueur 2 avec préchargement
export const joueur2_idle = preloadImage('assets/images/personnages/joueur2/Idle2.png');
export const joueur2_run = preloadImage('assets/images/personnages/joueur2/run2.png');
export const joueur2_jump = preloadImage('assets/images/personnages/joueur2/jump2.png');
export const joueur2_death = preloadImage('assets/images/personnages/joueur2/death2.png');
// Vérifier le chargement des ressources critiques
console.log("Status des animations de mort:");
console.log(`Joueur 1 death: ${joueur1_death.complete ? 'Chargé' : 'Non chargé'}, largeur: ${joueur1_death.width}`);
console.log(`Joueur 2 death: ${joueur2_death.complete ? 'Chargé' : 'Non chargé'}, largeur: ${joueur2_death.width}`);
