# Mosaïque

Des grilles logiques à noircir : les nombres au bord de chaque ligne et de chaque colonne disent quelles cases sont noires. Une fois la grille juste, elle se colore et révèle son image. Quatre tailles (5 × 5 pour débuter, 10 × 10, 15 × 15 et 20 × 20), 22 grilles toutes faites et des grilles au hasard sans fin.

*English version: [README.en.md](README.en.md)*

## Les règles

La grille fait 5 × 5, 10 × 10, 15 × 15 ou 20 × 20 cases, au choix dans la liste **Taille**. Les nombres à gauche d'une ligne, ou au-dessus d'une colonne, donnent dans l'ordre la longueur des blocs de cases noires : « 3 1 » veut dire un bloc de 3 cases noires, au moins une case blanche, puis un bloc d'une case. « 0 » veut dire que la ligne est vide.

En croisant les lignes et les colonnes, on déduit case par case lesquelles noircir. Toute grille qui respecte tous les nombres est acceptée, même si elle diffère du dessin prévu.

## Commandes

- **Clic** : noircir une case (ou la blanchir si elle l'est déjà).
- **Clic droit** ou **Maj + clic** : poser une croix, pour noter qu'une case est sûrement blanche.
- **Glisser** en gardant le bouton enfoncé : appliquer la même action à plusieurs cases d'un coup.

Les nombres d'une ligne ou d'une colonne se grisent quand elle est juste. Des traits plus épais toutes les 5 cases aident à compter.

## Les grilles

- **5 × 5 (débutant)** : 6 petites grilles pour apprendre (un cœur, une flèche, un sourire, un sapin, une maison, un plus).
- **10 × 10, grilles 1 à 12** : un cœur, un champignon, une étoile, un chat, une maison, un arbre, un bateau, un fantôme, une tasse, une clé, un poisson et une note de musique. Une fois finie, le nom de l'image apparaît et la grille est cochée dans la liste.
- **15 × 15** : un chat et un voilier. **20 × 20** : un champignon et une fusée.
- **Au hasard**, dans chaque taille : une nouvelle forme symétrique d'une seule couleur à chaque fois.

Choisis la grille dans la liste ; **Nouvelle partie** recommence la grille en cours. Après une victoire, un clic passe à la grille suivante (ou à une autre au hasard).

## Statistiques

Grilles résolues (sur 22, toutes tailles), grilles au hasard réussies, temps sur la grille en cours et parties gagnées. Un chronomètre tourne pendant la partie.

## Plein écran

Le bouton **Plein écran** agrandit la grille à tout l'écran (Échap pour en sortir). Hors plein écran, elle prend toute la place que laisse la fenêtre, du petit portable au grand écran.

## Données et synchronisation

Tes grilles résolues, leurs temps et tes statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Mosaïque → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
