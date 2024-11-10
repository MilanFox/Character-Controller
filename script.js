import { keys } from './script/useKeyboard/useKeyboard.js';
import { drawTerrain, setCanvasSize } from './script/useCanvas/useCanvas.js';
import { runGameLoop } from './script/useGameLoop/useGameLoop.js';
import { findGridPath } from './script/usePathfinding/usePathfinding.js';
import { minion } from './script/useMinion/useMinion.js';
import { player } from './script/usePlayer/usePlayer.js';

document.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

window.addEventListener('resize', setCanvasSize);

setCanvasSize();
drawTerrain();
runGameLoop();

findGridPath([minion, player]);
