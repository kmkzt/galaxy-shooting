import { Xyz } from '@/interface/Obj'

export const getRandomPosition = (
  { x, y, z }: Xyz,
  { x: ox, y: oy, z: oz }: Partial<Xyz> = {}
): Xyz => ({
  x: (Math.random() - 0.5) * x + (ox || 0),
  y: (Math.random() - 0.5) * y + (oy || 0),
  z: (Math.random() - 0.5) * z + (oz || 0)
})
