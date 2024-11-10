import { minion } from '../useMinion/useMinion.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

const handleDragStart = (event) => {
  if (event.button !== 0) return;
  if (Math.abs(event.clientX - minion.x) < (gridSize / 2) && Math.abs(event.clientY - minion.y) < (gridSize / 2)) {
    minion.isBeingDragged = true;
  }
};

const handleMove = (event) => {
  if (minion.isBeingDragged) {
    const { clientX, clientY } = event;
    minion.x = clientX;
    minion.y = clientY;
  }
};

const handleDragEnd = () => {
  minion.isBeingDragged = false;
};

export const initializeMouseEvents = () => {
  window.addEventListener('mouseup', handleDragEnd);
  window.addEventListener('touchstart', handleDragStart);

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('touchmove', handleMove);

  window.addEventListener('mousedown', handleDragStart);
  window.addEventListener('touchend', handleDragEnd);
};
