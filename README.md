# Tents and Trees solver

An algorithm for solving the levels from the [Tents and Trees](https://play.google.com/store/apps/details?id=com.frozax.tentsandtrees) mobile game (clones exist too e.g. [this one](https://www.puzzle-tents.com/)).

#### How Tents and Trees works

Tents and Trees is somewhat similar to Minesweeper, where you start with some known cells and must incrementally determine the value of all remaining cells.

For the specific rules, play the game! Or [watch this](https://www.youtube.com/watch?v=t9IvjUPwYLE).

#### How the solver works

A set of solvers are defined, where each solver inspects the board and determines which cells can only be one particular state based on the state of surrounding cells.

Each solver looks for different clues, and they all get applied to the board sequentially until the board is solved (all cells are known and correctly matching the row and column counts).

The code has 5 test levels; here is the 4th level being solved, for example:
```
initial: (29 unknowns)

  0 2 0 2 1 2       0 2 0 2 1 2 
1 ■ X ■ ■ X ■     1 ~ X ~ ~ X O 
2 ■ ■ ■ ■ X X     2 ~ O ~ O X X 
1 ■ ■ ■ X ■ ■     1 ~ ~ ~ X ~ O 
1 ■ X ■ ■ ■ ■     1 ~ X ~ O ~ ~ 
1 ■ ■ ■ ■ ■ ■     1 ~ O ~ ~ ~ ~ 
1 ■ ■ ■ X ■ ■     1 ~ ~ ~ X O ~ 

solveZeroes applied: (12 cells solved, 17 left)

  0 2 0 2 1 2       0 2 0 2 1 2 
1 ~ X ~ ■ X ■     1 ~ X ~ ~ X O 
2 ~ ■ ~ ■ X X     2 ~ O ~ O X X 
1 ~ ■ ~ X ■ ■     1 ~ ~ ~ X ~ O 
1 ~ X ~ ■ ■ ■     1 ~ X ~ O ~ ~ 
1 ~ ■ ~ ■ ■ ■     1 ~ O ~ ~ ~ ~ 
1 ~ ■ ~ X ■ ■     1 ~ ~ ~ X O ~ 

solveOpenSeas applied: (6 cells solved, 11 left)

  0 2 0 2 1 2       0 2 0 2 1 2 
1 ~ X ~ ■ X ■     1 ~ X ~ ~ X O 
2 ~ ■ ~ ■ X X     2 ~ O ~ O X X 
1 ~ ■ ~ X ■ ■     1 ~ ~ ~ X ~ O 
1 ~ X ~ ■ ~ ~     1 ~ X ~ O ~ ~ 
1 ~ ■ ~ ■ ~ ~     1 ~ O ~ ~ ~ ~ 
1 ~ ~ ~ X ■ ~     1 ~ ~ ~ X O ~ 

solvePerfectRemainingRows applied: (10 cells solved, 1 left)
  0 2 0 2 1 2       0 2 0 2 1 2 
1 ~ X ~ ~ X ■     1 ~ X ~ ~ X O 
2 ~ O ~ O X X     2 ~ O ~ O X X 
1 ~ ~ ~ X ~ O     1 ~ ~ ~ X ~ O 
1 ~ X ~ O ~ ~     1 ~ X ~ O ~ ~ 
1 ~ O ~ ~ ~ ~     1 ~ O ~ ~ ~ ~ 
1 ~ ~ ~ X O ~     1 ~ ~ ~ X O ~ 

solvePerfectRemainingColumns applied: (1 cells solved, 0 left)

  0 2 0 2 1 2       0 2 0 2 1 2 
1 ~ X ~ ~ X O     1 ~ X ~ ~ X O 
2 ~ O ~ O X X     2 ~ O ~ O X X 
1 ~ ~ ~ X ~ O     1 ~ ~ ~ X ~ O 
1 ~ X ~ O ~ ~     1 ~ X ~ O ~ ~ 
1 ~ O ~ ~ ~ ~     1 ~ O ~ ~ ~ ~ 
1 ~ ~ ~ X O ~     1 ~ ~ ~ X O ~ 

```

#### Sad times

The solver works for the first 4 levels defined in this repo, but unfortunately it seems to not handle every possible scenario, as it fails to solve the 5th puzzle. [I need to fix that](https://github.com/Frezzle/tents-and-trees-solver/issues/1).
