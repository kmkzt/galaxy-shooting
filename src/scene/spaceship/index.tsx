import { Fragment, memo, Suspense, useCallback, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLoader, useThree } from 'react-three-fiber'
import { ConeGeometry, type Group, type Loader, Mesh } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import useGameFrame from '@/hooks/useGameFrame'
import type { RootStore } from '@/store'
import { LOAD_UPDATE } from '@/store/Load'
import type { Meteo } from '@/store/Meteolites'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'
import { touchObject } from '@/utils/touchObject'

const loaderExtend = (_loader: Loader) => {
  // loader.setResourcePath('./assets/textures/')
}
/**
 * SPACE_CHIP CONSTANT
 */
const ROTATE_UNIT = 0.1

const fallbackObject = new Mesh(new ConeGeometry())
const SpaceShip = memo(() => {
  const { mouse, aspect } = useThree()
  const { position, rotation, scale, flightSpeed, isRotation, isClashed } = useSelector(
    (state: RootStore) => state.spaceShip,
  )
  const meteos = useSelector((state: RootStore) => state.meteos)
  const dispatch = useDispatch()
  const load = useSelector((state: RootStore) => state.load.spaceShip)
  const handleClick = useCallback(() => {
    dispatch(
      SPACESHIP_UPDATE({
        isRotation: !isRotation,
      }),
    )
  }, [dispatch, isRotation])
  useLayoutEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  /**
   * LOAD SPACESHIP
   */
  const shipObj = useLoader<Group>(OBJLoader, require('./obj/spaceShip.obj'), loaderExtend)
  const fixSpaceShipObject = useCallback(
    (obj: Group) => {
      dispatch(
        SPACESHIP_UPDATE({
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
        }),
      )
    },
    [dispatch],
  )
  useLayoutEffect(() => {
    if (!shipObj || load) return
    // TODO: Fix texture loader
    // const loader = new TextureLoader()
    // const texture: Texture = loader.load(
    //   require('@/models/SpaceShip/textures/F15A.jpg')
    // )
    // shipObj.traverse(child => {
    //   if ((child as any).isMesh) {
    //     ;((child as Mesh).material as any).normalMap = texture
    //   }
    // })
    fixSpaceShipObject(shipObj)
    dispatch(
      LOAD_UPDATE({
        spaceShip: true,
      }),
    )
  }, [dispatch, fixSpaceShipObject, load, shipObj])

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
            scale,
          }),
        ),
        // spaceShip Moving
        position: {
          ...position,
          x: mousemove_x * aspect * 14,
          y: mousemove_y * 14,
          z: position.z - flightSpeed,
        },
        // spaceShip rotation
        rotation: {
          ...rotation,
          z: isRotation ? rotation.z + ROTATE_UNIT : rotation.z,
        },
      }),
    )
  })
  return (
    <Fragment>
      <Suspense fallback={() => <primitive object={fallbackObject} />}>
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
