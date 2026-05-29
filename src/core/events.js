// Minimal synchronous event bus shared by stats, render effects and future systems.
export function createEventBus() {
  const listeners = new Map();

  function on(type, fn) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(fn);
    return () => off(type, fn);
  }

  function off(type, fn) {
    const set = listeners.get(type);
    if (set) set.delete(fn);
  }

  function emit(type, payload) {
    const set = listeners.get(type);
    if (!set) return;
    for (const fn of set) fn(payload);
  }

  return { on, off, emit };
}
