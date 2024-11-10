import { Character } from '../useEntity/useEntity.classes.js';
import { findGridPath, getHeuristic } from '../usePathfinding/usePathfinding.js';
import { player } from '../usePlayer/usePlayer.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

export const minion = new Character({
  sprite: 'assets/sprites/minion.png',
  x: window.innerWidth * 0.75,
  y: window.innerHeight / 2,
  speed: 1.25,
});

minion.process = () => {
  const distance = getHeuristic(minion, player);
  minion.updateAnimation();
  if (distance > gridSize) {
    minion.stepTowards(findGridPath([minion, player])[1]);
    minion.updatePosition();
  } else {
    minion.stop();
  }
};
