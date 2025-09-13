import { CLEF_HIT_X } from '../config/gameSettings.js';
import { gameState } from '../state/gameState.js';
import { spawnIfNeeded } from './spawn.js';

export function update(dtSec) {
  const { active, mode } = gameState;

  // Move left
  ['treble','bass'].forEach((clef) => {
    const n = active[clef];
    if (!n) return;
    n.x -= n.speedPxSec * dtSec;

    // Clef collision => miss
    if (n.x <= CLEF_HIT_X) {
      gameState.active[clef] = null;
      gameState.onMiss();
    }
  });

  // Immediate respawn whenever a slot is free
  if (mode === 'piano') {
    if (!active.treble || !active.bass) spawnIfNeeded();
  } else {
    if (!active.treble && !active.bass) spawnIfNeeded();
  }
}