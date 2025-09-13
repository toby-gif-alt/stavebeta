/**
 * Convert pitch string to MIDI note number
 * Required by handleHit.js per implementation requirements
 */
export function noteNumberForPitch(pitch) {
  // Parse scientific notation like "C4", "F#5", "Bb3"
  const match = pitch.match(/^([A-G])([b#]?)(\d+)$/);
  if (!match) return null;
  
  const [, note, accidental, octave] = match;
  const octaveNum = parseInt(octave);
  
  // Note values for C major scale (C=0, D=2, E=4, F=5, G=7, A=9, B=11)
  const noteValues = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
  let noteValue = noteValues[note];
  
  // Apply accidentals
  if (accidental === '#') noteValue += 1;
  else if (accidental === 'b') noteValue -= 1;
  
  // Convert to MIDI note number (C4 = 60)
  return (octaveNum + 1) * 12 + noteValue;
}