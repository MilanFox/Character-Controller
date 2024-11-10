import { backgroundAmbientCanvas, drawEntity, entityCanvas } from '../useCanvas/useCanvas.js';
import { entities } from '../useEntity/useEntity.js';
import { ambientEffects } from '../useTerrain/useTerrainGeneration.js';
import { player } from '../usePlayer/usePlayer.js';
import { minion } from '../useMinion/useMinion.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

let lastFrameTime = performance.now();
let fps = 0;

const cursorSprite = new Image();
cursorSprite.src = ambientEffects.terrain.cursor.sprite;

const drawFrame = () => {
  const currentFrameTime = performance.now();
  fps = Math.round(1000 / (currentFrameTime - lastFrameTime));
  lastFrameTime = currentFrameTime;

  const entityCtx = entityCanvas.getContext('2d');
  const bgAmbientCtx = backgroundAmbientCanvas.getContext('2d');

  entityCtx.clearRect(0, 0, entityCanvas.width, entityCanvas.height);
  bgAmbientCtx.clearRect(0, 0, entityCanvas.width, entityCanvas.height);

  if (ambientEffects.terrain.cursor) {
    const { x, y } = ambientEffects.terrain.cursor;
    entityCtx.drawImage(cursorSprite, 0, 0, gridSize, gridSize, x * gridSize, y * gridSize, gridSize, gridSize);
  }

  const entities = [minion, player].sort((a, b) => a.y - b.y);
  entities.forEach(entity => { drawEntity(entity, entityCanvas); });

  ambientEffects.background.entities.forEach(effectEntity => drawEntity(effectEntity, backgroundAmbientCanvas));
  entityCtx.fillText(`FPS: ${fps}`, 10, 20);
};

export const runGameLoop = () => {
  entities.forEach(entity => {
    entity.updateFrame();
    entity.process?.();
  });
  drawFrame();
  requestAnimationFrame(runGameLoop);
};

