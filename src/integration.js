// Integration layer between new modular system and existing game
import { gameState } from './state/gameState.js';
import { spawnIfNeeded, spawnOne } from './logic/spawn.js';
import { update } from './logic/update.js';
import { renderFrame } from './render/renderFrame.js';
import { onUserPitch } from './input/handleHit.js';
import { initMIDI, panic } from './input/midi.js';
import { CLEF_ANCHORS, CLEF_HIT_X, speedFor, MODES } from './config/gameSettings.js';

// Export all the new modular components for use by existing game
window.StaveBetaPhase1 = {
  gameState,
  spawnIfNeeded,
  spawnOne,
  update,
  renderFrame,
  onUserPitch,
  initMIDI,
  panic,
  CLEF_ANCHORS,
  CLEF_HIT_X,
  speedFor,
  MODES
};

// Sync Phase 1 gameState with existing game state
function syncGameState() {
  if (window.level !== undefined) {
    gameState.level = window.level;
  }
  if (window.gameStartTime !== undefined) {
    gameState.elapsedInLevelSec = (Date.now() - window.gameStartTime) / 1000;
  }
  
  // Sync active notes from existing movingNotes array
  gameState.active.treble = null;
  gameState.active.bass = null;
  
  if (window.movingNotes && window.movingNotes.length > 0) {
    // In Phase 1, we track only the leftmost (oldest) note per clef
    const trebleNotes = window.movingNotes.filter(n => n.clef === 'treble' || (!n.clef && window.currentClef === 'treble'));
    const bassNotes = window.movingNotes.filter(n => n.clef === 'bass' || (!n.clef && window.currentClef === 'bass'));
    
    if (trebleNotes.length > 0) {
      const leftmost = trebleNotes.reduce((left, note) => note.x < left.x ? note : left);
      gameState.active.treble = {
        id: leftmost.id || Date.now(),
        pitch: leftmost.scientific || `${leftmost.note}${leftmost.octave}`,
        x: leftmost.x,
        y: leftmost.y || gameState.clefY.treble,
        speedPxSec: (leftmost.speed || 1) * 120, // convert to px/sec
        width: 32,
        height: 24,
        spawnedAt: leftmost.spawnedAt || Date.now(),
        clef: 'treble'
      };
    }
    
    if (bassNotes.length > 0) {
      const leftmost = bassNotes.reduce((left, note) => note.x < left.x ? note : left);
      gameState.active.bass = {
        id: leftmost.id || Date.now(),
        pitch: leftmost.scientific || `${leftmost.note}${leftmost.octave}`,
        x: leftmost.x,
        y: leftmost.y || gameState.clefY.bass,
        speedPxSec: (leftmost.speed || 1) * 120, // convert to px/sec
        width: 32,
        height: 24,
        spawnedAt: leftmost.spawnedAt || Date.now(),
        clef: 'bass'
      };
    }
  }
  
  // Set mode based on piano mode state
  if (window.pianoModeActive) {
    gameState.mode = 'piano';
  } else {
    gameState.mode = 'normal';
  }
}

// Initialize the new system when this module loads
export async function initializePhase1() {
  console.log('Initializing StaveBeta Phase 1 system...');
  
  // Connect to existing game state
  gameState.canvasWidth = window.canvas ? window.canvas.width : 1024;
  
  // Set up note providers that integrate with existing note system
  gameState.nextTreble = () => {
    // Use existing note picking logic
    const noteData = window.pickRandomNote ? window.pickRandomNote() : { note: 'F', octave: 4, scientific: 'F4' };
    return {
      id: crypto.randomUUID(),
      pitch: noteData.scientific || `${noteData.note}${noteData.octave}`,
      y: gameState.clefY.treble
    };
  };
  
  gameState.nextBass = () => {
    // Use existing note picking logic  
    const noteData = window.pickRandomNote ? window.pickRandomNote() : { note: 'A', octave: 2, scientific: 'A2' };
    return {
      id: crypto.randomUUID(),
      pitch: noteData.scientific || `${noteData.note}${noteData.octave}`,
      y: gameState.clefY.bass
    };
  };
  
  // Connect callbacks to existing game functions
  gameState.onScore = (delta) => {
    if (window.score !== undefined) {
      window.score += delta;
      console.log('Score increased by', delta, 'New score:', window.score);
    }
  };
  
  gameState.onMiss = () => {
    if (window.lives !== undefined) {
      window.lives -= 1;
      console.log('Life lost. Lives remaining:', window.lives);
      if (window.lives <= 0 && typeof window.gameOver === 'function') {
        window.gameOver();
      }
    }
  };
  
  // Initialize MIDI with existing note input handler
  if (typeof window.handleNoteInputWithOctave === 'function') {
    await initMIDI((midiNoteNumber) => {
      // Convert MIDI note to pitch for existing handler
      onUserPitch(midiNoteNumber);
    });
  }
  
  // Sync game state periodically
  setInterval(syncGameState, 100); // sync every 100ms
  
  console.log('Phase 1 initialization complete');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePhase1);
} else {
  initializePhase1();
}