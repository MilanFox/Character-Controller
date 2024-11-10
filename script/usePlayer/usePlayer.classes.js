import { keyMap, keys } from '../useKeyboard/useKeyboard.js';
import { Character } from '../useEntity/useEntity.classes.js';

export class Player extends Character {
  constructor() {
    super({ sprite: 'assets/sprites/player.png', x: window.innerWidth / 4, y: window.innerHeight / 2 });
    this.actions.slash = { animationState: 2, frameDuration: 6, actionKey: keyMap.SpaceKey };
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

