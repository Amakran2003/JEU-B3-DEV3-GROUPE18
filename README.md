# Jeu 2D Multijoueur

Ce projet est un jeu de plateforme multijoueur très simple, réalisé en JavaScript, TypeScript, HTML et CSS dans le cadre du module B3-DEV3.

## Liens

- **Jouer au jeu en ligne** : [https://amakran2003.github.io/JEU-B3-DEV3-GROUPE18](https://amakran2003.github.io/JEU-B3-DEV3-GROUPE18)

## Démarrage

### Contrôles

#### Joueur 1 (Rouge)
- **Déplacement** :
  - `Q` : Aller à gauche
  - `D` : Aller à droite
  - `Z` : Sauter
- **Combat** :
  - `E` : Attaquer

#### Joueur 2 (Bleu)
- **Déplacement** :
  - `←` (Flèche Gauche) : Aller à gauche
  - `→` (Flèche Droite) : Aller à droite
  - `↑` (Flèche Haut) : Sauter
- **Combat** :
  - `Shift` : Attaquer

### Règles du Jeu

1. **Objectif** : Éliminer toutes les vies de l'adversaire pour gagner la partie.

2. **Système de Vie** :
   - Chaque joueur commence avec 3 vies.
   - Un joueur perd une vie s'il tombe de la plateforme ou si sa barre de santé atteint zéro.

3. **Système de Santé** :
   - Chaque joueur a une barre de santé (XP).
   - Les attaques réduisent la santé de l'adversaire.
   - Lorsque la santé d'un joueur atteint zéro, il perd une vie et sa santé est restaurée.

4. **Combat** :
   - Pour attaquer l'adversaire, placez-vous près de lui et faites face à lui, puis appuyez sur votre touche d'attaque.
   - Chaque attaque pousse l'adversaire et lui inflige des dégâts.
   - Il y a un court délai entre chaque attaque possible.

5. **Plateformes et Dangers** :
   - Restez sur la plateforme centrale pour éviter de tomber.
   - Évitez les pics qui se trouvent aux extrémités de l'écran.

### Conseils de Jeu

- Essayez de pousser votre adversaire hors de la plateforme avec vos attaques pour lui faire perdre une vie directement.
- Utilisez les sauts pour esquiver les attaques de votre adversaire.
- Attaquez quand votre adversaire est proche du bord de la plateforme pour maximiser vos chances de le faire tomber.
- Soyez vigilant : perdre toute votre santé vous fera perdre une vie, alors défendez-vous bien !

## 🚀 Pour Lancer le Jeu

1. Assurez-vous que tous les fichiers sont correctement installés.
2. Ouvrez le fichier `index.html` dans votre navigateur.
3. Amusez-vous !

## 💻 Développement

Ce jeu est développé avec TypeScript et HTML5 Canvas. Pour modifier le code source :

1. Modifiez les fichiers TypeScript dans le dossier `/src`
2. Compilez avec la commande `tsc`
3. Rafraîchissez le navigateur pour voir les changements

---

Créé avec ❤️ pour les amateurs de jeux de combat plateformes !
