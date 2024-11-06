import { useTerrain } from '../useTerrain/useTerrain.js';

const { updateTerrainMap, getTerrainSprite } = useTerrain();

export const useCanvas = () => {
  const entityCanvas = document.getElementById('entities');
  const terrainCanvas = document.getElementById('terrain');
  const backgroundCanvas = document.getElementById('background');
  const backgroundAmbientCanvas = document.getElementById('background-ambient');

  const gridSize = 64;

  const canvasLevels = [entityCanvas, terrainCanvas, backgroundCanvas, backgroundAmbientCanvas];

  const setCanvasSize = () => {
    canvasLevels.forEach(level => {
      level.width = window.innerWidth;
      level.height = window.innerHeight;
    });

    updateTerrainMap(gridSize);
    drawBackground();
    drawTerrain();
  };

  const drawEntity = (entity, canvas) => {
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

  const drawTerrain = () => {
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

  const drawBackground = () => {
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

  return {
    setCanvasSize,
    drawEntity,
    drawTerrain,
    entityCanvas,
    terrainCanvas,
    backgroundCanvas,
    backgroundAmbientCanvas,
    gridSize,
  };
};
