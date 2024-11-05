export const useCanvas = () => {
  const entityCanvas = document.getElementById('entities');

  const gridSize = 64;

  const canvasLevels = [entityCanvas];

  const setCanvasSize = () => {
    canvasLevels.forEach(level => {
      level.width = window.innerWidth;
      level.height = window.innerHeight;
    });
  };

  const drawEntity = (entity, canvas) => {
    const ctx = canvas.getContext('2d');
    const { sprite, sx, sy, sWidth, sHeight, dx, dy, dHeight, dWidth } = entity.sprite;
    ctx.save();

    if (entity.isWalkingBackwards) {
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, sx, sy, sWidth, sHeight, -dx - dWidth, dy, dHeight, dWidth);
    } else {
      ctx.drawImage(sprite, sx, sy, sWidth, sHeight, dx, dy, dHeight, dWidth);
    }

    ctx.restore();
  };

  return {
    setCanvasSize,
    drawEntity,
    entityCanvas,
    gridSize,
  };
};
