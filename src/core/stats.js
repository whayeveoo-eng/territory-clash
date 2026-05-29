import { MATCH } from '../data/constants.js';

// Rhythm stats driven entirely by the event bus, so the main loop stays clean.
export function createStats(bus) {
  let s = blank();

  function blank() {
    return {
      frames: 0,
      bulletsFired: [0, 0],
      cellsConverted: [0, 0],
      cannonHitsDealt: [0, 0], // indexed by attacking team
      cannonFirstHitFrame: null,
      cannonsDestroyed: [0, 0], // indexed by the team that lost the cannon
      territoryShareSamples: [],
      winner: null,
      reason: null,
      draws: 0,
      durationSeconds: 0,
    };
  }

  bus.on('matchStarted', () => {
    s = blank();
  });

  bus.on('bulletFired', ({ team }) => {
    s.bulletsFired[team]++;
  });

  bus.on('cellConverted', ({ team }) => {
    s.cellsConverted[team]++;
  });

  bus.on('cannonHit', ({ cannon, frame }) => {
    const attacker = cannon.team === 0 ? 1 : 0;
    s.cannonHitsDealt[attacker]++;
    if (s.cannonFirstHitFrame === null) s.cannonFirstHitFrame = frame ?? null;
  });

  bus.on('cannonDestroyed', ({ cannon }) => {
    s.cannonsDestroyed[cannon.team]++;
  });

  bus.on('territorySample', ({ frame, top, bottom }) => {
    s.territoryShareSamples.push({ frame, top, bottom });
  });

  bus.on('matchEnded', ({ winner, frame, reason }) => {
    s.frames = frame;
    s.winner = winner;
    s.reason = reason;
    s.durationSeconds = +(frame / MATCH.fps).toFixed(2);
    if (winner === null) s.draws = 1;
  });

  return { get: () => s };
}
