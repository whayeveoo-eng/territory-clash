import { ARENA, BULLET, CANNON } from '../data/constants.js';
import { enemyIndex } from '../data/teams.js';
import { damageCannon } from './damage.js';

function spawnBullet(match, cannon, bus) {
  const team = cannon.team;
  const fireDir = match.teams[team].fireDir;
  const spread = (Math.random() * 2 - 1) * BULLET.spreadHalfAngle;
  const vx = BULLET.speed * Math.sin(spread);
  const vy = BULLET.speed * fireDir * Math.cos(spread);
  match.bullets.push({
    team,
    x: cannon.x,
    y: cannon.y + fireDir * (CANNON.radius + BULLET.radius + 1),
    vx,
    vy,
    age: 0,
    alive: true,
  });
  bus.emit('bulletFired', { team, x: cannon.x, y: cannon.y });
}

export function updateCannons(match, bus) {
  const { k, min, max } = CANNON.momentum;
  for (const cannon of match.cannons) {
    if (!cannon.alive) continue;
    cannon.fireCooldown -= 1;
    if (cannon.fireCooldown <= 0) {
      spawnBullet(match, cannon, bus);
      const lead = (match.grid.share(cannon.team) - 0.5) * 2; // -1..1
      const mult = Math.min(max, Math.max(min, 1 - k * lead));
      const base = CANNON.fireInterval + Math.floor(Math.random() * CANNON.fireJitter);
      cannon.fireCooldown = base * mult;
    }
  }
}

export function updateBullets(match, bus) {
  const { grid } = match;
  const bullets = match.bullets;

  for (const b of bullets) {
    if (!b.alive) continue;

    b.x += b.vx;
    b.y += b.vy;
    b.age += 1;

    // side walls bounce, keeps angled shots in play
    if (b.x < BULLET.radius) {
      b.x = BULLET.radius;
      b.vx = -b.vx;
    } else if (b.x > ARENA.width - BULLET.radius) {
      b.x = ARENA.width - BULLET.radius;
      b.vx = -b.vx;
    }

    // top/bottom out of bounds, or too old
    if (b.y < 0 || b.y > ARENA.height || b.age > BULLET.maxAlive) {
      b.alive = false;
      continue;
    }

    // territory cell under the bullet
    const { col, row } = grid.colRowAt(b.x, b.y);
    const owner = grid.ownerAt(col, row);
    if (owner !== -1 && owner !== b.team) {
      // first enemy cell encountered: convert it and stop
      grid.convert(col, row, b.team);
      bus.emit('cellConverted', {
        team: b.team,
        col,
        row,
        x: col * grid.cellSize + grid.cellSize / 2,
        y: row * grid.cellSize + grid.cellSize / 2,
      });
      b.alive = false;
      continue;
    }

    // own-colored cell: passes through; check for an exposed enemy cannon
    const foe = enemyIndex(b.team);
    for (const cannon of match.cannons) {
      if (!cannon.alive || cannon.team !== foe) continue;
      const dx = b.x - cannon.x;
      const dy = b.y - cannon.y;
      const rr = cannon.radius + BULLET.radius;
      if (dx * dx + dy * dy <= rr * rr) {
        damageCannon(cannon, CANNON.hitDamage, bus, match.frame);
        b.alive = false;
        break;
      }
    }
  }

  // compact dead bullets occasionally to keep the array small
  if (bullets.length > 64) {
    match.bullets = bullets.filter((b) => b.alive);
  }
}
