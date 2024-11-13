import { gridSize } from './useCanvas.consts.js';
import { getTerrainSprite, terrainMap, updateTerrainMap } from '../useTerrain/useTerrain.js';
import { ambientEffects } from '../useTerrain/useTerrainGeneration.js';

export const entityCanvas = document.getElementById('entities');
export const terrainCanvas = document.getElementById('terrain');
export const terrainAmbientCanvas = document.getElementById('terrain-ambient');
export const backgroundCanvas = document.getElementById('background');
export const backgroundAmbientCanvas = document.getElementById('background-ambient');

export const canvasLevels = [
  entityCanvas,
  terrainCanvas,
  terrainAmbientCanvas,
  backgroundCanvas,
  backgroundAmbientCanvas,
];

export const setCanvasSize = () => {
  canvasLevels.forEach(level => {
    level.width = window.innerWidth;
    level.height = window.innerHeight;
  });

  updateTerrainMap(gridSize);
  drawTerrain();
  drawBackground();
};

export const drawEntity = (entity, canvas) => {
  const ctx = canvas.getContext('2d');
  const { sprite, sx, sy, sWidth, sHeight, dx, dy, dHeight, dWidth, offset } = entity.sprite;
  ctx.save();

  if (entity.isWalkingBackwards) {
    ctx.scale(-1, 1);
    ctx.drawImage(sprite, sx, sy, sWidth, sHeight, -dx - dWidth + offset.x, dy + offset.y, dHeight, dWidth);
  } else {
    ctx.drawImage(sprite, sx, sy, sWidth, sHeight, dx + offset.x, dy + offset.y, dHeight, dWidth);
  }

  ctx.restore();
};

export const drawTerrain = () => {
  const ctxTerrain = terrainCanvas.getContext('2d');
  const terrainSpriteSheet = new Image();

  terrainSpriteSheet.onload = () => {
    for (let x = gridSize; x < window.innerWidth; x += gridSize) {
      for (let y = gridSize; y < window.innerHeight; y += gridSize) {
        if (terrainMap[y / gridSize][x / gridSize] < 0) continue;
        const pos = { x: x / gridSize, y: y / gridSize };
        const { sx, sy, sWidth, sHeight } = getTerrainSprite({ pos, gridSize });
        ctxTerrain.drawImage(terrainSpriteSheet, sx, sy, sWidth, sHeight, x, y, gridSize, gridSize);
      }
    }
  };

  terrainSpriteSheet.src = 'assets/sprites/terrain/flat.png';

  drawAmbientSprites();
};

const drawAmbientSprites = () => {
  const ctxAmbientTerrain = terrainAmbientCanvas.getContext('2d');
  ambientEffects.terrain.statics.forEach(({ x, y, sprite }) => {
    const spriteSrc = new Image();
    spriteSrc.onload = () => {
      ctxAmbientTerrain.drawImage(spriteSrc, 0, 0, gridSize, gridSize, x * gridSize, y * gridSize, gridSize, gridSize);
    };
    spriteSrc.src = sprite;
  });
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
