import { TEAMS } from '../data/teams.js';

export function drawCannons(ctx, match) {
  for (const cannon of match.cannons) {
    const team = TEAMS[cannon.team];
    const dir = team.fireDir;
    ctx.save();

    if (!cannon.alive) {
      // wreck: dim ring only
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = team.fillColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cannon.x, cannon.y, cannon.radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    const hpRatio = cannon.hp / cannon.maxHp;

    // muzzle stem toward the enemy side (echoes the reference art)
    ctx.strokeStyle = team.glowColor;
    ctx.shadowColor = team.glowColor;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cannon.x, cannon.y);
    ctx.lineTo(cannon.x, cannon.y + dir * (cannon.radius + 14));
    ctx.stroke();

    // glowing core
    ctx.shadowBlur = 22;
    ctx.fillStyle = team.fillColor;
    ctx.beginPath();
    ctx.arc(cannon.x, cannon.y, cannon.radius, 0, Math.PI * 2);
    ctx.fill();

    // inner bright disc, dims as HP drops
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.4 + 0.6 * hpRatio;
    ctx.fillStyle = team.glowColor;
    ctx.beginPath();
    ctx.arc(cannon.x, cannon.y, cannon.radius * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // HP arc ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cannon.x, cannon.y, cannon.radius + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpRatio);
    ctx.stroke();

    ctx.restore();
  }
}
