import { gameState } from './state/gameState.js';
import { spawnIfNeeded } from './logic/spawn.js';
import { update } from './logic/update.js';
import { renderFrame } from './render/renderFrame.js';
import { onUserPitch } from './input/handleHit.js';
import { initMIDI } from './input/midi.js';

let last = performance.now();

async function boot() {
  // Initialize providers for nextTreble / nextBass before starting loop.
  // They must return { id, pitch, y } with y aligned to the clef staff.
  // Example placeholders:
  gameState.nextTreble = () => ({ id: crypto.randomUUID(), pitch: 'F4', y: 140 });
  gameState.nextBass   = () => ({ id: crypto.randomUUID(), pitch: 'A2', y: 260 });

  gameState.mode = 'normal'; // set to 'piano' to enable dual-rail
  gameState.onScore = (d)=>{/* increment score */};
  gameState.onMiss  = ()=>{/* decrement lives, feedback */};

  await initMIDI(onUserPitch);

  spawnIfNeeded();
  requestAnimationFrame(tick);
}

function tick(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  gameState.elapsedInLevelSec += dt;

  update(dt);
  renderFrame(window.__ctx, window.__sprites);

  requestAnimationFrame(tick);
}

boot();