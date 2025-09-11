// Type pour les touches du jeu
type GameKey = 'z' | 'q' | 's' | 'd' | 'e' | 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'Shift';

// Système de touches ultra simplifié
export let keys: Record<GameKey, boolean> = {
    z: false,
    q: false,
    s: false,
    d: false,
    e: false,  // Touche d'attaque pour le joueur 1
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    Shift: false  // Touche d'attaque pour le joueur 2
};

// État précédent des touches pour détecter les nouvelles pressions
let prevJumpKeys: Record<'z' | 'ArrowUp', boolean> = {
    z: false,
    ArrowUp: false
};

let prevAttackKeys: Record<'e' | 'Shift', boolean> = {
    e: false,
    Shift: false
};

// Fonction pour détecter si une touche de saut vient d'être enfoncée
export function checkJumpKeyPressed(key: 'z' | 'ArrowUp'): boolean {
    return keys[key] && !prevJumpKeys[key];
}

// Fonction pour détecter si une touche d'attaque vient d'être enfoncée
export function checkAttackKeyPressed(key: 'e' | 'Shift'): boolean {
    return keys[key] && !prevAttackKeys[key];
}

// Fonction pour mettre à jour l'état précédent des touches
export function updateJumpKeyStates(): void {
    prevJumpKeys.z = keys.z;
    prevJumpKeys.ArrowUp = keys.ArrowUp;
}

export function updateAttackKeyStates(): void {
    prevAttackKeys.e = keys.e;
    prevAttackKeys.Shift = keys.Shift;
}

// Gestionnaires d'événements simples
window.addEventListener("keydown", (e) => {
    const key = e.key as GameKey;
    if (key in keys) {
        keys[key] = true;
        if (key === 'z' || key === 'ArrowUp') {
            console.log(`Touche de saut ${key} enfoncée`);
        }
    }
});

window.addEventListener("keyup", (e) => {
    const key = e.key as GameKey;
    if (key in keys) {
        keys[key] = false;
    }
});


