# Spécifications Techniques : Jeu de Plateforme "Red vs Blue"

## Introduction

"Red vs Blue" est un jeu de combat sur plateforme multijoueur local développé en TypeScript et HTML5. Ce projet exploite les capacités du canvas HTML5 pour créer un environnement de jeu 2D dynamique et responsive où deux joueurs s'affrontent sur une plateforme suspendue au-dessus d'un environnement dangereux.

Le jeu est conçu comme une démonstration technique des possibilités offertes par les technologies web modernes pour le développement de jeux. Il met particulièrement l'accent sur la physique de jeu, les systèmes de combat, la gestion des animations à travers des spritesheets et l'adaptation automatique à différentes tailles d'écran.

Le code est structuré selon les principes de la programmation orientée objet avec TypeScript, offrant ainsi un typage fort qui améliore la robustesse et la maintenabilité du projet.

## Vue d'ensemble

### Concept du jeu

"Red vs Blue" met en scène deux chevaliers, représentés par un joueur rouge et un joueur bleu, qui s'affrontent sur une plateforme suspendue au-dessus d'un environnement dangereux. Les joueurs peuvent se déplacer horizontalement, sauter et attaquer leur adversaire. L'objectif est d'éliminer toutes les vies de l'adversaire en l'attaquant jusqu'à épuiser sa santé ou en le faisant tomber de la plateforme.

### Contrôles

- **Joueur 1 (Rouge)** : 
  - Déplacement à gauche : Touche Q
  - Déplacement à droite : Touche D
  - Saut : Touche Z
  - Attaque : Touche E

- **Joueur 2 (Bleu)** :
  - Déplacement à gauche : Flèche gauche
  - Déplacement à droite : Flèche droite
  - Saut : Flèche haut
  - Attaque : Touche Shift

### Éléments du jeu

1. **Arrière-plan** : Une vidéo en boucle qui crée une atmosphère dynamique
2. **Plateforme** : Une structure suspendue sur laquelle les joueurs se déplacent
3. **Pics** : Des obstacles dangereux disposés sous la plateforme
4. **Personnages** : Deux joueurs avec des animations distinctes pour différents états (repos, course, saut, mort)
5. **Interface utilisateur** : Barres de vie et indicateurs du nombre de vies restantes pour chaque joueur

### Fonctionnalités principales

- **Système de physique** : Gravité, sauts, et knockback lors des attaques
- **Système de combat** : Attaques, dégâts, et effet de poussée
- **Système de vies** : Plusieurs vies par joueur, avec perte de vie en tombant ou en perdant toute sa santé
- **Animations fluides** : Les personnages disposent d'animations pour différents états (idle, run, jump, death)
- **Orientation intelligente** : Les personnages conservent leur orientation même lorsqu'ils s'arrêtent
- **Collisions précises** : Détection de la plateforme, des limites de l'écran et des pics
- **Design responsive** : Le jeu s'adapte automatiquement à la taille de l'écran
- **Rendu pixelisé** : Utilisation du mode pixelart pour un rendu net des sprites
- **Support des écrans haute résolution** : Adaptation automatique au ratio de pixels de l'appareil

Ce jeu complet illustre les techniques avancées du développement de jeux en JavaScript/TypeScript, allant de la gestion des entrées utilisateur à l'animation de sprites, en passant par l'implémentation d'un système de combat et de physique réaliste.
