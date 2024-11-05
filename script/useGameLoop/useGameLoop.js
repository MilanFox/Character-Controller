import { usePlayer } from '../usePlayer/usePlayer.js';
import { useCanvas } from '../useCanvas/useCanvas.js';
import { useEntity } from '../useEntity/useEntity.js';

export const useGameLoop = () => {
  const { player } = usePlayer();
  const { entityCanvas, backgroundAmbientCanvas, drawEntity } = useCanvas();
  const { entities } = useEntity();

  const drawFrame = () => {
    entityCanvas.getContext('2d').clearRect(0, 0, entityCanvas.width, entityCanvas.height);
    drawEntity(player, entityCanvas);
  };

  const runGameLoop = () => {
    entities.forEach(entity => {
      entity.updateFrame();
      entity.process?.();
    });
    drawFrame();
    requestAnimationFrame(runGameLoop);
  };

  return { runGameLoop };
};
