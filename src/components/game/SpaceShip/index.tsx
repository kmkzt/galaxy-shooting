import React, { memo, Fragment, useLayoutEffect, useCallback } from 'react'
import { Group } from 'three'
import { useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'
import { touchObject } from '@/utils/touchObject'
import { Meteo } from '@/store/Meteolites'
import useGameFrame from '@/hooks/useGameFrame'

/**
 * SPACE_CHIP CONSTANT
 */
const ROTATE_UNIT = 0.1

const SpaceShip = memo(({ obj }: { obj: Group }) => {
  const { mouse, aspect } = useThree()
  const {
    position,
    rotation,
    scale,
    flightSpeed,
    isRotation,
    isClashed
  } = useSelector((state: RootStore) => state.spaceShip)
  const meteos = useSelector((state: RootStore) => state.meteos)
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(
      SPACESHIP_UPDATE({
        isRotation: !isRotation
      })
    )
  }, [dispatch, isRotation])
  useLayoutEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])
  // SpaceShip Behavior
  useGameFrame(() => {
    if (isClashed) return

    const mousemove_x = mouse.x / 2
    const mousemove_y = mouse.y / 2
    dispatch(
      SPACESHIP_UPDATE({
        isClashed: Object.values(meteos).some((me: Meteo) =>
          touchObject(me, {
            position,
            rotation,
            scale
          })
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
  return (
    <Fragment>
      <primitive
        object={obj}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale.x, scale.y, scale.z]}
      />
      <pointLight
        position={[position.x, position.y, position.z + 100]}
        distance={100}
        intensity={10}
      />
    </Fragment>
  )
})

export default SpaceShip
