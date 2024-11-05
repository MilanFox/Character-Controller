export const keyMap = {
  SpaceKey: ' ',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

export const keys = Object.values(keyMap).reduce((acc, key) => ({ ...acc, [key]: false }), {});
