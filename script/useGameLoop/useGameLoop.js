import { backgroundAmbientCanvas, drawEntity, entityCanvas } from '../useCanvas/useCanvas.js';
import { entities } from '../useEntity/useEntity.js';
import { ambientEffects } from '../useTerrain/useTerrainGeneration.js';
import { player } from '../usePlayer/usePlayer.js';

let lastFrameTime = performance.now();
let fps = 0;

const drawFrame = () => {
  const currentFrameTime = performance.now();
  fps = Math.round(1000 / (currentFrameTime - lastFrameTime));
  lastFrameTime = currentFrameTime;
  entityCanvas.getContext('2d').clearRect(0, 0, entityCanvas.width, entityCanvas.height);
  backgroundAmbientCanvas.getContext('2d').clearRect(0, 0, entityCanvas.width, entityCanvas.height);
  drawEntity(player, entityCanvas);
  ambientEffects.background.entities.forEach(effectEntity => drawEntity(effectEntity, backgroundAmbientCanvas));
  entityCanvas.getContext('2d').fillText(`FPS: ${fps}`, 10, 20);
};

export const runGameLoop = () => {
  entities.forEach(entity => {
    entity.updateFrame();
    entity.process?.();
  });
  drawFrame();
  requestAnimationFrame(runGameLoop);
};

