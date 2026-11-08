# Mosaïque (Mosaic)

Logic grids to fill in: the numbers on the edge of each row and each column tell you which cells are black. Once the grid is right, it colours itself and reveals its picture. 12 ready-made grids and endless random ones.

*Version française : [README.md](README.md)*

## Rules

The grid is 10 × 10 cells. The numbers to the left of a row, or above a column, give in order the length of the blocks of black cells: "3 1" means a block of 3 black cells, at least one white cell, then a block of one cell. "0" means the line is empty.

By crossing rows and columns, you work out cell by cell which ones to fill. Any grid that matches every number is accepted, even if it differs from the intended picture.

## Controls

- **Click**: fill a cell (or clear it if already filled).
- **Right-click** or **Shift + click**: place a cross, to note that a cell is surely white.
- **Drag** while holding the button: apply the same action to several cells at once.

The numbers of a row or column turn grey when it is right. Thicker lines every 5 cells help with counting.

## Grids

- **Grids 1 to 12**: a heart, a mushroom, a star, a cat, a house, a tree, a boat, a ghost, a cup, a key, a fish and a musical note. Once finished, the picture's name appears and the grid is ticked in the list.
- **Random**: a new symmetrical one-colour shape every time.

Pick the grid in the list; **New game** restarts the current grid. After a win, a click moves on to the next grid (or another random one).

## Statistics

Grids solved out of 12, random grids completed, time on the current grid and games won. A timer runs during the game.

## Data and sync

Your solved grids, their times and your statistics are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Mosaïque → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
