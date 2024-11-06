import { gridSize } from './useCanvas.consts.js';
import { getTerrainSprite, updateTerrainMap } from '../useTerrain/useTerrain.js';

export const entityCanvas = document.getElementById('entities');
export const terrainCanvas = document.getElementById('terrain');
export const backgroundCanvas = document.getElementById('background');
export const backgroundAmbientCanvas = document.getElementById('background-ambient');

export const canvasLevels = [entityCanvas, terrainCanvas, backgroundCanvas, backgroundAmbientCanvas];

export const setCanvasSize = () => {
  canvasLevels.forEach(level => {
    level.width = window.innerWidth;
    level.height = window.innerHeight;
  });

  updateTerrainMap(gridSize);
  drawBackground();
  drawTerrain();
};

export const drawEntity = (entity, canvas) => {
  const ctx = canvas.getContext('2d');
  const { sprite, sx, sy, sWidth, sHeight, dx, dy, dHeight, dWidth } = entity.sprite;
  ctx.save();

  if (entity.isWalkingBackwards) {
    ctx.scale(-1, 1);
    ctx.drawImage(sprite, sx, sy, sWidth, sHeight, -dx - dWidth, dy, dHeight, dWidth);
  } else {
    ctx.drawImage(sprite, sx, sy, sWidth, sHeight, dx, dy, dHeight, dWidth);
  }

  ctx.restore();
};

export const drawTerrain = () => {
  const ctxTerrain = terrainCanvas.getContext('2d');
  const spriteSheet = new Image();

  spriteSheet.onload = () => {
    for (let x = 0; x < window.innerWidth; x += gridSize) {
      for (let y = 0; y < window.innerHeight; y += gridSize) {
        const { sx, sy, sWidth, sHeight } = getTerrainSprite({
          pos: { x: x / gridSize, y: y / gridSize },
          gridSize,
        });
        ctxTerrain.drawImage(spriteSheet, sx, sy, sWidth, sHeight, x, y, gridSize, gridSize);
      }
    }
  };

  spriteSheet.src = 'assets/sprites/terrain/flat.png';
};

export const drawBackground = () => {
  const ctxTerrain = backgroundCanvas.getContext('2d');
  const spriteSheet = new Image();

  spriteSheet.src = 'assets/sprites/terrain/water.png';

  spriteSheet.onload = () => {
    for (let y = 0; y < window.innerHeight; y += gridSize) {
      for (let x = 0; x < window.innerWidth; x += gridSize) {
        ctxTerrain.drawImage(spriteSheet, 0, 0, gridSize, gridSize, x, y, gridSize, gridSize);
      }
    }
  };
};
