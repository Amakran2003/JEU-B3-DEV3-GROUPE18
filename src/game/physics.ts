import { Joueur1, Joueur2 } from '../interfaces.js';
import { keys, checkJumpKeyPressed, updateJumpKeyStates, checkAttackKeyPressed, updateAttackKeyStates } from '../movements.js';
import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import { static_platforme } from './resources.js';
import { PLAYER1, PLAYER2 } from './players.js';
import { updateAnimation } from './animation.js';
import { handlePlayerFall, gameOver } from './lives_manager.js';
import { initiateAttack } from './combat.js';
import { playSound } from './sound_manager.js';

export function update_player() {
    // Ne pas mettre à jour le jeu si la partie est terminée
    if (gameOver) return;
    
    // Constantes physiques
    const speed = 5;
    const gravity = 0.4;
    const jumpForce = -10;
    
    // Détection des entrées
    const player1JumpPressed = checkJumpKeyPressed('z');
    const player2JumpPressed = checkJumpKeyPressed('ArrowUp');
    
    const player1AttackPressed = checkAttackKeyPressed('e');
    const player2AttackPressed = checkAttackKeyPressed('Shift');
    
    // Traiter les attaques
    if (player1AttackPressed) {
        initiateAttack('player1');
    }
    
    if (player2AttackPressed) {
        initiateAttack('player2');
    }
    
    // Paramètres de collision
    const collisionWidth = 10;
    const collisionHeight = 64;
    const collisionOffsetX = 20 + 3;
    const collisionOffsetY = 64 + 7;
    
    // Dimensions et positions des éléments
    const platWidth = GAME_WIDTH * 0.60;
    const platX = (GAME_WIDTH - platWidth) / 2;
    const platLeft = platX;
    const platRight = platX + platWidth;
    const platTop = GAME_HEIGHT - GAME_HEIGHT * 0.22;
    const spikesHeight = GAME_HEIGHT * 0.10;
    const spikesY = GAME_HEIGHT - spikesHeight * 0.9;
    
    // Fonction utilitaire pour gérer la physique de chaque joueur
    function handlePlayer(player: Joueur1 | Joueur2, keysLeft: boolean, keysRight: boolean, playerJumpRequested: boolean) {
        let previousState = player.state;
        
        // Si le joueur est actif
        if (!player.hasFallen && !player.isDead) {
            // Gestion du knockback
            if (player.velocity && player.velocity.x) {
                player.x += player.velocity.x;
                player.velocity.x *= 0.8;  // Friction
                
                if (Math.abs(player.velocity.x) < 0.5) {
                    player.velocity.x = 0;
                }
                
                // Mise à jour de l'animation selon la direction
                if (player.velocity.x < 0) {
                    player.state = player.isJumping ? 'jump' : 'run-left';
                } else if (player.velocity.x > 0) {
                    player.state = player.isJumping ? 'jump' : 'run-right';
                }
            } 
            // Contrôles normaux
            else if (keysLeft) {
                player.x -= speed;
                if (!player.isJumping) {
                    player.state = 'run-left';
                }
                player.facingLeft = true;
            } else if (keysRight) {
                player.x += speed;
                if (!player.isJumping) {
                    player.state = 'run-right';
                }
                player.facingLeft = false;
            } else if (!player.isJumping) {
                player.state = 'idle';
            }
            
            // Initialisation du vecteur vitesse
            player.velocity = player.velocity || { x: 0, y: 0 };
            
            // Gestion du saut
            if (playerJumpRequested) {
                player.velocity.y = jumpForce;
                player.isJumping = true;
                player.state = 'jump';
                player.y -= 20;  // Effet visuel immédiat
                playSound('jump');
            }
        } else if (player.hasFallen && !player.isDead) {
            player.state = 'idle';
        }
        
        // Limiter la position horizontale aux bords de l'écran
        player.x = Math.max(0 + player.width / 2, Math.min(GAME_WIDTH - player.width / 2, player.x));
        
        // Calcul des coordonnées écran et hitbox
        const screenX = platX + (player.x - static_platforme.x) * (platWidth / static_platforme.width);
        const hitboxLeft = screenX - collisionWidth / 2;
        const hitboxRight = screenX + collisionWidth / 2;
        const feetY = player.y + player.height;
        
        // Hitbox pour la détection de plateforme
        const playerWidth = GAME_WIDTH * 0.09;
        const spriteLeft = screenX - playerWidth / 2;
        const spriteRight = screenX + playerWidth / 2;
        const leftMargin = 200;  // Marge asymétrique pour meilleure jouabilité
        const rightMargin = 40;
        
        // Détection si le joueur est sur la plateforme
        const onPlatform = (
            feetY >= platTop - 15 && feetY <= platTop + 35 && 
            spriteLeft >= platLeft - leftMargin && spriteRight <= platRight + rightMargin
        );
        
        // Détection si le joueur est sur les pics
        const spikesDeathOffset = 40;  // Valeur plus élevée = il faut tomber plus bas sur les pics pour mourir
        const onSpikes = (
            (hitboxLeft < platLeft || hitboxRight > platRight) && 
            feetY >= spikesY + spikesDeathOffset
        );
        
        // Détection de chute sous la plateforme
        if (feetY > platTop + 20 && !player.hasFallen && !player.isDead) {
            player.hasFallen = true;
            player.isDead = true;
            
            playSound('fall');
            
            // Configuration de l'animation de mort
            player.state = 'death';
            player.frameX = 0;
            player.frameTimer = 0;
            player.deathPlayed = false;
            
            // Légère impulsion vers le haut pour l'animation de mort
            player.velocity = player.velocity || { x: 0, y: 0 };
            player.velocity.y = -8;
            
            // S'assurer que le joueur reste visible
            if (player.y > GAME_HEIGHT) {
                player.y = GAME_HEIGHT - player.height * 1.5;
            }
            
            // Délai pour l'animation avant perte de vie
            setTimeout(() => {
                if (player.hasFallen) {
                    handlePlayerFall(player);
                }
            }, 1500);
        }
        
        // Mort sur les pics
        if (onSpikes && !player.isDead) {
            player.state = 'death';
            player.isDead = true;
            player.frameX = 0;
            player.deathPlayed = false;
            
            playSound('death');
            
            // Ajustement pour que le joueur soit visible sur les pics
            if (feetY - spikesY < 15) {
                player.y -= 5;
            }
            
            // Délai pour l'animation de mort
            setTimeout(() => {
                if (player.isDead) {
                    handlePlayerFall(player);
                }
            }, 1500);
        } 
        // Mort en tombant hors de l'écran
        else if (feetY > GAME_HEIGHT * 1.5 && !player.isDead) {
            player.state = 'death';
            player.isDead = true;
            player.frameX = 0;
            player.deathPlayed = false;
            
            // Positionnement pour que l'animation de mort soit visible
            player.y = GAME_HEIGHT - player.height * 2;
            player.velocity = { x: 0, y: -8 };
            
            // Délai pour l'animation
            setTimeout(() => {
                if (player.isDead) {
                    handlePlayerFall(player);
                }
            }, 1200);
        } 
        // Comportement normal (joueur vivant)
        else if (!player.isDead) {
            player.velocity = player.velocity || { x: 0, y: 0 };
            
            // Sur la plateforme
            if (onPlatform && !onSpikes && !player.hasFallen) {
                // Positionner correctement sur la plateforme
                player.y = platTop - player.height;
                player.velocity.y = 0;
                
                // Atterrissage
                if (player.isJumping) {
                    player.isJumping = false;
                    playSound('land');
                }
            } 
            // En l'air
            else if (!onSpikes) {
                // Appliquer la gravité
                player.velocity.y += gravity;
                player.y += player.velocity.y;
                
                // Prédiction d'atterrissage
                const nextY = player.y + player.velocity.y;
                const nextFeetY = nextY + player.height;
                const willLandOnPlatform = (
                    nextFeetY >= platTop - 5 && 
                    nextFeetY <= platTop + 20 && 
                    spriteLeft >= platLeft - leftMargin && 
                    spriteRight <= platRight + rightMargin
                );
                
                // Ralentir la chute à l'approche de la plateforme
                if (willLandOnPlatform && player.velocity.y > 0) {
                    player.velocity.y = Math.min(player.velocity.y, 5);
                }
                
                // Mettre à jour l'animation de saut
                if (player.velocity.y < 0 || player.isJumping) {
                    player.state = 'jump';
                }
            }
        }
        
        // Réinitialiser l'animation si l'état a changé
        if (previousState !== player.state) {
            player.frameX = 0;
            player.frameTimer = 0;
        }
        
        updateAnimation(player);
    }
    
    // Appliquer la physique aux deux joueurs
    handlePlayer(PLAYER1, keys.q, keys.d, player1JumpPressed);
    handlePlayer(PLAYER2, keys.ArrowLeft, keys.ArrowRight, player2JumpPressed);
    
    // Mettre à jour les états des touches
    updateJumpKeyStates();
    updateAttackKeyStates();
}
