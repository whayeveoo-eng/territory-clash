import { BULLET } from '../data/constants.js';
import { TEAMS } from '../data/teams.js';

export function drawBullets(ctx, match) {
  ctx.save();
  ctx.shadowBlur = 14;
  for (const b of match.bullets) {
    if (!b.alive) continue;
    const team = TEAMS[b.team];

    // short trail opposite to velocity
    ctx.strokeStyle = team.bulletColor;
    ctx.shadowColor = team.bulletColor;
    ctx.lineWidth = BULLET.radius * 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - b.vx * 1.6, b.y - b.vy * 1.6);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(b.x, b.y, BULLET.radius * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
