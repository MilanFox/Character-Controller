import { keyMap, keys } from '../useKeyboard/useKeyboard.js';
import { Character } from '../useEntity/useEntity.classes.js';

export class Player extends Character {
  constructor() {
    super({ sprite: 'assets/sprites/player.png' });
    this.initializePosition();
    this.actions.slash = { animationState: 2, frameDuration: 6, actionKey: keyMap.SpaceKey };
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

