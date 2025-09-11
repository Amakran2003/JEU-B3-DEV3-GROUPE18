// Gestionnaire d'effets sonores pour le jeu
// Chaque son est préchargé et peut être joué à la demande
// Dictionnaire pour stocker tous les effets sonores
const sounds = {};
// Musique de fond
let backgroundMusic = null;
let musicVolume = 0.1;
// Fonction pour précharger un son avec Promise
export function loadSound(name, path, volume = 1.0) {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio();
            audio.src = path;
            audio.volume = volume;
            // Créer l'entrée dans le dictionnaire
            sounds[name] = {
                audio: audio,
                volume: volume,
                isLoaded: false
            };
            // Marquer comme chargé lorsque le fichier est prêt
            audio.oncanplaythrough = () => {
                sounds[name].isLoaded = true;
                console.log(`Son "${name}" chargé avec succès`);
                resolve();
            };
            // Gérer les erreurs de chargement
            audio.onerror = (err) => {
                console.error(`Erreur lors du chargement du son "${name}":`, err);
                reject(new Error(`Impossible de charger le son: ${name} depuis ${path}`));
            };
            // Timeout pour éviter les promesses bloquées
            setTimeout(() => {
                if (!sounds[name].isLoaded) {
                    console.warn(`Timeout lors du chargement du son "${name}", passage à la suite`);
                    resolve(); // On résout quand même pour ne pas bloquer le chargement
                }
            }, 5000);
            // Lancer le préchargement
            audio.load();
        }
        catch (error) {
            console.error(`Exception lors du chargement du son "${name}":`, error);
            reject(error);
        }
    });
}
// Fonction pour jouer un son avec gestion d'erreurs async/await
export async function playSound(name, volume) {
    try {
        // Vérifier si le son existe
        if (!sounds[name]) {
            console.warn(`Le son "${name}" n'existe pas`);
            return;
        }
        // Créer un clone du son pour permettre des lectures multiples simultanées
        const soundToPlay = sounds[name].audio.cloneNode();
        // Appliquer le volume spécifié ou utiliser la valeur par défaut
        soundToPlay.volume = volume !== undefined ? volume : sounds[name].volume;
        // Jouer le son avec async/await
        try {
            await soundToPlay.play();
        }
        catch (error) {
            console.warn(`Impossible de jouer le son "${name}":`, error);
            // Tentative de récupération - certains navigateurs nécessitent une interaction utilisateur
            if (error instanceof Error && error.name === 'NotAllowedError') {
                console.info(`Le son "${name}" nécessite une interaction utilisateur pour être joué`);
                // On pourrait stocker ce son pour le jouer plus tard après une interaction utilisateur
                document.addEventListener('click', async () => {
                    try {
                        await soundToPlay.play();
                    }
                    catch (retryError) {
                        console.error(`Échec de lecture après interaction pour "${name}":`, retryError);
                    }
                }, { once: true });
            }
        }
    }
    catch (error) {
        console.error(`Exception lors de la lecture du son "${name}":`, error);
    }
}
// Fonction pour initialiser et jouer la musique de fond avec Promise
export async function initBackgroundMusic() {
    return new Promise((resolve, reject) => {
        try {
            backgroundMusic = new Audio('assets/sounds/music/music.mp3');
            backgroundMusic.volume = musicVolume;
            backgroundMusic.loop = true;
            // Événement de chargement réussi
            backgroundMusic.oncanplaythrough = () => {
                console.log('Musique de fond chargée avec succès');
                resolve();
            };
            // Événement d'erreur
            backgroundMusic.onerror = (err) => {
                console.error('Erreur lors du chargement de la musique de fond:', err);
                reject(new Error('Impossible de charger la musique de fond'));
            };
            // Précharger la musique
            backgroundMusic.load();
            console.log('Initialisation de la musique de fond...');
            // Connecter les contrôles de volume
            const musicVolumeSlider = document.getElementById('music-volume');
            if (musicVolumeSlider) {
                // Initialiser le slider avec la valeur actuelle
                musicVolumeSlider.value = (musicVolume * 100).toString();
                // Écouter les changements
                musicVolumeSlider.addEventListener('input', () => {
                    const newVolume = parseInt(musicVolumeSlider.value) / 100;
                    setMusicVolume(newVolume);
                });
            }
            // Timeout pour éviter les promesses bloquées
            setTimeout(() => {
                console.warn('Timeout lors du chargement de la musique, passage à la suite');
                resolve(); // On résout quand même pour ne pas bloquer le chargement
            }, 5000);
        }
        catch (error) {
            console.error('Exception lors de l\'initialisation de la musique de fond:', error);
            reject(error);
        }
    });
}
// Fonction pour démarrer la musique de fond avec async/await
export async function playBackgroundMusic() {
    try {
        if (backgroundMusic) {
            try {
                await backgroundMusic.play();
                console.log('Musique de fond démarrée');
            }
            catch (playError) {
                // Gérer l'erreur de lecture
                console.error('Erreur lors de la lecture de la musique de fond:', playError);
                // Tentative de récupération après une interaction utilisateur
                if (playError instanceof Error && playError.name === 'NotAllowedError') {
                    console.info('La musique nécessite une interaction utilisateur pour être jouée');
                    setupUserInteractionMusicStart();
                }
            }
        }
        else {
            console.warn('La musique de fond n\'a pas été initialisée');
            // Tenter d'initialiser la musique
            try {
                await initBackgroundMusic();
                console.log('Musique initialisée avec succès');
                // Essayer de jouer la musique après initialisation
                if (backgroundMusic) {
                    try {
                        const music = backgroundMusic;
                        await music.play();
                        console.log('Musique de fond récupérée et démarrée');
                    }
                    catch (secondPlayError) {
                        if (secondPlayError instanceof Error && secondPlayError.name === 'NotAllowedError') {
                            setupUserInteractionMusicStart();
                        }
                    }
                }
            }
            catch (initError) {
                console.error('Échec de l\'initialisation de la musique:', initError);
            }
        }
    }
    catch (error) {
        console.error('Exception inattendue lors de la gestion de la musique:', error);
    }
}
// Fonction utilitaire pour configurer le démarrage de la musique après interaction utilisateur
function setupUserInteractionMusicStart() {
    document.addEventListener('click', () => {
        if (backgroundMusic) {
            backgroundMusic.play()
                .then(() => console.log('Musique démarrée après interaction utilisateur'))
                .catch(err => console.error('Échec de lecture de la musique après interaction:', err));
        }
    }, { once: true });
}
// Fonction pour mettre en pause la musique de fond
export function pauseBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}
// Fonction pour régler le volume de la musique
export function setMusicVolume(volume) {
    musicVolume = Math.max(0, Math.min(1, volume));
    if (backgroundMusic) {
        backgroundMusic.volume = musicVolume;
    }
    console.log(`Volume de la musique réglé à ${musicVolume}`);
}
// Fonction pour régler le volume des effets sonores
export function setEffectsVolume(volume) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    // Mettre à jour le volume de tous les effets sonores
    for (const soundName in sounds) {
        const sound = sounds[soundName];
        sound.volume = normalizedVolume;
        if (sound.audio) {
            sound.audio.volume = normalizedVolume;
        }
    }
    console.log(`Volume des effets sonores réglé à ${normalizedVolume}`);
}
// Fonction pour charger tous les sons du jeu avec async/await
export async function initSounds() {
    try {
        console.log('Initialisation du système audio...');
        // Tableau de promesses pour le chargement parallèle des sons
        const loadPromises = [
            // Sons d'interface
            loadSound('ui-click', 'assets/sounds/sfx/ui-click.mp3', 0.5),
            // Sons du joueur
            loadSound('jump', 'assets/sounds/sfx/jump.mp3', 0.7),
            loadSound('land', 'assets/sounds/sfx/land.mp3', 0.5),
            loadSound('attack', 'assets/sounds/sfx/attack.mp3', 0.8),
            loadSound('hit', 'assets/sounds/sfx/hit.mp3', 0.7),
            loadSound('death', 'assets/sounds/sfx/death.mp3', 0.9),
            loadSound('fall', 'assets/sounds/sfx/fall.mp3', 0.8),
            // Sons environnement
            loadSound('game-over', 'assets/sounds/sfx/game-over.mp3', 1.0)
        ];
        // Charger tous les sons en parallèle
        await Promise.allSettled(loadPromises);
        console.log('Chargement des effets sonores terminé');
        // Initialiser la musique de fond
        try {
            await initBackgroundMusic();
        }
        catch (musicError) {
            console.warn('Problème lors de l\'initialisation de la musique:', musicError);
            // Continuer malgré l'erreur de musique
        }
        // Connecter le contrôle de volume des effets sonores
        const fxVolumeSlider = document.getElementById('fx-volume');
        if (fxVolumeSlider) {
            // Définir la valeur initiale
            fxVolumeSlider.value = '50';
            // Écouter les changements
            fxVolumeSlider.addEventListener('input', () => {
                const newVolume = parseInt(fxVolumeSlider.value) / 100;
                setEffectsVolume(newVolume);
            });
        }
        console.log('Système audio initialisé avec succès');
    }
    catch (error) {
        console.error('Erreur lors de l\'initialisation du système audio:', error);
        // Continuer malgré les erreurs pour que le jeu fonctionne sans audio si nécessaire
    }
}
