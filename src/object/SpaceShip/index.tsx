import React, { Suspense, useRef, useEffect } from 'react'
import {
  Mesh,
  BoxGeometry,
  MeshNormalMaterial,
  Object3D,
  Group,
  Vector3
} from 'three'
import { useLoader, useFrame } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { loadObject3D } from '@/utils/loadObject3d'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'

const genDammySpaceShip = (): Mesh =>
  new Mesh(new BoxGeometry(1, 0.2, 0.2), new MeshNormalMaterial())

export const loadSpaceShipModel = async (): Promise<Group> => {
  const obj = await loadObject3D({
    texturePath: require('./models/textures/F15A.jpg'),
    objectPath: require('./models/spaceShip.obj')
  })
  obj.rotateX(3)
  obj.scale.x /= 2
  obj.scale.y /= 2
  obj.scale.z /= 2
  return obj
}
interface SpaceShipOption {
  model?: Object3D
}
export default class SpaceShip extends Group {
  public isRotation: boolean = false
  public isClashed: boolean = false
  public flightSpeed: number = 0.5
  constructor({ model }: SpaceShipOption = {}) {
    super()
    this.checkVector = this.checkVector.bind(this)
    this.add(model || genDammySpaceShip())
  }

  public touch(obj: Object3D): boolean {
    const x1 = obj.position.x + obj.scale.x / 2
    const x2 = obj.position.x - obj.scale.x / 2
    const y1 = obj.position.y + obj.scale.y / 2
    const y2 = obj.position.y - obj.scale.y / 2
    const z1 = obj.position.z + obj.scale.z / 2
    const z2 = obj.position.z - obj.scale.z / 2
    return (
      this.checkVector(x1, y1, z1) ||
      this.checkVector(x2, y1, z1) ||
      this.checkVector(x1, y2, z1) ||
      this.checkVector(x2, y2, z1) ||
      this.checkVector(x1, y1, z2) ||
      this.checkVector(x1, y2, z2) ||
      this.checkVector(x2, y1, z2) ||
      this.checkVector(x2, y2, z2)
    )
  }

  private checkVector(x: number, y: number, z: number): boolean {
    return (
      x > this.position.x - this.scale.x / 2 &&
      x < this.position.x + this.scale.x / 2 &&
      y > this.position.y - this.scale.y / 2 &&
      y < this.position.y + this.scale.y / 2 &&
      z > this.position.z - this.scale.z / 2 &&
      z < this.position.z + this.scale.z / 2
    )
  }
}

const ROTATE_UNIT = 0.1

export const SpaceShipComponent = () => {
  const ref = useRef<Group | null>(null)
  const obj = useLoader(OBJLoader, require('./models/spaceShip.obj'))

  const { flightSpeed, isRotation, position } = useSelector(
    (state: RootStore) => state.spaceShip
  )
  const { active } = useSelector((state: RootStore) => state.play)
  const cameraDistance = useSelector((state: RootStore) => state.cam.distance)
  const dispatch = useDispatch()
  /**
   * FIX OBJECT STYLE
   */
  useEffect(() => {
    obj.rotateX(3)
    obj.scale.x /= 2
    obj.scale.y /= 2
    obj.scale.z /= 2
  }, [obj])
  /**
   * Update spaceShip
   */
  useEffect(() => {
    if (!ref.current) return
    const { x, y, z } = position
    ref.current.position.copy(new Vector3(x, y, z))
    // spaceShip rotation
    if (isRotation) ref.current.rotation.z += ROTATE_UNIT
  }, [isRotation, position])
  /**
   * SPACESHIP BEHAVIOR
   */
  useFrame(() => {
    if (!active) return
    dispatch(
      SPACESHIP_UPDATE({
        position: {
          ...position,
          z: position.z - flightSpeed
        }
      })
    )
  })

  return <primitive ref={ref} object={obj} />
}
