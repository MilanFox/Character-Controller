import { Player } from './usePlayer.classes.js';

const player = new Player();

export const usePlayer = () => {
  return { player };
};
