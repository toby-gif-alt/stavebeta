export const CLEF_ANCHORS = {
  treble: { rightX: 420 }, // adjust per artwork
  bass:   { rightX: 420 },
};

export const CLEF_HIT_X = 180; // when a note "hits" the clef bar

export const STAFF_WARS_SPEED = {
  base: 120,          // px/sec at level 1
  perLevel: 24,       // +px/sec per level
  intraRampCap: 0.15, // +15% max within a level
};

/** Return pixels/sec for the current level and elapsed time-in-level (seconds). */
export function speedFor(level, elapsedInLevelSec) {
  const base = STAFF_WARS_SPEED.base + (level - 1) * STAFF_WARS_SPEED.perLevel;
  const ramp = 1 + Math.min(STAFF_WARS_SPEED.intraRampCap, (elapsedInLevelSec / 60) * STAFF_WARS_SPEED.intraRampCap);
  return base * ramp;
}

export const MODES = {
  normal: 'normal',
  piano:  'piano', // dual-rail, one note per clef
};