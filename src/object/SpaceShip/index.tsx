import React, { memo } from 'react'
import { Group } from 'three'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'
import { touchObject } from '@/utils/touchObject'
import { Meteo } from '@/store/Meteolites'

const SpaceShip = memo(({ obj }: { obj: Group }) => {
  const { mouse, aspect } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const meteos = useSelector((state: RootStore) => state.meteos)
  const dispatch = useDispatch()

  // SpaceShip Behavior
  useFrame(() => {
    const ROTATE_UNIT = 0.1
    const { position, flightSpeed, isRotation, rotation, isClashed } = ship
    if (isClashed) return

    const mousemove_x = mouse.x / 2
    const mousemove_y = mouse.y / 2

    dispatch(
      SPACESHIP_UPDATE({
        isClashed: Object.values(meteos).some((me: Meteo) =>
          touchObject(me, ship)
        ),
        // spaceShip Moving
        position: {
          ...position,
          x: mousemove_x * aspect * 14,
          y: mousemove_y * 14,
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
  const { position, rotation, scale } = ship
  return (
    <primitive
      object={obj}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
    />
  )
})

export default SpaceShip
