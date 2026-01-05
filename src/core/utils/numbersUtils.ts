export const numbersUtils = {
  inRange: (number: number, min: number, max: number): boolean => number >= min && number <= max,
  outRange: (number: number, min: number, max: number): boolean => number < min || number > max,
  getRandomFromRange: (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
