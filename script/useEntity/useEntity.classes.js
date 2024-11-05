import { useEntity } from './useEntity.js';
import { keys } from '../useKeyboard/useKeyboard.js';

const { register } = useEntity();

export class Entity {
  constructor({ x = 0, y = 0, width = 128, height = 128, speed = 2, totalFrames = 6, sprite }) {
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
    };
  }

}

export class Character extends Entity {
  constructor(data) {
    super(data);
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = 0.9;
  }

  applyFriction() {
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;
  }

  updatePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  updateAnimation() {
    const isMoving = Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1;

    if (this.overrideAnimationState !== null) {
      this.animationState = this.overrideAnimationState;
      this.frameDelay = this.overrideFrameDuration;

      if (this.frame === this.totalFrames - 1) {
        this.overrideAnimationState = null;
      }
    } else {
      if (isMoving) {
        if (this.animationState === 0) this.frame = 0;
        this.animationState = 1;
      } else {
        this.animationState = 0;
      }
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
}
