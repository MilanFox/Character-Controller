import { drawGridLines, fps } from '../useGameLoop/useGameLoop.js';
import { findGridPath } from '../usePathfinding/usePathfinding.js';
import { minion } from '../useMinion/useMinion.js';
import { player } from '../usePlayer/usePlayer.js';
import { gridSize } from '../useCanvas/useCanvas.consts.js';

export const debugOptions = {
  physics: {
    shouldFreezeMinion: {
      isActive: false,
    },
  },
  canvas: {
    shouldShowGridLines: {
      isActive: false,
      action: (ctx) => drawGridLines(ctx),
    },
    shouldShowPathfinding: {
      isActive: false,
      action: (ctx) => {
        const path = findGridPath([minion, player]);
        if (path) {
          path.slice(1, -1).forEach(({ x, y }) => {
            ctx.fillRect(x * gridSize + (gridSize / 2) - 5, y * gridSize + (gridSize / 2) - 5, 10, 10);
          });
        }
      },
    },
    shouldShowFPS: {
      isActive: false,
      action: (ctx) => {
        ctx.fillText(`FPS: ${fps}`, 10, 20);
      },
    },
  },
};

export const allDebugOptions = Object.entries(debugOptions).flatMap(([group, options]) =>
  Object.entries(options).map(([option, settings]) => ({ group, option, settings })),
);

export const initializeLocalStorage = () => {
  allDebugOptions.forEach(({ group, option, settings: { isActive } }) => {
    if (localStorage.getItem(`debug.${group}.${option}`) === null) {
      localStorage.setItem(`debug.${group}.${option}`, isActive.toString());
    }
  });
};

export const setDebugOption = (group, option, isActive) => {
  if (!debugOptions[group]?.[option]) return;
  debugOptions[group][option].isActive = isActive;
  localStorage.setItem(`debug.${group}.${option}`, isActive);
};

export const getDebugOptionsFromLocalStorage = () => {
  Object.entries(localStorage).forEach(([key, value]) => {
    if (key.startsWith('debug')) {
      const [_, group, option] = key.split('.');
      const isActive = JSON.parse(value);
      if (!debugOptions[group]?.[option]) return;
      debugOptions[group][option].isActive = isActive;
    }
  });
};

export const buildDebugMenu = () => {
  initializeLocalStorage();

  const debugMenu = document.createElement('div');
  debugMenu.id = 'debug-menu';
  debugMenu.classList.add('hidden');
  document.body.appendChild(debugMenu);

  const debugMenuToggle = document.createElement('button');
  debugMenuToggle.id = 'debug-menu-toggle';
  document.body.appendChild(debugMenuToggle);
  debugMenuToggle.addEventListener('click', () => document.getElementById(debugMenu.id).classList.toggle('hidden'));

  Object.entries(debugOptions).forEach(([group, options]) => {
    Object.entries(options).forEach(([option]) => {
      const debugOption = document.createElement('div');

      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('id', `${group}-${option}`);
      const isActive = localStorage.getItem(`debug.${group}.${option}`);

      if (isActive === 'true') checkbox.setAttribute('checked', 'checked');

      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        setDebugOption(group, option, isChecked);
      });

      const label = document.createElement('label');
      label.setAttribute('for', checkbox.id);
      label.innerText = `${option}`;

      debugOption.appendChild(checkbox);
      debugOption.appendChild(label);
      debugMenu.appendChild(debugOption);
    });
  });
};
