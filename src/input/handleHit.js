import { gameState } from '../state/gameState.js';
import { noteNumberForPitch } from './pitchMap.js';

export function onUserPitch(pitchNum) {
  // In piano mode, either clef's note can be destroyed first.
  if (tryHit('treble', pitchNum)) return;
  if (tryHit('bass', pitchNum))   return;
  // No-op on stray input in Phase 1
}

function tryHit(clef, pitchNum) {
  const n = gameState.active[clef];
  if (!n) return false;
  const expected = noteNumberForPitch(n.pitch);
  if (expected === pitchNum) {
    gameState.active[clef] = null;
    gameState.onScore(+1);
    return true;
  }
  return false;
}