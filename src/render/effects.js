import { TEAMS } from '../data/teams.js';

// Render-only particle layer. Lives off the event bus so it never touches
// simulation state; advancing it per draw keeps tests deterministic.
export function createEffects(bus) {
  let particles = [];

  function spawn(x, y, count, color, opts = {}) {
    const speed = opts.speed ?? 2;
    const size = opts.size ?? 3;
    const life = opts.life ?? 18;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = speed * (0.4 + Math.random() * 0.8);
      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life,
        maxLife: life,
        color,
        size: size * (0.6 + Math.random() * 0.8),
      });
    }
    if (particles.length > 600) particles = particles.slice(-600);
  }

  bus.on('cellConverted', ({ team, x, y }) => {
    spawn(x, y, 2, TEAMS[team].glowColor, { speed: 1.4, size: 2.5, life: 12 });
  });

  bus.on('cannonHit', ({ cannon }) => {
    spawn(cannon.x, cannon.y, 6, '#ffffff', { speed: 3, size: 3, life: 16 });
  });

  bus.on('cannonDestroyed', ({ cannon }) => {
    spawn(cannon.x, cannon.y, 28, TEAMS[cannon.team].glowColor, { speed: 6, size: 5, life: 34 });
  });

  function draw(ctx) {
    ctx.save();
    ctx.shadowBlur = 10;
    const alive = [];
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= 1;
      if (p.life <= 0) continue;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      alive.push(p);
    }
    particles = alive;
    ctx.restore();
  }

  return { draw };
}
