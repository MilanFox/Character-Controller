const entities = new Set();

export const useEntity = () => {
  const register = (entity) => {
    entities.add(entity);
  };

  const deregister = (entity) => {
    entities.delete(entity);
  };

  return { entities, register, deregister };
};
