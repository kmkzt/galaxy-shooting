import React, { Suspense, useRef, useEffect } from 'react'
import { Group, Vector3, Euler } from 'three'
import { useLoader, useFrame } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'

// Fallback Spaceship object
// const genDammySpaceShip = (): Mesh =>
//   new Mesh(new BoxGeometry(1, 0.2, 0.2), new MeshNormalMaterial())

const ROTATE_UNIT = 0.1
const SpaceShip = () => {
  const ref = useRef<Group | null>(null)
  const obj = useLoader(OBJLoader, require('./models/spaceShip.obj'))

  const { flightSpeed, isRotation, position, rotation, scale } = useSelector(
    (state: RootStore) => state.spaceShip
  )
  const { active } = useSelector((state: RootStore) => state.play)
  const dispatch = useDispatch()
  /**
   * SET OBJECT
   */
  useEffect(() => {
    obj.rotateX(3)
    obj.scale.x /= 2
    obj.scale.y /= 2
    obj.scale.z /= 2
    dispatch(
      SPACESHIP_UPDATE({
        rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
        scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
      })
    )
  }, [dispatch, obj])
  /**
   * Update spaceShip
   */
  useEffect(() => {
    if (!ref.current) return
    ref.current.position.copy(new Vector3(position.x, position.y, position.z))
    ref.current.rotation.copy(new Euler(rotation.x, rotation.y, rotation.z))
    // TODO: Fix scale
    // ref.current.scale.copy(new Vector3(scale.x, scale.y, scale.z))
  }, [position, rotation.x, rotation.y, rotation.z])
  /**
   * SPACESHIP BEHAVIOR
   */
  useFrame(() => {
    if (!active || !ref.current) return

    dispatch(
      SPACESHIP_UPDATE({
        // spaceShip Moving
        position: {
          ...position,
          z: position.z - flightSpeed
        },
        // spaceShip rotation
        rotation: {
          ...rotation,
          z: isRotation ? rotation.z + ROTATE_UNIT : rotation.z
        }
      })
    )
  })

  return <primitive ref={ref} object={obj} />
}

export default SpaceShip
