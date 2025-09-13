import { gameState } from '../state/gameState.js';

export function renderFrame(ctx, sprites) {
  // draw staves/clefs as before...
  // draw notes
  const { active } = gameState;
  if (active.treble) drawNote(ctx, sprites.note, active.treble);
  if (active.bass)   drawNote(ctx, sprites.note, active.bass);
}

export function drawNote(ctx, sprite, n) {
  const x = Math.round(n.x - n.width / 2);
  const y = Math.round(n.y - n.height / 2);
  ctx.drawImage(sprite, x, y);
}