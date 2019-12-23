export const getRandom = ({ min, max }: { min: number; max: number }): number =>
  min + Math.random() * (max - min)
