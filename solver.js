"use strict";

let levels = [
    {
        // 2x1 a
        columns: [0,1],
        rows: [1],
        islands: [0],
        pirates: [1]
    },
    {
        // 2x1 b
        columns: [1,0],
        rows: [1],
        islands: [1],
        pirates: [0]
    },
    {
        // 5x5 a1
        columns: [2,0,1,1,1],
        rows: [1,1,0,2,1],
        islands: [6,8,15,16,24],
        pirates: [3,5,17,19,20]
    },
    {
        // 6x6 a1
        columns: [0,2,0,2,1,2],
        rows: [1,2,1,1,1,1],
        islands: [1,4,10,11,15,19,33],
        pirates: [5,7,9,17,21,25,34]
    },
    {
        // 7x7 a1
        columns: [2,1,0,2,1,2,1],
        rows: [2,1,2,1,0,2,1],
        islands: [5,9,12,13,14,16,33,42,44],
        pirates: [4,6,8,17,19,21,35,40,45]
    },
    {
        // 8x8 b19
        columns: [2,1,1,3,1,1,1,3],
        rows: [1,1,3,1,1,2,1,3],
        islands: [7,8,10,13,25,28,31,46,50,51,52,55,56],
        pirates: [6,11,16,21,23,27,33,43,47,48,58,60,63]
    }
]

let none = null;
let unknown = '■';
let sea = '~';
let island = 'X';
let pirate = 'O';

function newBoard(level) {
    let board = {
        cells: Array(level.columns.length).fill(unknown).map(x => Array(level.rows.length).fill(unknown)),
        setxy: function(x, y, val) {
            this.cells[x][y] = val;
            
            if (val === pirate) {
                this.setSeaSurroundingPirate(x, y);
            }
        },
        seti: function(i, val) {
            let x = Math.floor(i / level.rows.length),
                y = i % level.columns.length;
            this.cells[x][y] = val;
            
            if (val === pirate) {
                this.setSeaSurroundingPirate(x, y);
            }
        },
        setSeaSurroundingPirate: function(x, y) {
            let surroundingCells = [
                [x - 1, y - 1],
                [x - 1, y],
                [x - 1, y + 1],
                [x, y - 1],
                [x, y + 1],
                [x + 1, y - 1],
                [x + 1, y],
                [x + 1, y + 1],
            ];
            let errorThatShouldNotHappen = false;
            surroundingCells.forEach(([xx, yy]) => {
                if (yy < 0 || yy >= this.cells.length || xx < 0 || xx >= this.cells[yy].length) {
                    return;
                }
                if (this.cells[xx][yy] === pirate) {
                    // there is already a pirate surronding this one, therefore alg has failed
                    errorThatShouldNotHappen = true;
                } else if (this.cells[xx][yy] !== island) {
                    this.cells[xx][yy] = sea;
                }
                if (errorThatShouldNotHappen) {
                    throw `error: pirate placed at (${xx},${yy}) surrounding existing pirate!`
                }
            });
        },
        getNeighbour: function(x, y, direction) {
            if (x < 0 || x >= this.cells[x].length || y < 0 || y >= this.cells.length) {
                return none
            }

            try {
                switch (direction) {
                    case 'left':
                        return this.cells[x - 1][y];
                    case 'right':
                        return this.cells[x + 1][y];
                    case 'above':
                        return this.cells[x][y - 1];
                    case 'below':
                        return this.cells[x][y + 1];
                }
            } catch (err) { // probably tried to get neighbour of edge cell
                return none;
            }

            return none;
        },
        getUnknownCount: function() {
            let count = 0;
            this.cells.forEach(row => {
                row.forEach(cell => {
                    if (cell === unknown) {
                        count++;
                    }
                });
            });
            return count;
        }
    };

    level.islands.forEach(i => {
        board.seti(i, island);
    });

    return board;
}

function applySolver(level, board, solver) {
    let unknownsBefore = board.getUnknownCount();
    solver(board, level);
    let unknownsAfter = board.getUnknownCount();
    let solved = unknownsBefore - unknownsAfter;
    console.log(`${solver.name} applied: (${solved} cells solved, ${unknownsAfter} left)`);
    console.log(getBoardAndLevelConsoleDisplay(board, level));
}

function solve(level) {
    let board = newBoard(level);
    
    console.log(`initial: (${board.getUnknownCount()} unknowns)`)
    console.log(getBoardAndLevelConsoleDisplay(board, level));

    applySolver(level, board, solveZeroes);
    applySolver(level, board, solveOpenSeas);
    applySolver(level, board, solvePerfectRemainingRows);
    applySolver(level, board, solvePerfectRemainingColumns);
}

