import { Obj, Xyz } from '@/interface/Obj'

export const touchObject = <T1 extends Obj, T2 extends Obj = T1>(
  obj1: T1,
  obj2: T2
): boolean => {
  const x1 = obj2.position.x + obj2.scale.x / 2
  const x2 = obj2.position.x - obj2.scale.x / 2
  const y1 = obj2.position.y + obj2.scale.y / 2
  const y2 = obj2.position.y - obj2.scale.y / 2
  const z1 = obj2.position.z + obj2.scale.z / 2
  const z2 = obj2.position.z - obj2.scale.z / 2
  return (
    checkVector(obj1, { x: x1, y: y1, z: z1 }) ||
    checkVector(obj1, { x: x2, y: y1, z: z1 }) ||
    checkVector(obj1, { x: x1, y: y2, z: z1 }) ||
    checkVector(obj1, { x: x2, y: y2, z: z1 }) ||
    checkVector(obj1, { x: x1, y: y1, z: z2 }) ||
    checkVector(obj1, { x: x1, y: y2, z: z2 }) ||
    checkVector(obj1, { x: x2, y: y1, z: z2 }) ||
    checkVector(obj1, { x: x2, y: y2, z: z2 })
  )
}

const checkVector = <T extends Obj>(obj: T, { x, y, z }: Xyz): boolean =>
  x > obj.position.x - obj.scale.x / 2 &&
  x < obj.position.x + obj.scale.x / 2 &&
  y > obj.position.y - obj.scale.y / 2 &&
  y < obj.position.y + obj.scale.y / 2 &&
  z > obj.position.z - obj.scale.z / 2 &&
  z < obj.position.z + obj.scale.z / 2
