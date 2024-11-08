import { Entity } from '../useEntity/useEntity.classes.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

export const ambientEffects = { background: { entities: [] }, terrain: { statics: [] } };

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

const createIsland = (rows, cols) => {
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

  return array;
};

export const postProcessMap = (map) => {
  const { edges, ocean } = findEdges(map);
  const getFoamSpriteData = ({ x, y }) => ({
    x: x * 64 + 32,
    y: y * 64 + 32,
    sprite: 'assets/sprites/terrain/foam.png',
    totalFrames: 8,
  });

  ambientEffects.background.entities = edges.map((edge) => new Entity(getFoamSpriteData(edge)));

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === -1 && !ocean.some(tile => tile.y === y && tile.x === x)) {
        map[y][x] = 0;
      }
    }
  }
};

const bridgeGap = (map) => {
  const startX = Math.floor(map[0].length / 2);
  const randomOffset = Math.floor(Math.random() * 5) - 2;
  const y = Math.floor((map.length / 2)) + randomOffset;

  const bridge = [];

  const buildBridge = (x) => {
    bridge.push({ x, y });
    map[y][x] = 2;
    for (const i of [-1, 1]) {
      if (map[y][x + i] === -1) buildBridge(x + i);
    }
  };

  buildBridge(startX);

  bridge.sort((a, b) => a.x - b.x);
  return { left: bridge.at(0), right: bridge.at(-1) };
};

export const createIslands = (totalRows, totalCols) => {
  const cols = totalCols % 2 === 0 ? totalCols / 2 - 1 : Math.floor(totalCols / 2);
  const islandA = createIsland(totalRows, cols);
  const islandB = createIsland(totalRows, cols);
  const map = islandA.map((row, i) => [...row, ...islandB[i]]);
  postProcessMap(map);

  const bridgeHeads = bridgeGap(map);
  ambientEffects.terrain.statics.push({
    x: bridgeHeads.left.x - 1,
    y: bridgeHeads.left.y,
    sprite: 'assets/sprites/terrain/bridge_head_l.png',
  });
  ambientEffects.terrain.statics.push({
    x: bridgeHeads.right.x + 1,
    y: bridgeHeads.right.y,
    sprite: 'assets/sprites/terrain/bridge_head_r.png',
  });

  addRandomAmbientSprites(map, 5);

  return map;
};

export const getRandomTerrainAmbientSprite = () => {
  const numberOfPossibleSprites = 15;
  const i = Math.floor(Math.random() * numberOfPossibleSprites).toString().padStart(2, '0');
  return `assets/sprites/ambient/${i}.png`;
};

export const addRandomAmbientSprites = (map, count) => {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * (window.innerWidth / gridSize));
    const y = Math.floor(Math.random() * (window.innerHeight / gridSize));
    if (map[y][x] === 0) ambientEffects.terrain.statics.push({ y, x, sprite: getRandomTerrainAmbientSprite() });
  }
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
