import { findCell, getTerrainType } from '../useTerrain/useTerrain.js';
import { getNeighbors } from '../useTerrain/useTerrainGeneration.js';

const getGridInfo = (pos, isPixelValue = false) => {
  const { x, y } = isPixelValue ? findCell(pos) : pos;
  const hash = `${x}|${y}`;
  return { x, y, hash };
};

const getPosFromHash = (hash) => {
  const [x, y] = hash.split('|').map(Number);
  return { x, y };
};

export const getHeuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const findGridPath = ([entityStart, entityGoal]) => {
  const self = getGridInfo(entityStart, true);
  const target = getGridInfo(entityGoal, true);
  const openSet = new Set([self.hash]);
  const visited = new Set();
  const cameFrom = {};
  const gScore = { [self.hash]: 0 };
  const fScore = { [self.hash]: getHeuristic(self, target) };

  while (openSet.size > 0) {
    const currentHash = [...openSet].reduce((lowest, cur) => (fScore[cur] < fScore[lowest] ? cur : lowest));
    const { x: cx, y: cy } = getPosFromHash(currentHash);

    if (cx === target.x && cy === target.y) {
      const path = [];
      let hash = currentHash;
      while (hash) {
        const { x, y } = getPosFromHash(hash);
        path.unshift({ x, y });
        hash = cameFrom[hash];
      }
      return path;
    }

    openSet.delete(currentHash);
    visited.add(currentHash);

    for (const neighbor of getNeighbors({ x: cx, y: cy }, true)) {
      const { cost } = neighbor;
      if (getTerrainType(neighbor) < 0) continue;

      const neighborHash = getGridInfo(neighbor).hash;
      if (visited.has(neighborHash)) continue;

      const tempGScore = gScore[currentHash] + cost;
      if (tempGScore < (gScore[neighborHash] || Infinity)) {
        cameFrom[neighborHash] = currentHash;
        gScore[neighborHash] = tempGScore;
        fScore[neighborHash] = tempGScore + getHeuristic(neighbor, target);
        if (!openSet.has(neighborHash)) openSet.add(neighborHash);
      }
    }
  }

  return null;
};
