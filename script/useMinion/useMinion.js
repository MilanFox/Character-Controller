import { Character } from '../useEntity/useEntity.classes.js';
import { findGridPath, getHeuristic } from '../usePathfinding/usePathfinding.js';
import { player } from '../usePlayer/usePlayer.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';
import { ambientEffects } from '../useTerrain/useTerrainGeneration.js';
import { findCell, getTerrainType } from '../useTerrain/useTerrain.js';
import { debugOptions } from '../useDebugging/useDebugging.js';

export const minion = new Character({
  sprite: 'assets/sprites/minion.png',
  speed: 1.25,
});

minion.initializePosition = () => {
  minion.x = window.innerWidth * 0.75;
  minion.y = window.innerHeight / 2;
};

minion.initializePosition();

minion.process = () => {
  minion.updateAnimation();
  const terrainType = getTerrainType(findCell(minion));
  minion.isDrowning = minion.isBeingDragged ? false : terrainType < 0 || terrainType === undefined;

  if (minion.isBeingDragged) {
    const { x, y } = findCell(minion);
    ambientEffects.terrain.cursor = { x, y, sprite: 'assets/ui/marker.png' };
    return;
  }

  ambientEffects.terrain.cursor = null;

  if (minion.isDrowning || debugOptions.physics.shouldFreezeMinion.isActive) return;

  const distance = getHeuristic(minion, player);
  if (distance > gridSize) {
    minion.stepTowards(findGridPath([minion, player])?.[1]);
    minion.updatePosition();
  } else {
    minion.stop();
  }
};
