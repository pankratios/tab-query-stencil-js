export const prevIndex = (index: number, maxIndex: number, cycle = false): number => {
  return index ? index - 1 : cycle ? maxIndex : index;
};

export const nextIndex = (index: number, maxIndex: number, cycle = false): number => {
  return maxIndex - index ? index + 1 : cycle ? 0 : index;
};

export const daysInMilliseconds = (days: number): number => {
  return 86400000 * days;
};
