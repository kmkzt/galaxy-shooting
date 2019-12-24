import { Object3D, Color } from 'three'

export interface Xyz {
  x: number
  y: number
  z: number
}
export interface Obj {
  position: Xyz
  scale: Xyz
  rotation: Xyz
  color?: Color
}
