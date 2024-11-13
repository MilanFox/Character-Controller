import { initializeKeyboardEvents } from './script/useKeyboard/useKeyboard.js';
import { drawTerrain, resetCanvas } from './script/useCanvas/useCanvas.js';
import { runGameLoop } from './script/useGameLoop/useGameLoop.js';
import { initializeMouseEvents } from './script/useMouse/useMouse.js';
import { buildDebugMenu } from './script/useDebugging/useDebugging.js';

resetCanvas();
drawTerrain();

initializeMouseEvents();
initializeKeyboardEvents();
buildDebugMenu();
window.addEventListener('resize', resetCanvas);

runGameLoop();
