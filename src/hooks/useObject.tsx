import React, { useEffect, useCallback, FC, Suspense } from 'react'
import {
  Loader,
  BufferGeometry,
  Group,
  Mesh,
  TextureLoader,
  Texture
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useSelector, useDispatch } from 'react-redux'
import { useThree, useLoader } from 'react-three-fiber'
import { RootStore } from '@/store'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'
import { METEOS_UPDATE, State as MeteoState } from '@/store/Meteolites'
import { getRandomPosition } from '@/utils/getRandomPostion'
import { LOAD_UPDATE } from '@/store/Load'

const setResourcePath = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('./libs/draco/')
  }
  loader.setResourcePath('./assets/textures')
}

interface UseObjectOption {
  meteosOption: {
    num: number
  }
}

export default function useObject({
  meteosOption
}: UseObjectOption): { ship: Group; meteos: BufferGeometry[] } {
  const { camera, aspect } = useThree()
  const load = useSelector((state: RootStore) => state.load)
  const dispatch = useDispatch()

  /**
   * LOAD SPACESHIP
   */
  const shipObj = useLoader(
    OBJLoader,
    require('@/models/SpaceShip/spaceShip.obj'),
    setResourcePath
  )

  useEffect(() => {
    if (!shipObj || load.spaceShip) return
    new TextureLoader().load(
      require('@/models/SpaceShip/textures/F15D.jpg'),
      tx => {
        shipObj.traverse(child => {
          if ((child as any).isMesh) {
            ;((child as Mesh).material as any).normalMap = tx
          }
        })
      },
      undefined,
      err => {
        console.error(err)
      }
    )

    dispatch(
      SPACESHIP_UPDATE({
        rotation: {
          x: shipObj.rotation.x - Math.PI,
          y: shipObj.rotation.y,
          z: shipObj.rotation.z
        },
        scale: {
          x: shipObj.scale.x / 2,
          y: shipObj.scale.y / 2,
          z: shipObj.scale.z / 2
        }
      })
    )
    dispatch(
      LOAD_UPDATE({
        spaceShip: true
      })
    )
  }, [dispatch, load.spaceShip, shipObj])

  /**
   * LOAD METEOLITES
   */
  const meteoliteObjs = [
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite1.drc'),
      setResourcePath
    ),
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite2.drc'),
      setResourcePath
    ),
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite3.drc'),
      setResourcePath
    ),
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite4.drc'),
      setResourcePath
    )
  ]
  useEffect(() => {
    if (!meteoliteObjs || load.meteolites) return
    const meteoData: MeteoState = Array(meteosOption.num)
      .fill(null)
      .reduce((res: MeteoState, _: null, i: number): MeteoState => {
        const CAMERA_DISTANCE = camera.near + 5
        const pattern = Math.floor(Math.random() * meteoliteObjs.length)
        return {
          ...res,
          [i]: {
            guid: i,
            position: getRandomPosition(
              {
                x: CAMERA_DISTANCE * aspect,
                y: CAMERA_DISTANCE,
                z: camera.far
              },
              {
                z: camera.far
              }
            ),
            rotation: {
              x: 0,
              y: 0,
              z: 0
            },
            scale: {
              x: 1,
              y: 1,
              z: 1
            },
            pattern
          }
        }
      }, {})
    dispatch(METEOS_UPDATE(meteoData))
    dispatch(
      LOAD_UPDATE({
        meteolites: true
      })
    )
  }, [
    aspect,
    camera.far,
    camera.near,
    dispatch,
    load.meteolites,
    meteoliteObjs,
    meteoliteObjs.length,
    meteosOption.num
  ])

  return { ship: shipObj, meteos: meteoliteObjs }
}
