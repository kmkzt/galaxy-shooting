import React, {
  useEffect,
  useCallback,
  FC,
  Suspense,
  useLayoutEffect
} from 'react'
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

const loaderExtend = (loader: Loader) => {
  // loader.setResourcePath('./assets/textures/')
}
const dracoLoaderExtend = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('./libs/draco/')
  }
  loaderExtend(loader)
}

interface UseObjectOption {
  meteosOption: {
    num: number
  }
}

interface UseObjectResult {
  ship: Group
  meteos: {
    geometries: BufferGeometry[]
  }
}
export default function useObject({
  meteosOption
}: UseObjectOption): UseObjectResult {
  const { camera, aspect } = useThree()
  const load = useSelector((state: RootStore) => state.load)
  const dispatch = useDispatch()

  /**
   * LOAD SPACESHIP
   */
  const shipObj = useLoader<Group>(
    OBJLoader,
    require('@/models/SpaceShip/spaceShip.obj'),
    loaderExtend
  )

  useLayoutEffect(() => {
    if (!shipObj || load.spaceShip) return
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
  const meteoliteObjs: BufferGeometry[] = useLoader<BufferGeometry[]>(
    DRACOLoader,
    [
      require('@/models/Meteolite/Meteolite1.drc'),
      require('@/models/Meteolite/Meteolite2.drc'),
      require('@/models/Meteolite/Meteolite3.drc'),
      require('@/models/Meteolite/Meteolite4.drc')
    ],
    dracoLoaderExtend
  )
  useLayoutEffect(() => {
    if (!meteoliteObjs || load.meteolites) return
    meteoliteObjs.map((obj: BufferGeometry, i: number) => {
      obj
    })
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

  return {
    ship: shipObj,
    meteos: {
      geometries: meteoliteObjs
    }
  }
}
