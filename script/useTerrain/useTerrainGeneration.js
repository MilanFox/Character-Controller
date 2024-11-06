import { Entity } from '../useEntity/useEntity.classes.js';

export const ambientEffects = { entities: [] };

export const getNeighbors = (pos, useDiagonals) => {
  if (useDiagonals) return [
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x + 1, y: pos.y - 1 },
    { x: pos.x + 1, y: pos.y },
    { x: pos.x + 1, y: pos.y + 1 },
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x - 1, y: pos.y + 1 },
    { x: pos.x - 1, y: pos.y },
    { x: pos.x - 1, y: pos.y - 1 },
  ];
  return [
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x + 1, y: pos.y },
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x - 1, y: pos.y },
  ];
};

export const createIsland = (rows, cols) => {
  const array = Array.from({ length: rows }, () => Array(cols).fill(-1));

  const randomizeLayer = (layer) => {
    const bias = 0.35;
    for (let i = layer; i < rows - layer; i++) {
      for (let j = layer; j < cols - layer; j++) {
        if (array[i][j] === -1) {
          array[i][j] = Math.random() < bias ? -1 : 0;
        }
      }
    }
  };

  const maxLayer = Math.min(rows, cols) / 2;
  for (let layer = 1; layer <= maxLayer; layer++) {
    randomizeLayer(layer);
  }

  for (let j = 0; j < cols; j++) array[rows - 2][j] = -1;

  const { edges, ocean } = findEdges(array);
  const getFoamSpriteData = ({ x, y }) => ({
    x: x * 64 + 32,
    y: y * 64 + 32,
    sprite: 'assets/sprites/terrain/foam.png',
    totalFrames: 8,
  });

  ambientEffects.entities = edges.map((edge) => new Entity(getFoamSpriteData(edge)));

  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[0].length; x++) {
      if (array[y][x] === -1 && !ocean.some(tile => tile.y === y && tile.x === x)) {
        array[y][x] = 0;
      }
    }
  }

  return array;
};

export const findEdges = (terrainMap) => {
  const edges = [];
  const ocean = [];
  const visited = [];
  const openSet = [{ x: 0, y: 0 }];

  while (openSet.length) {
    const { x, y } = openSet.shift();
    const hash = `${x}|${y}`;
    if (visited.includes(hash)) continue;
    visited.push(hash);
    const terrainType = terrainMap[y]?.[x];
    if (terrainType === undefined) continue;
    if (terrainType === -1) ocean.push({ x, y });
    if (terrainType !== -1) {
      edges.push({ x, y });
      continue;
    }
    openSet.push(...getNeighbors({ x, y }, true));
  }

  return { edges, ocean };
};
