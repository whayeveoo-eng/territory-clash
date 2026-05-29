export const FEATURE_FLAGS = {
  weaponsEnabled: false,
  playerControlEnabled: false,
  specialCellsEnabled: false,
};

export const ARENA = {
  width: 1080,
  height: 1260,
  background: '#05060a',
};

export const GRID = {
  cols: 24,
  rows: 28,
  cellSize: 45,
  gap: 2,
};

export const CANNON = {
  perSide: 2,
  hp: 22,
  radius: 34,
  // distance of cannon center from its own outer edge (top edge for top team, bottom for bottom)
  edgeOffset: 70,
  fireInterval: 9,
  fireJitter: 6,
  hitDamage: 1,
  // Momentum: the side holding more territory fires faster, so a lead snowballs
  // into a breakthrough instead of the two sides locking at a 50/50 stalemate.
  momentum: { k: 1.6, min: 0.25, max: 2.6 },
};

export const BULLET = {
  speed: 11,
  radius: 7,
  // half-angle of the firing cone aimed at the enemy side, in radians
  spreadHalfAngle: Math.PI / 3,
  maxAlive: 600,
};

export const MATCH = {
  fps: 60,
  timeoutSeconds: 120,
  territorySampleInterval: 60,
};
