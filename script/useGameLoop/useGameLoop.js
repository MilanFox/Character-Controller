import { backgroundAmbientCanvas, drawEntity, entityCanvas } from '../useCanvas/useCanvas.js';
import { entities } from '../useEntity/useEntity.js';
import { ambientEffects } from '../useTerrain/useTerrainGeneration.js';
import { player } from '../usePlayer/usePlayer.js';

const drawFrame = () => {
  entityCanvas.getContext('2d').clearRect(0, 0, entityCanvas.width, entityCanvas.height);
  backgroundAmbientCanvas.getContext('2d').clearRect(0, 0, entityCanvas.width, entityCanvas.height);
  drawEntity(player, entityCanvas);
  ambientEffects.background.entities.forEach(effectEntity => drawEntity(effectEntity, backgroundAmbientCanvas));
};

export const runGameLoop = () => {
  entities.forEach(entity => {
    entity.updateFrame();
    entity.process?.();
  });
  drawFrame();
  requestAnimationFrame(runGameLoop);
};

