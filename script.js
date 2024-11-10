import { initializeKeyboardEvents } from './script/useKeyboard/useKeyboard.js';
import { drawTerrain, setCanvasSize } from './script/useCanvas/useCanvas.js';
import { runGameLoop } from './script/useGameLoop/useGameLoop.js';
import { initializeMouseEvents } from './script/useMouse/useMouse.js';

setCanvasSize();
drawTerrain();

initializeMouseEvents();
initializeKeyboardEvents();
window.addEventListener('resize', setCanvasSize);

runGameLoop();
