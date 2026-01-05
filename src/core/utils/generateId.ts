export const generateId = (entities: { id: number; }[]): number => {
  if (entities.length === 0) return 1;
  const lastEntity = entities[entities.length - 1];
  if (lastEntity) {
    return lastEntity.id + 1;
  } else {
    return 1;
  }
};
