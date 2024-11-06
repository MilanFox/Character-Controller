import { gridSize } from '../useCanvas/useCanvas.consts.js';
import { createIsland, getNeighbors } from './useTerrainGeneration.js';

export let terrainMap = [[]];

export const updateTerrainMap = () => {
  const cols = Math.ceil(window.innerWidth / gridSize);
  const rows = Math.ceil(window.innerHeight / gridSize);

  terrainMap = createIsland(rows, cols);
};

export const getConnectionType = (pos) => {
  const neighbors = getNeighbors(pos);
  const terrainType = terrainMap[pos.y][pos.x];
  const connectionType = neighbors.reduce((acc, neighbor) => {
    const isSameTerrain = terrainMap[neighbor.y]?.[neighbor.x] === terrainType;
    return acc + (isSameTerrain ? 1 : 0);
  }, '');
  return parseInt(connectionType.toString(), 2);
};

export const getTerrainSprite = ({ pos }) => {
  const connectionType = getConnectionType(pos);
  const terrainType = terrainMap[pos.y][pos.x];

  const connectionTypeToSpriteMap = {
    0: { x: 3, y: 3 },
    1: { x: 2, y: 3 },
    2: { x: 3, y: 0 },
    3: { x: 2, y: 0 },
    4: { x: 0, y: 3 },
    5: { x: 1, y: 3 },
    6: { x: 0, y: 0 },
    7: { x: 1, y: 0 },
    8: { x: 3, y: 2 },
    9: { x: 2, y: 2 },
    10: { x: 3, y: 1 },
    11: { x: 2, y: 1 },
    12: { x: 0, y: 2 },
    13: { x: 1, y: 2 },
    14: { x: 0, y: 1 },
    15: { x: 1, y: 1 },
  };

  const { x, y } = connectionTypeToSpriteMap[connectionType];

  const spriteSize = 64;

  return {
    sx: x * spriteSize + (320 * terrainType),
    sy: y * spriteSize,
    sWidth: spriteSize,
    sHeight: spriteSize,
  };
};

export const findCell = ({ x, y }) => ({ x: Math.floor(x / gridSize), y: Math.floor(y / gridSize) });

export const getTerrainType = ({ x, y }) => terrainMap[y][x];
