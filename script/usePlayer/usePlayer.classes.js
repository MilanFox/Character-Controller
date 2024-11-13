import { keyMap, keys } from '../useKeyboard/useKeyboard.js';
import { Character } from '../useEntity/useEntity.classes.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';
import { minion } from '../useMinion/useMinion.js';

export class Player extends Character {
  constructor() {
    super({ sprite: 'assets/sprites/player.png' });
    this.initializePosition();
    this.actions.slash = {
      animationState: 2,
      frameDuration: 6,
      actionKey: keyMap.SpaceKey,
      effect: () => {
        const isInReach = ({ x, y }) => {
          const yInReach = (y > this.y - gridSize / 2 && y < this.y + gridSize);
          const xInReach = this.isWalkingBackwards ? (x < this.x && x > this.x - gridSize) : (x > this.x && x < this.x + gridSize);
          return xInReach && yInReach;
        };

        const entities = [minion];

        entities.forEach(entity => {
          const dir = this.isWalkingBackwards ? -1 : 1;
          const force = 10;
          const delay = 10 * 20;
          setTimeout(() => {
            if (isInReach(entity)) entity.velocityX += force * dir;
            entity.staggerFrames = 50;
            entity.updatePosition();
          }, delay);
        });
      },
    };
  }

  initializePosition() {
    this.x = window.innerWidth / 4;
    this.y = window.innerHeight / 2;
  }

  accelerate() {
    if (keys.ArrowUp) this.velocityY = -this.speed;
    if (keys.ArrowDown) this.velocityY = this.speed;
    if (keys.ArrowLeft) this.velocityX = -this.speed;
    if (keys.ArrowRight) this.velocityX = this.speed;
  }

  process() {
    this.checkForActionTriggers();
    this.updateAnimation();
    this.applyFriction();
    if (this.animationState < 2) {
      this.accelerate();
      this.updatePosition();
    }
  }
}

