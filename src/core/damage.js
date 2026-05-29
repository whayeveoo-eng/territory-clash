// Cannon health resolution. Bullets are the only damage source in v1.
export function damageCannon(cannon, amount, bus, frame) {
  if (!cannon.alive) return;
  cannon.hp -= amount;
  bus.emit('cannonHit', { cannon, amount, frame });
  if (cannon.hp <= 0) {
    cannon.hp = 0;
    cannon.alive = false;
    bus.emit('cannonDestroyed', { cannon, frame });
  }
}
