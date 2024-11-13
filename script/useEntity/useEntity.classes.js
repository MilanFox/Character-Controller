import { keys } from '../useKeyboard/useKeyboard.js';
import { register } from './useEntity.js';
import { findCell, getTerrainType, terrainMap } from '../useTerrain/useTerrain.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

export class Entity {
  constructor({
                x = 0,
                y = 0,
                width = 128,
                height = 128,
                speed = 2,
                totalFrames = 6,
                sprite,
                spriteOffset = { x: 0, y: 0 },
              }) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;
    this.speed = speed;

    this.animationState = 0;
    this.frame = 0;
    this.totalFrames = totalFrames;
    this.frameDelay = 10;
    this.frameDelayCounter = 0;

    this.spriteSheet = new Image();
    this.spriteSheet.src = sprite;
    this.spriteOffset = spriteOffset;

    this.overrideAnimationState = null;
    this.overrideFrameDuration = 0;

    this.isBeingDragged = false;
    this.isConfused = false;
    this.isDrowning = false;

    register(this);
  }

  updateFrame() {
    if (this.frameDelayCounter >= this.frameDelay) {
      this.frame = (this.frame + 1) % this.totalFrames;
      this.frameDelayCounter = 0;
    } else {
      this.frameDelayCounter++;
    }
  }

  get sprite() {
    const spriteSize = 192;
    const sx = spriteSize * this.frame;
    const sy = spriteSize * this.animationState;
    return {
      sprite: this.spriteSheet,
      sx,
      sy,
      sWidth: spriteSize,
      sHeight: spriteSize,
      dx: this.x - (this.width / 2),
      dy: this.y - (this.height / 2),
      dWidth: this.width,
      dHeight: this.height,
      offset: this.spriteOffset,
    };
  }

}

export class Character extends Entity {
  constructor(data) {
    super(data);
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = 0.9;
    this.spriteOffset = { x: 0, y: -20 };
  }

  get isInBounds() {
    const { x, y } = findCell(this);
    return terrainMap[y]?.[x] !== undefined;
  }

  applyFriction() {
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;
  }

  stepTowards(pos, isPixelPos = false) {
    if (!pos) {
      this.stop();
      this.isConfused = true;
      return;
    }

    if (this.isDrowning) {
      this.stop();
      return;
    }

    this.isConfused = false;

    const x = isPixelPos ? pos.x : pos.x * gridSize + (gridSize / 2);
    const dirX = this.x < x ? 1 : -1;
    this.velocityX = this.speed * dirX;

    const y = isPixelPos ? pos.y : pos.y * gridSize + (gridSize / 2);
    const dirY = this.y < y ? 1 : -1;
    this.velocityY = this.speed * dirY;
  }

  updatePosition() {
    const nextX = this.x + this.velocityX;
    const nextY = this.y + this.velocityY;

    if (getTerrainType(findCell({ x: nextX, y: this.y })) >= 0) this.x = nextX;
    if (getTerrainType(findCell({ x: this.x, y: nextY })) >= 0) this.y = nextY;
  }

  updateAnimation() {
    const isMoving = Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1;

    if (this.overrideAnimationState !== null) {
      this.animationState = this.overrideAnimationState;
      this.frameDelay = this.overrideFrameDuration;
      if (this.frame === this.totalFrames - 1) this.overrideAnimationState = null;
      return;
    }

    if (this.isDrowning) {
      this.animationState = 4;
      return;
    }

    if (this.isBeingDragged) {
      this.animationState = 5;
      return;
    }

    if (isMoving) {
      if (this.animationState === 0) this.frame = 0;
      this.animationState = 1;
    } else {
      this.animationState = 0;
    }
  }

  setTemporaryAnimation(animationState, frameDuration) {
    this.overrideAnimationState = animationState;
    this.overrideFrameDuration = frameDuration;
    this.frame = 0;
  }

  actions = {};

  triggerAction(action) {
    const { animationState, frameDuration } = this.actions[action];
    this.setTemporaryAnimation(animationState, frameDuration);
  }

  checkForActionTriggers() {
    Object.entries(this.actions).forEach(([name, data]) => {
      const shouldUnblock = data.blocked && !keys[data.actionKey] && this.animationState < 2;
      const shouldTrigger = !data.blocked && keys[data.actionKey];

      if (shouldTrigger) {
        data.blocked = true;
        this.triggerAction(name);
      }

      if (shouldUnblock) data.blocked = false;
    });
  }

  get isWalkingBackwards() {
    return this.velocityX < 0;
  }

  stop() {
    this.velocityX = 0;
    this.velocityY = 0;
  }
}
