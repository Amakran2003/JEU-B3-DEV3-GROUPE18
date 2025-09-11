import * as Constants from './constants.js';
// Background video
export const backgroundVideo = document.createElement('video');
backgroundVideo.src = "./assets/fonds/bg-ezgif.com-video-speed.mp4";
backgroundVideo.loop = true;
backgroundVideo.muted = true;
backgroundVideo.play();
// Spikes image
export const background_pics = new Image();
background_pics.src = './assets/images/fonds/pics.png';
// Platform definition
export const static_platforme = {
    x: Constants.computedPlatX,
    y: Constants.computedPlatY,
    width: Constants.computedPlatWidth,
    height: Constants.computedPlatHeight,
    color: "white"
};
// Player spritesheet loading
export const joueur1_idle = new Image();
joueur1_idle.src = 'assets/images/personnages/joueur1/Idle1.png';
export const joueur1_run = new Image();
joueur1_run.src = 'assets/images/personnages/joueur1/Run1.png';
export const joueur1_death = new Image();
joueur1_death.src = 'assets/images/personnages/joueur1/death1.png';
export const joueur2_idle = new Image();
joueur2_idle.src = 'assets/images/personnages/joueur2/Idle2.png';
export const joueur2_run = new Image();
joueur2_run.src = 'assets/images/personnages/joueur2/Run2.png';
export const joueur2_death = new Image();
joueur2_death.src = 'assets/images/personnages/joueur2/death2.png';
