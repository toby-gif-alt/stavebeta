export const gameState = {
  mode: 'normal', // 'normal' | 'piano'
  level: 1,
  elapsedInLevelSec: 0,

  // Active notes: one total (normal) OR one per clef (piano)
  active: {
    treble: null, // { id, pitch, x, y, speedPxSec, width, height, spawnedAt }
    bass:   null,
  },

  // Injected suppliers: must return { id, pitch, y }
  nextTreble: null,
  nextBass: null,

  // Canvas/staff layout
  canvasWidth: 1024,
  clefY: { treble: 140, bass: 260 },

  // Callbacks
  onScore: (delta) => {},
  onMiss: () => {},
};