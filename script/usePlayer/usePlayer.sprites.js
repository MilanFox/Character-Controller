const getFrameIndex = () => {
  const milliseconds = new Date().getMilliseconds();
  return Math.floor(milliseconds / (1000 / (6 * 2))) % 6;
};

const currentAnimation = 'idle';

const rowOffset = {
  idle: 0,
  running: 1,
};

export const playerSpriteCoordinates = {
  startX: () => 192 * getFrameIndex(),
  startY: () => 192 * rowOffset[currentAnimation],
  sizeX: 192,
  sizeY: 192,
};
