const levels = [
  {
    // 2x1 a
    columns: [0, 1],
    rows: [1],
    islands: [0],
    pirates: [1],
  },
  {
    // 2x1 b
    columns: [1, 0],
    rows: [1],
    islands: [1],
    pirates: [0],
  },
  {
    // 5x5 a1
    columns: [2, 0, 1, 1, 1],
    rows: [1, 1, 0, 2, 1],
    islands: [6, 8, 15, 16, 24],
    pirates: [3, 5, 17, 19, 20],
  },
  {
    // 6x6 a1
    columns: [0, 2, 0, 2, 1, 2],
    rows: [1, 2, 1, 1, 1, 1],
    islands: [1, 4, 10, 11, 15, 19, 33],
    pirates: [5, 7, 9, 17, 21, 25, 34],
  },
  {
    // 7x7 a1
    columns: [2, 1, 0, 2, 1, 2, 1],
    rows: [2, 1, 2, 1, 0, 2, 1],
    islands: [5, 9, 12, 13, 14, 16, 33, 42, 44],
    pirates: [4, 6, 8, 17, 19, 21, 35, 40, 45],
  },
  {
    // 8x8 b19
    columns: [2, 1, 1, 3, 1, 1, 1, 3],
    rows: [1, 1, 3, 1, 1, 2, 1, 3],
    islands: [7, 8, 10, 13, 25, 28, 31, 46, 50, 51, 52, 55, 56],
    pirates: [6, 11, 16, 21, 23, 27, 33, 43, 47, 48, 58, 60, 63],
  },
];

const none = null;
const unknown = '■';
const sea = '~';
const island = 'X';
const pirate = 'O';

function newBoard(level) {
  const board = {
    cells: Array(level.columns.length).fill(unknown)
      .map(() => Array(level.rows.length).fill(unknown)),
    setxy(x, y, val) {
      this.cells[x][y] = val;

      if (val === pirate) {
        this.setSeaSurroundingPirate(x, y);
      }
    },
    seti(i, val) {
      const x = Math.floor(i / level.rows.length);
      const y = i % level.columns.length;
      this.cells[x][y] = val;

      if (val === pirate) {
        this.setSeaSurroundingPirate(x, y);
      }
    },
    setSeaSurroundingPirate(x, y) {
      const surroundingCells = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1],
      ];
      let errorThatShouldNotHappenIfSolversAreCorrect = false;
      surroundingCells.forEach(([xx, yy]) => {
        if (yy < 0 || yy >= this.cells.length || xx < 0 || xx >= this.cells[yy].length) {
          return;
        }
        if (this.cells[xx][yy] === pirate) {
          errorThatShouldNotHappenIfSolversAreCorrect = true;
        } else if (this.cells[xx][yy] !== island) {
          this.cells[xx][yy] = sea;
        }
        if (errorThatShouldNotHappenIfSolversAreCorrect) {
          throw Error(`pirate placed at (${xx},${yy}) surrounding existing pirate!`);
        }
      });
    },
    getNeighbour(x, y, direction) {
      if (x < 0 || x >= this.cells[x].length || y < 0 || y >= this.cells.length) {
        return none;
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
          default:
            return none;
        }
      } catch (e) { // probably tried to get neighbour of edge cell
        return none;
      }
    },
    getUnknownCount() {
      let count = 0;
      this.cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell === unknown) {
            count += 1;
          }
        });
      });
      return count;
    },
  };

  level.islands.forEach((i) => {
    board.seti(i, island);
  });

  return board;
}

function getBoardConsoleDisplay(board, level) {
  let str = '  ';
  level.columns.forEach((col) => {
    str += `${col} `;
  });
  str += '\n';
  let i = 0;
  board.cells.forEach((row) => {
    str += `${level.rows[i]} `;
    i += 1;
    row.forEach((cell) => {
      str += `${cell} `;
    });
    str += '\n';
  });
  return str;
}

