import { useLoader, useThree } from '@react-three/fiber'
import { Fragment, memo, Suspense, useCallback, useLayoutEffect } from 'react'
import { ConeGeometry, type Group, Mesh } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import useGameFrame from '../../hooks/useGameFrame'
import { touchObject } from '../../logic/collision'
import type { Meteo } from '../../store/gameStore'
import { useGameStore } from '../../store/gameStore'
import spaceShipObjUrl from './assets/obj/spaceShip.obj?url'

const ROTATE_UNIT = 0.1
const fallbackObject = new Mesh(new ConeGeometry())

const SpaceShip = memo(() => {
  const pointer = useThree((s) => s.pointer)
  const aspect = useThree((s) => s.viewport.aspect)

  const position = useGameStore((s) => s.spaceShip.position)
  const rotation = useGameStore((s) => s.spaceShip.rotation)
  const scale = useGameStore((s) => s.spaceShip.scale)
  const flightSpeed = useGameStore((s) => s.spaceShip.flightSpeed)
  const isRotation = useGameStore((s) => s.spaceShip.isRotation)
  const isClashed = useGameStore((s) => s.spaceShip.isClashed)
  const meteos = useGameStore((s) => s.meteos)
  const load = useGameStore((s) => s.load.spaceShip)
  const updateSpaceShip = useGameStore((s) => s.updateSpaceShip)
  const updateLoad = useGameStore((s) => s.updateLoad)

  const handleClick = useCallback(() => {
    updateSpaceShip({ isRotation: !isRotation })
  }, [isRotation, updateSpaceShip])

  useLayoutEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  const shipObj = useLoader(OBJLoader, spaceShipObjUrl)

  const fixSpaceShipObject = useCallback(
    (obj: Group) => {
      updateSpaceShip({
        rotation: {
          x: obj.rotation.x - Math.PI,
          y: obj.rotation.y,
          z: obj.rotation.z,
        },
        scale: {
          x: obj.scale.x / 2,
          y: obj.scale.y / 2,
          z: obj.scale.z / 2,
        },
      })
    },
    [updateSpaceShip],
  )

  useLayoutEffect(() => {
    if (!shipObj || load) return
    fixSpaceShipObject(shipObj)
    updateLoad({ spaceShip: true })
  }, [fixSpaceShipObject, load, shipObj, updateLoad])

  useGameFrame(() => {
    if (isClashed) return

    const mousemove_x = pointer.x / 2
    const mousemove_y = pointer.y / 2
    updateSpaceShip({
      isClashed: Object.values(meteos).some((me: Meteo) =>
        touchObject(me, { position, rotation, scale }),
      ),
      position: {
        ...position,
        x: mousemove_x * aspect * 14,
        y: mousemove_y * 14,
        z: position.z - flightSpeed,
      },
      rotation: {
        ...rotation,
        z: isRotation ? rotation.z + ROTATE_UNIT : rotation.z,
      },
    })
  })

  return (
    <Fragment>
      <Suspense fallback={<primitive object={fallbackObject} />}>
        <primitive
          object={shipObj}
          position={[position.x, position.y, position.z]}
          rotation={[rotation.x, rotation.y, rotation.z]}
          scale={[scale.x, scale.y, scale.z]}
        />
      </Suspense>
      <pointLight
        position={[position.x, position.y, position.z + 100]}
        distance={100}
        intensity={10}
      />
    </Fragment>
  )
})

export default SpaceShip
