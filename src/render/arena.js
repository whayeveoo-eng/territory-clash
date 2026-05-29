import { ARENA, GRID } from '../data/constants.js';
import { TEAMS } from '../data/teams.js';

const fills = [TEAMS[0].fillColor, TEAMS[1].fillColor];
const glows = [TEAMS[0].glowColor, TEAMS[1].glowColor];

export function drawArena(ctx, match) {
  const { grid } = match;
  const { cols, rows, cellSize } = grid;
  const inset = GRID.gap / 2;
  const size = cellSize - GRID.gap;

  ctx.fillStyle = ARENA.background;
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);

  // territory cells
  const cells = grid.cells;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const owner = cells[r * cols + c];
      ctx.fillStyle = fills[owner];
      ctx.fillRect(c * cellSize + inset, r * cellSize + inset, size, size);
    }
  }

  // frontier: brighten contested cells and stroke the dividing edges as neon
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const owner = cells[idx];
      const x = c * cellSize;
      const y = r * cellSize;

      // right neighbor
      if (c + 1 < cols && cells[idx + 1] !== owner) {
        edge(ctx, x + cellSize, y, x + cellSize, y + cellSize, glows[owner]);
      }
      // bottom neighbor
      if (r + 1 < rows && cells[idx + cols] !== owner) {
        edge(ctx, x, y + cellSize, x + cellSize, y + cellSize, glows[owner]);
      }
    }
  }
  ctx.restore();
}

function edge(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
