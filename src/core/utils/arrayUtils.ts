export const arrayUtils = {
  unique: <T>(array: Array<T>): Array<T> => [...new Set(array)],
};