function getLevelConsoleDisplay(level) {
  let str = '  ';
  level.columns.forEach((col) => {
    str += `${col} `;
  });

  try {
    let islandIndex = 0;
    let pirateIndex = 0;
    let rowIndex = 0;
    for (let i = 0; i < level.columns.length * level.rows.length; i += 1) {
      if (i % level.columns.length === 0) {
        str += `\n ${level.rows[rowIndex]} `;
        rowIndex += 1;
      }
      if (pirateIndex < level.pirates.length && level.pirates[pirateIndex] === i) {
        str += `${pirate} `;
        pirateIndex += 1;
      } else if (islandIndex < level.islands.length && level.islands[islandIndex] === i) {
        str += `${island} `;
        islandIndex += 1;
      } else {
        str += `${sea} `;
      }
    }
  } catch (e) {
    // ignore error so that we can spot how far the concatenation went before failing
  }

  return str;
}

function getBoardAndLevelConsoleDisplay(board, level) {
  const boardString = getBoardConsoleDisplay(board, level);
  const levelString = getLevelConsoleDisplay(level);
  const boardSplit = boardString.split('\n').filter(s => s !== '');
  const levelSplit = levelString.split('\n').filter(s => s !== '');
  let str = '';
  for (let i = 0; i < boardSplit.length; i += 1) {
    str += `${boardSplit[i]}   ${levelSplit[i]}\n`;
  }
  return str;
}

function applySolver(level, board, solver) {
  const unknownsBefore = board.getUnknownCount();
  solver(board, level);
  const unknownsAfter = board.getUnknownCount();
  const solved = unknownsBefore - unknownsAfter;
  console.log(`${solver.name} applied: (${solved} cells solved, ${unknownsAfter} left)`);
  console.log(getBoardAndLevelConsoleDisplay(board, level));
}

function solveZeroes(board, level) {
  level.rows.forEach((row, i) => {
    if (row === 0) {
      for (let x = 0; x < level.columns.length; x += 1) {
        if (board.cells[i][x] !== island) {
          board.setxy(i, x, sea);
        }
      }
    }
  });

  level.columns.forEach((col, i) => {
    if (col === 0) {
      for (let y = 0; y < level.rows.length; y += 1) {
        if (board.cells[y][i] !== island) {
          board.setxy(y, i, sea);
        }
      }
    }
  });
}

function solveOpenSeas(board) {
  const b = board;
  for (let y = 0; y < b.cells.length; y += 1) {
    for (let x = 0; x < b.cells[y].length; x += 1) {
      if (b.cells[x][y] === unknown) {
        const left = b.getNeighbour(x, y, 'left');
        const right = b.getNeighbour(x, y, 'right');
        const above = b.getNeighbour(x, y, 'above');
        const below = b.getNeighbour(x, y, 'below');
        if (left !== island && right !== island && above !== island && below !== island) {
          b.cells[x][y] = sea;
        }
      }
    }
  }
}

function solvePerfectRemainingRows(board, level) {
  level.rows.forEach((row, rowIndex) => {
    let unknownCount = 0;
    let pirateCount = 0;
    board.cells[rowIndex].forEach((cell) => {
      if (cell === unknown) {
        unknownCount += 1;
      } else if (cell === pirate) {
        pirateCount += 1;
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
        unknownCount += 1;
      } else if (board.cells[rowIndex][columnIndex] === pirate) {
        pirateCount += 1;
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

function solve(level) {
  const board = newBoard(level);

  console.log(`initial: (${board.getUnknownCount()} unknowns)`);
  console.log(getBoardAndLevelConsoleDisplay(board, level));

  try {
    applySolver(level, board, solveZeroes);
    applySolver(level, board, solveOpenSeas);
    applySolver(level, board, solvePerfectRemainingRows);
    applySolver(level, board, solvePerfectRemainingColumns);
  } catch (e) {
    console.log(e);
  }
}

solve(levels[3]);
