export const keyMap = {
  SpaceKey: ' ',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

export const keys = Object.values(keyMap).reduce((acc, key) => ({ ...acc, [key]: false }), {});

export const initializeKeyboardEvents = () => {
  document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
  });

  document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  });
};