function getBoardAndLevelConsoleDisplay(board, level) {
    let boardString = getBoardConsoleDisplay(board, level);
    let levelString = getLevelConsoleDisplay(level);

    let boardSplit = boardString.split('\n').filter(s => s !== '');
    let levelSplit = levelString.split('\n').filter(s => s !== '');

    let str = '';
    for (let i = 0; i < boardSplit.length; i++) {
        str += boardSplit[i] + '   ' + levelSplit[i] + '\n';
    }

    return str;
}

function getBoardConsoleDisplay(board, level) {
    let str = '  ';
    level.columns.forEach(col => {
        str += col + ' ';
    });
    str += '\n';
    let i = 0;
    board.cells.forEach(row => {
        str += level.rows[i++] + ' ';
        row.forEach(cell => {
            str += cell + ' ';
        })
        str += '\n';
    });
    return str;
}

function getLevelConsoleDisplay(level) {
    let str = '  ';
    level.columns.forEach(col => {
        str += col + ' ';
    });

    try {
        let islandIndex = 0;
        let pirateIndex = 0;
        let rowIndex = 0;
        for (let i = 0; i < level.columns.length * level.rows.length; i++) {
            if (i % level.columns.length === 0) {
                str += '\n' + level.rows[rowIndex++] + ' ';
            }
            if (pirateIndex < level.pirates.length && level.pirates[pirateIndex] === i) {
                str += pirate + ' ';
                pirateIndex++;
            } else if (islandIndex < level.islands.length && level.islands[islandIndex] === i) {
                str += island + ' ';
                islandIndex++;
            } else {
                str += sea + ' ';
            }
        }
    } catch (err) {}
    
    return str;
}

function solveZeroes(board, level) {
    level.rows.forEach((row, i) => {
        if (row === 0) {
            for (let x = 0; x < level.columns.length; x++) {
                if (board.cells[i][x] !== island)
                board.setxy(i, x, sea);
            }
        }
    });

    level.columns.forEach((col, i) => {
        if (col === 0) {
            for (let y = 0; y < level.rows.length; y++) {
                if (board.cells[y][i] !== island)
                board.setxy(y, i, sea);
            }
        }
    });
}

function solveOpenSeas(board, level) {
    for (let y = 0; y < board.cells.length; y++) {
        for (let x = 0; x < board.cells[y].length; x++) {
            if (board.cells[x][y] !== unknown) {
                continue;
            }
            let left = board.getNeighbour(x, y, 'left'),
                right = board.getNeighbour(x, y, 'right'),
                above = board.getNeighbour(x, y, 'above'),
                below = board.getNeighbour(x, y, 'below');
            if (left !== island && right !== island && above !== island && below !== island) {
                board.cells[x][y] = sea;
            }
        }
    }
}

function solvePerfectRemainingRows(board, level) {
    level.rows.forEach((row, rowIndex) => {
        let unknownCount = 0;
        let pirateCount = 0;
        board.cells[rowIndex].forEach(cell => {
            if (cell === unknown) {
                unknownCount++;
            } else if (cell === pirate) {
                pirateCount++;
            }
        });
        if (row === unknownCount + pirateCount) {
            board.cells[rowIndex].forEach((cell, columnIndex) => {
                if (cell === unknown) {
                    board.setxy(rowIndex, columnIndex, pirate);
                }
            });
        } else if (row === pirateCount && unknownCount > 0) {
            board.cells[rowIndex].forEach((cell, columnIndex) => {
                if (cell === unknown) {
                    board.setxy(rowIndex, columnIndex, sea);
                }
            });
        }
    });
}

function solvePerfectRemainingColumns(board, level) {
    level.columns.forEach((column, columnIndex) => {
        let unknownCount = 0;
        let pirateCount = 0;
        level.rows.forEach((row, rowIndex) => {
            if (board.cells[rowIndex][columnIndex] === unknown) {
                unknownCount++;
            } else if (board.cells[rowIndex][columnIndex] === pirate) {
                pirateCount++;
            }
        });
        if (column === unknownCount + pirateCount) {
            level.rows.forEach((row, rowIndex) => {
                if (board.cells[rowIndex][columnIndex] === unknown) {
                    board.setxy(rowIndex, columnIndex, pirate);
                }
            });
        } else if (column === pirateCount && unknownCount > 0) {
            level.rows.forEach((row, rowIndex) => {
                if (board.cells[rowIndex][columnIndex] === unknown) {
                    board.setxy(rowIndex, columnIndex, sea);
                }
            });
        }
    });
}

solve(levels[4]);
