import { MATCH } from '../data/constants.js';

// Fixed logic step decoupled from rendering. Supports pause/resume and
// deterministic single-stepping for rhythm tests.
export function createLoop({ update, render }) {
  const stepMs = 1000 / MATCH.fps;
  let running = false;
  let acc = 0;
  let last = 0;
  let rafId = null;

  function frame(now) {
    if (!running) return;
    acc += now - last;
    last = now;
    // clamp to avoid spiral-of-death after a tab stall
    if (acc > stepMs * 6) acc = stepMs * 6;
    while (acc >= stepMs) {
      update();
      acc -= stepMs;
    }
    render();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    acc = 0;
    rafId = requestAnimationFrame(frame);
  }

  function pause() {
    running = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  // advance logic by N frames without waiting on rAF (used by tests)
  function step(frames = 1) {
    for (let i = 0; i < frames; i++) update();
    render();
  }

  return { start, pause, step, isRunning: () => running };
}
