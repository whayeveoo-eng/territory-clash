// team index used in the grid: 0 = top, 1 = bottom.
// top/bottom only encode spawn side; color only encodes visual identity.
export const TEAMS = [
  {
    id: 'top',
    index: 0,
    side: 'top',
    displayName: '金方',
    fillColor: '#f5a623',
    glowColor: '#ffd36b',
    bulletColor: '#ffe08a',
    fireDir: 1, // bullets travel down (+y)
  },
  {
    id: 'bottom',
    index: 1,
    side: 'bottom',
    displayName: '蓝方',
    fillColor: '#1f7cff',
    glowColor: '#5bd6ff',
    bulletColor: '#8ee8ff',
    fireDir: -1, // bullets travel up (-y)
  },
];

export const TOP = TEAMS[0];
export const BOTTOM = TEAMS[1];

export function teamByIndex(index) {
  return TEAMS[index];
}

export function enemyIndex(index) {
  return index === 0 ? 1 : 0;
}
