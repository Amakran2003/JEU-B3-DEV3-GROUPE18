// Système de touches ultra simplifié
export let keys = {
    z: false,
    q: false,
    s: false,
    d: false,
    e: false, // Touche d'attaque pour le joueur 1
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    Shift: false // Touche d'attaque pour le joueur 2
};
// État précédent des touches pour détecter les nouvelles pressions
let prevJumpKeys = {
    z: false,
    ArrowUp: false
};
let prevAttackKeys = {
    e: false,
    Shift: false
};
// Fonction pour détecter si une touche de saut vient d'être enfoncée
export function checkJumpKeyPressed(key) {
    return keys[key] && !prevJumpKeys[key];
}
// Fonction pour détecter si une touche d'attaque vient d'être enfoncée
export function checkAttackKeyPressed(key) {
    return keys[key] && !prevAttackKeys[key];
}
// Fonction pour mettre à jour l'état précédent des touches
export function updateJumpKeyStates() {
    prevJumpKeys.z = keys.z;
    prevJumpKeys.ArrowUp = keys.ArrowUp;
}
export function updateAttackKeyStates() {
    prevAttackKeys.e = keys.e;
    prevAttackKeys.Shift = keys.Shift;
}
// Gestionnaires d'événements simples
window.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key in keys) {
        keys[key] = true;
        if (key === 'z' || key === 'ArrowUp') {
            console.log(`Touche de saut ${key} enfoncée`);
        }
    }
});
window.addEventListener("keyup", (e) => {
    const key = e.key;
    if (key in keys) {
        keys[key] = false;
    }
});
