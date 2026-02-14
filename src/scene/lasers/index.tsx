import { useThree } from '@react-three/fiber'
import { useCallback, useLayoutEffect } from 'react'
import { BoxGeometry, Color, MeshBasicMaterial } from 'three'
import useGameFrame from '../../hooks/useGameFrame'
import { touchObject } from '../../logic/collision'
import type { Laser, Meteo } from '../../store/gameStore'
import { useGameStore } from '../../store/gameStore'

const geometry = new BoxGeometry(0.3, 0.3, 10)
const material = new MeshBasicMaterial({ color: new Color('lightgreen') })

const LaserComponent = ({ guid, position, rotation: _rotation, scale: _scale }: Laser) => {
  const camera = useThree((s) => s.camera)

  useGameFrame(() => {
    const { spaceShip, meteos, removeLaser, replaceLaser, replaceMeteo, removeMeteo, incPoint } =
      useGameStore.getState()

    if (spaceShip.position.z - camera.far > position.z) {
      removeLaser(guid)
      return
    }

    const breakMeteo = Object.values(meteos).find((me: Meteo) =>
      touchObject(me, {
        position,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 10 + spaceShip.flightSpeed },
      }),
    )

    if (breakMeteo) {
      replaceMeteo({ ...breakMeteo, color: new Color('red') })
      setTimeout(() => {
        incPoint(Math.floor(breakMeteo.scale.x * 100))
        removeMeteo(breakMeteo.guid)
      }, 100)
      removeLaser(guid)
      return
    }

    replaceLaser({
      guid,
      position: { ...position, z: position.z - spaceShip.flightSpeed - 5 },
    })
  })

  return (
    <mesh position={[position.x, position.y, position.z]} geometry={geometry} material={material} />
  )
}

const Lasers = () => {
  const lasers = useGameStore((s) => s.lasers)
  const addLaser = useGameStore((s) => s.addLaser)

  const handleClick = useCallback(() => {
    const { spaceShip, isGameActive } = useGameStore.getState()
    if (!isGameActive()) return
    addLaser({
      position: spaceShip.position,
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.3, y: 0.3, z: 10 },
    })
  }, [addLaser])

  useLayoutEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  return (
    <>
      {Object.values(lasers).map(({ guid, ...info }) => (
        <LaserComponent key={guid} guid={guid} {...info} />
      ))}
    </>
  )
}

export default Lasers
