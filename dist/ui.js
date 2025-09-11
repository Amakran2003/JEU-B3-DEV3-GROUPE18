// Importer le gestionnaire de sons
import { playBackgroundMusic, pauseBackgroundMusic, playSound } from './game/sound_manager.js';
// UI logic for menu, panels, settings
function showMenu() {
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('game-ui').style.display = 'none';
    forceHideSettings();
    // Pause la musique quand on retourne au menu
    pauseBackgroundMusic();
}
function showGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-ui').style.display = 'flex';
    forceHideSettings();
    // Démarrer la musique quand on lance le jeu
    playBackgroundMusic();
    // Son UI
    playSound('ui-click');
}
function showSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}
function hideSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
function forceHideSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('style', 'display: none !important; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 20; align-items: center; justify-content: center;');
    }
}
window.addEventListener('DOMContentLoaded', () => {
    // Menu
    const playBtn = document.getElementById('play-btn');
    if (playBtn)
        playBtn.onclick = showGame;
    // Accueil
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn)
        homeBtn.onclick = showMenu;
    // Paramètres
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn)
        settingsBtn.onclick = showSettings;
    const closeSettings = document.getElementById('close-settings');
    if (closeSettings)
        closeSettings.onclick = forceHideSettings;
    // Empêcher la fermeture du modal par clic sur le fond
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal)
                forceHideSettings();
        });
    }
    // Gestion du contrôle du son
    const soundControl = document.getElementById('sound-control');
    const soundBtn = document.getElementById('sound-btn');
    if (soundControl && soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundControl.classList.toggle('active');
        });
    }
    // Plein écran
    const fullscreenBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                fullscreenBtn.textContent = 'Désactiver';
            }
            else {
                document.exitFullscreen();
                fullscreenBtn.textContent = 'Activer';
            }
        });
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.textContent = 'Activer';
            }
            else {
                fullscreenBtn.textContent = 'Désactiver';
            }
        });
    }
    // État initial : afficher le menu
    showMenu();
    forceHideSettings();
});
