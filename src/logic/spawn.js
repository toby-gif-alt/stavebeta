import { CLEF_ANCHORS, speedFor } from '../config/gameSettings.js';
import { gameState } from '../state/gameState.js';

export function spawnIfNeeded() {
  const { mode, active } = gameState;
  if (mode === 'piano') {
    if (!active.treble) spawnOne('treble');
    if (!active.bass)   spawnOne('bass');
  } else {
    if (!active.treble && !active.bass) spawnOne('treble'); // default treble
  }
}

export function spawnOne(clef) {
  const src = clef === 'treble' ? gameState.nextTreble : gameState.nextBass;
  if (!src) return;
  const note = src(); // { id, pitch, y }
  const speedPxSec = speedFor(gameState.level, gameState.elapsedInLevelSec);

  gameState.active[clef] = {
    ...note,
    clef,
    x: CLEF_ANCHORS[clef].rightX, // spawn at right edge of the clef
    y: note.y,
    speedPxSec,
    width: 32,
    height: 24,
    spawnedAt: performance.now(),
  };
}