import React, { memo, Fragment, useCallback, useEffect } from 'react'
import { useThree } from 'react-three-fiber'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '@/store'
import useGameFrame from '@/hooks/useGameFrame'
import { BoxBufferGeometry, Color, MeshBasicMaterial } from 'three'
import { Meteo, METEO_REMOVE } from '@/store/Meteolites'
import { touchObject } from '@/utils/touchObject'
import { Laser, LASER_REPLACE, LASER_ADD, LASER_REMOVE } from '@/store/Lasers'

const geometry = new BoxBufferGeometry(0.3, 0.3, 10)
const material = new MeshBasicMaterial({ color: new Color('lightgreen') })

const Laser = ({ guid, position, rotation, scale }: Laser) => {
  const { camera } = useThree()
  const { position: shipPosition, flightSpeed, isClashed } = useSelector(
    (state: RootStore) => state.spaceShip
  )
  const meteos = useSelector((state: RootStore) => state.meteos)
  const dispatch = useDispatch()

  useGameFrame(() => {
    /**
     * Laser Frame Out
     */
    if (shipPosition.z - camera.far > position.z) {
      dispatch(LASER_REMOVE(guid))
      return
    }
    /**
     * Break Meteolites
     */
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
      dispatch(LASER_REMOVE(guid))
      return
    }
    /**
     * Laser Move
     */
    const updatePosition = { ...position, z: position.z - flightSpeed - 5 }
    dispatch(
      LASER_REPLACE({
        guid,
        position: updatePosition
      })
    )
  })
  return (
    <mesh
      position={[position.x, position.y, position.z]}
      geometry={geometry}
      material={material}
    />
  )
}

const Lasers = () => {
  const { position: shipPosition } = useSelector(
    (state: RootStore) => state.spaceShip
  )
  const dispatch = useDispatch()
  const handleClick = useCallback(() => {
    dispatch(
      LASER_ADD({
        position: shipPosition,
        scale: {
          x: 0.3,
          y: 0.3,
          z: 10
        }
      } as any)
    )
  }, [dispatch, shipPosition])
  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  const lasers = useSelector((state: RootStore) => state.lasers)
  /**
   * Laser Count Debug
   */
  // const debug = useMemo(() => Object.keys(lasers).length, [lasers])
  // useEffect(() => {
  //   console.log(lasers)
  // }, [debug, lasers])
  return (
    <>
      {Object.values(lasers).map(({ guid, ...info }) => (
        <Laser key={guid} guid={guid} {...info} />
      ))}
    </>
  )
}
export default Lasers