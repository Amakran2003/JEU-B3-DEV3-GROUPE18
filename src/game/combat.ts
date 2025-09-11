import { PLAYER1, PLAYER2 } from './players.js';
import { player1Lives, player2Lives } from './lives_manager.js';
import { playSound } from './sound_manager.js';

// Configuration des attaques
const ATTACK_COOLDOWN = 500; // Temps en ms entre chaque attaque
const ATTACK_RANGE = 150; // Portée de l'attaque en pixels (augmentée pour faciliter les touches)
const ATTACK_DAMAGE = 1; // Dégâts infligés par une attaque
const KNOCKBACK_FORCE = 40; // Force de poussée lors d'une attaque (augmentée pour un effet plus visible)

// Système de points de vie (XP)
const MAX_HP = 5;
export let player1HP = MAX_HP;
export let player2HP = MAX_HP;

// Variables pour suivre le temps de recharge des attaques
let player1AttackCooldown = 0;
let player2AttackCooldown = 0;

// États d'attaque des joueurs
export let player1IsAttacking = false;
export let player2IsAttacking = false;

// Fonction pour vérifier si un joueur peut attaquer
function canAttack(playerCooldown: number): boolean {
    return playerCooldown <= 0;
}

// Fonction pour vérifier si un joueur est à portée d'attaque de l'autre
function isInAttackRange(attacker: typeof PLAYER1, target: typeof PLAYER1): boolean {
    // Calculer la distance entre les deux joueurs
    const distance = Math.abs(attacker.x - target.x);
    
    // L'attaquant doit être face à la cible
    const isFacingTarget = (attacker.facingLeft && attacker.x > target.x) || 
                           (!attacker.facingLeft && attacker.x < target.x);
    
    return distance < ATTACK_RANGE && isFacingTarget;
}

// Fonction pour pousser un joueur (knockback)
function knockbackPlayer(player: typeof PLAYER1, direction: number): void {
    // direction: 1 pour droite, -1 pour gauche
    player.velocity = player.velocity || { x: 0, y: 0 };
    player.velocity.x = KNOCKBACK_FORCE * direction;
    
    // Ajouter un saut plus prononcé pour un effet visuel plus dramatique
    player.velocity.y = -20;
    
    // Assurer que le joueur est en l'air pour le knockback
    player.isJumping = true;
    
    console.log(`Joueur ${player.color} poussé avec une force de ${player.velocity.x}!`);
}

// Fonction pour réduire les HP d'un joueur
function damagePlayer(player: 'player1' | 'player2'): void {
    if (player === 'player1') {
        player1HP -= ATTACK_DAMAGE;
        if (player1HP < 0) player1HP = 0;
        updateHealthDisplay('player1-health', player1HP, MAX_HP);
    } else {
        player2HP -= ATTACK_DAMAGE;
        if (player2HP < 0) player2HP = 0;
        updateHealthDisplay('player2-health', player2HP, MAX_HP);
    }
}

// Fonction pour mettre à jour l'affichage de la santé
function updateHealthDisplay(elementId: string, currentHP: number, maxHP: number): void {
    const healthBar = document.querySelector(`#${elementId} .health-fill`) as HTMLElement;
    if (healthBar) {
        const percentage = (currentHP / maxHP) * 100;
        healthBar.style.width = `${percentage}%`;
    }
}

// Fonction pour lancer une attaque
export function initiateAttack(player: 'player1' | 'player2'): void {
    if (player === 'player1' && canAttack(player1AttackCooldown)) {
        player1IsAttacking = true;
        player1AttackCooldown = ATTACK_COOLDOWN;
        
        // Jouer le son d'attaque
        playSound('attack');
        
        // Vérifier si le joueur 2 est à portée
        if (isInAttackRange(PLAYER1, PLAYER2) && !PLAYER2.isDead) {
            // Jouer le son d'impact
            playSound('hit');
            
            // Réduire les HP du joueur 2
            damagePlayer('player2');
            console.log(`Joueur Rouge a frappé Joueur Bleu! HP restants: ${player2HP}/${MAX_HP}`);
            
            // Pousser le joueur 2 dans la direction opposée au joueur 1
            const direction = PLAYER1.x < PLAYER2.x ? 1 : -1;
            knockbackPlayer(PLAYER2, direction);
            
            // Si le joueur n'a plus de HP, le faire tomber
            if (player2HP <= 0) {
                player2Lives.loseLife();
                player2HP = MAX_HP; // Réinitialiser pour la prochaine vie
                updateHealthDisplay('player2-health', player2HP, MAX_HP);
            }
        }
        
        // Réinitialiser l'état d'attaque après un délai
        setTimeout(() => {
            player1IsAttacking = false;
        }, 300);
    } 
    else if (player === 'player2' && canAttack(player2AttackCooldown)) {
        player2IsAttacking = true;
        player2AttackCooldown = ATTACK_COOLDOWN;
        
        // Jouer le son d'attaque
        playSound('attack');
        
        // Vérifier si le joueur 1 est à portée
        if (isInAttackRange(PLAYER2, PLAYER1) && !PLAYER1.isDead) {
            // Jouer le son d'impact
            playSound('hit');
            
            // Réduire les HP du joueur 1
            damagePlayer('player1');
            console.log(`Joueur Bleu a frappé Joueur Rouge! HP restants: ${player1HP}/${MAX_HP}`);
            
            // Pousser le joueur 1 dans la direction opposée au joueur 2
            const direction = PLAYER2.x < PLAYER1.x ? 1 : -1;
            knockbackPlayer(PLAYER1, direction);
            
            // Si le joueur n'a plus de HP, le faire tomber
            if (player1HP <= 0) {
                player1Lives.loseLife();
                player1HP = MAX_HP; // Réinitialiser pour la prochaine vie
                updateHealthDisplay('player1-health', player1HP, MAX_HP);
            }
        }
        
        // Réinitialiser l'état d'attaque après un délai
        setTimeout(() => {
            player2IsAttacking = false;
        }, 300);
    }
}

// Initialisation des HP au début du jeu
export function initCombat(): void {
    // Réinitialiser les HP
    player1HP = MAX_HP;
    player2HP = MAX_HP;
    
    // Mettre à jour l'affichage
    updateHealthDisplay('player1-health', player1HP, MAX_HP);
    updateHealthDisplay('player2-health', player2HP, MAX_HP);
    
    console.log("Système de combat initialisé!");
}

// Mettre à jour les temps de recharge des attaques
export function updateCombat(deltaTime: number): void {
    // Réduire les temps de recharge
    if (player1AttackCooldown > 0) {
        player1AttackCooldown -= deltaTime;
    }
    
    if (player2AttackCooldown > 0) {
        player2AttackCooldown -= deltaTime;
    }
}
