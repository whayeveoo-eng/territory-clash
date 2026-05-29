import { GRID } from '../data/constants.js';

// Territory grid. Each cell stores an owner team index (0 = top, 1 = bottom).
// Origin is top-left; y grows downward. Top team owns the upper half at start.
export function createGrid() {
  const { cols, rows, cellSize } = GRID;
  const cells = new Uint8Array(cols * rows);
  const counts = [0, 0];

  function reset() {
    const half = Math.floor(rows / 2);
    counts[0] = 0;
    counts[1] = 0;
    for (let r = 0; r < rows; r++) {
      const owner = r < half ? 0 : 1;
      for (let c = 0; c < cols; c++) {
        cells[r * cols + c] = owner;
      }
      counts[owner] += cols;
    }
  }

  function inBounds(col, row) {
    return col >= 0 && col < cols && row >= 0 && row < rows;
  }

  function ownerAt(col, row) {
    if (!inBounds(col, row)) return -1;
    return cells[row * cols + col];
  }

  function colRowAt(x, y) {
    return {
      col: Math.floor(x / cellSize),
      row: Math.floor(y / cellSize),
    };
  }

  // Convert the cell to `team`. Returns true if ownership actually changed.
  function convert(col, row, team) {
    if (!inBounds(col, row)) return false;
    const idx = row * cols + col;
    const prev = cells[idx];
    if (prev === team) return false;
    cells[idx] = team;
    counts[prev]--;
    counts[team]++;
    return true;
  }

  function countByTeam() {
    return [counts[0], counts[1]];
  }

  function share(team) {
    const total = cols * rows;
    return counts[team] / total;
  }

  reset();

  return {
    cols,
    rows,
    cellSize,
    cells,
    reset,
    inBounds,
    ownerAt,
    colRowAt,
    convert,
    countByTeam,
    share,
  };
}
