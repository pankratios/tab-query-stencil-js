export const prevIndex = (index: number, max: number, cycle = false): number => {
  return index ? index - 1 : cycle ? max : index;
}

export const nextIndex = (index: number, max: number, cycle = false): number => {
  return max - index ? index + 1 : cycle ? 0 : index;
}
