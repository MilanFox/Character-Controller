export const entities = new Set();

export const register = (entity) => {
  entities.add(entity);
};

export const deregister = (entity) => {
  entities.delete(entity);
};

