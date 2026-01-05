export const objectsUtils = {
  skipField: <T extends object, K extends keyof T>(entity: T, skipedFieldName: K): Omit<T, K> => {
    const { [skipedFieldName]: _, ...rest } = entity;
    return rest;
  },
};
