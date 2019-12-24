import React, { memo, Fragment, useCallback, useEffect, useState } from 'react'
import { useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import useGameFrame from '@/hooks/useGameFrame'
import { BoxBufferGeometry, Color, MeshBasicMaterial } from 'three'
import { Meteo, METEO_REMOVE } from '@/store/Meteolites'
import { touchObject } from '@/utils/touchObject'

const geometry = new BoxBufferGeometry(0.3, 0.3, 10)
const material = new MeshBasicMaterial({ color: new Color('lightgreen') })

const Laser = () => {
  const { camera } = useThree()
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const { position: shipPosition, flightSpeed, isClashed } = useSelector(
    (state: RootStore) => state.spaceShip
  )
  const meteos = useSelector((state: RootStore) => state.meteos)
  const handleClick = useCallback(() => {
    const { x, y, z } = shipPosition
    setPosition({ x, y, z })
  }, [shipPosition])
  const dispatch = useDispatch()
  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])
  useGameFrame(() => {
    if (isClashed) return
    const breakMeteo = Object.values(meteos).find((me: Meteo) =>
      touchObject(me, {
        position,
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        scale: {
          x: 0.3,
          y: 0.3,
          z: 10
        }
      })
    )
    if (breakMeteo) {
      dispatch(METEO_REMOVE(breakMeteo.guid))
    }
    if (shipPosition.z + camera.far > position.z) {
      setPosition({ ...position, z: position.z - flightSpeed - 5 })
    }
  })
  return (
    <mesh
      position={[position.x, position.y, position.z]}
      geometry={geometry}
      material={material}
    />
  )
}

export default Laser
