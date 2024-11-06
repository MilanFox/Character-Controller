import { useCanvas } from './script/useCanvas/useCanvas.js';
import { useGameLoop } from './script/useGameLoop/useGameLoop.js';
import { keys } from './script/useKeyboard/useKeyboard.js';

const { setCanvasSize, drawTerrain } = useCanvas();
const { runGameLoop } = useGameLoop();

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

