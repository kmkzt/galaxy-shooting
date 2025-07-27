import type { Color } from 'three';
import { Object3D } from 'three'

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
