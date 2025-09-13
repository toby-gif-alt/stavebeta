let midi, inputRefs = new Set(), noteQueue = [];
let rafScheduled = false;

export async function initMIDI(onPitch) {
  if (!navigator.requestMIDIAccess) return;
  midi = await navigator.requestMIDIAccess({ sysex: false });
  attachInputs(onPitch);

  window.addEventListener('blur', panic);
  window.addEventListener('focus', () => setTimeout(() => attachInputs(onPitch), 0));
  midi.onstatechange = () => attachInputs(onPitch);
}

function attachInputs(onPitch) {
  inputRefs.forEach(inp => (inp.onmidimessage = null));
  inputRefs.clear();

  for (const input of midi.inputs.values()) {
    input.onmidimessage = (e) => {
      const [status, note, vel] = e.data;
      const type = status & 0xf0;
      if (type === 0x90 && vel > 0) {
        noteQueue.push(note);
        scheduleFlush(onPitch);
      } else if (type === 0x80 || (type === 0x90 && vel === 0)) {
        // ignore note off
      } else if (status === 0xB0 && note === 123) {
        // All Notes Off
        noteQueue.length = 0;
      }
    };
    inputRefs.add(input);
  }
}

function scheduleFlush(onPitch) {
  if (rafScheduled) return;
  rafScheduled = true;
  requestAnimationFrame(() => {
    rafScheduled = false;
    const take = noteQueue.splice(0, 8); // bounded flush
    for (const n of take) onPitch(n);
  });
}

export function panic() {
  noteQueue.length = 0;
  inputRefs.forEach(inp => (inp.onmidimessage = null));
  inputRefs.clear();
}