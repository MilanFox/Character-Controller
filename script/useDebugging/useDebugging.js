import { drawGridLines, fps } from '../useGameLoop/useGameLoop.js';
import { findGridPath } from '../usePathfinding/usePathfinding.js';
import { minion } from '../useMinion/useMinion.js';
import { player } from '../usePlayer/usePlayer.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

export const debugOptions = {
  canvas: {
    shouldShowGridLines: {
      isActive: false,
      action: (ctx) => drawGridLines(ctx),
    },
    shouldShowPathfinding: {
      isActive: false,
      action: (ctx) => {
        const path = findGridPath([minion, player]);
        if (path) {
          path.slice(1, -1).forEach(({ x, y }) => {
            ctx.fillRect(x * gridSize + (gridSize / 2) - 5, y * gridSize + (gridSize / 2) - 5, 10, 10);
          });
        }
      },
    },
    shouldShowFPS: {
      isActive: false,
      action: (ctx) => {
        ctx.fillText(`FPS: ${fps}`, 10, 20);
      },
    },
  },
};

window.debugOptions = debugOptions;
