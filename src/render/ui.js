import { ARENA } from '../data/constants.js';
import { TEAMS } from '../data/teams.js';

const WIN_TEXT = {
  cannonsDestroyed: '摧毁全部炮台',
  timeoutTerritory: '超时·领地占优',
  timeoutDraw: '超时·平局',
  mutualDestruction: '同归于尽',
};

// In-canvas HUD: territory share bar + end-of-match veil.
// Start / restart buttons are DOM elements wired in main.js.
export function drawHud(ctx, match) {
  drawTerritoryBar(ctx, match);
  if (match.phase === 'ended') drawEndVeil(ctx, match);
}

function drawTerritoryBar(ctx, match) {
  const topShare = match.grid.share(0);
  const h = 16;
  const split = ARENA.width * topShare;

  ctx.save();
  ctx.fillStyle = TEAMS[0].fillColor;
  ctx.fillRect(0, 0, split, h);
  ctx.fillStyle = TEAMS[1].fillColor;
  ctx.fillRect(split, 0, ARENA.width - split, h);

  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(split, 0);
  ctx.lineTo(split, h);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.font = '600 22px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(`${Math.round(topShare * 100)}%`, 10, h + 6);
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round((1 - topShare) * 100)}%`, ARENA.width - 10, h + 6);
  ctx.restore();
}

function drawEndVeil(ctx, match) {
  ctx.save();
  ctx.fillStyle = 'rgba(2,4,10,0.6)';
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);

  const cx = ARENA.width / 2;
  const cy = ARENA.height / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let title;
  let color = '#ffffff';
  if (match.winner === null) {
    title = '平局';
  } else {
    const team = TEAMS[match.winner];
    title = `${team.displayName}胜利`;
    color = team.glowColor;
  }

  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.fillStyle = color;
  ctx.font = '800 88px system-ui, sans-serif';
  ctx.fillText(title, cx, cy - 30);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#cfd6e6';
  ctx.font = '500 30px system-ui, sans-serif';
  ctx.fillText(WIN_TEXT[match.reason] || '', cx, cy + 50);
  ctx.restore();
}
