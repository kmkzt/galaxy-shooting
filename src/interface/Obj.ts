import { Object3D } from 'three'

export interface Xyz {
  x: number
  y: number
  z: number
}
export interface Obj {
  position: Xyz
  rotation: Xyz
  scale: Xyz
}
