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
import { getRandom } from '@/utils/getRandom'
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
  const fixSpaceShipObject = useCallback(
    (obj: Group) => {
      dispatch(
        SPACESHIP_UPDATE({
          rotation: {
            x: obj.rotation.x - Math.PI,
            y: obj.rotation.y,
            z: obj.rotation.z
          },
          scale: {
            x: obj.scale.x / 2,
            y: obj.scale.y / 2,
            z: obj.scale.z / 2
          }
        })
      )
    },
    [dispatch]
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
    fixSpaceShipObject(shipObj)
    dispatch(
      LOAD_UPDATE({
        spaceShip: true
      })
    )
  }, [dispatch, fixSpaceShipObject, load.spaceShip, shipObj])

  /**
   * LOAD METEOLITES
   */
  const meteoliteObjs: BufferGeometry[] = useLoader<any>(
    DRACOLoader,
    [
      require('@/models/Meteolite/Meteolite1.drc'),
      require('@/models/Meteolite/Meteolite2.drc'),
      require('@/models/Meteolite/Meteolite3.drc'),
      require('@/models/Meteolite/Meteolite4.drc')
    ],
    dracoLoaderExtend
  )
  const createMeteosData = useCallback(() => {
    const meteoData: MeteoState = Array(meteosOption.num)
      .fill(null)
      .reduce((res: MeteoState, _: null, i: number): MeteoState => {
        const CAMERA_DISTANCE = camera.near + 5
        const pattern = Math.floor(Math.random() * meteoliteObjs.length)
        const randomScale = getRandom({ min: 0.5, max: 2 })
        return {
          ...res,
          [i]: {
            guid: i,
            position: {
              x: getRandom({
                min: (-CAMERA_DISTANCE * aspect) / 2,
                max: (CAMERA_DISTANCE * aspect) / 2
              }),
              y: getRandom({
                min: -CAMERA_DISTANCE / 2,
                max: CAMERA_DISTANCE / 2
              }),
              z: getRandom({ min: camera.far, max: camera.far * 2 })
            },
            rotation: {
              x: 0,
              y: 0,
              z: 0
            },
            scale: {
              x: randomScale,
              y: randomScale,
              z: randomScale
            },
            pattern
          }
        }
      }, {})
    dispatch(METEOS_UPDATE(meteoData))
  }, [
    aspect,
    camera.far,
    camera.near,
    dispatch,
    meteoliteObjs.length,
    meteosOption.num
  ])
  useLayoutEffect(() => {
    if (!meteoliteObjs || load.meteolites) return
    meteoliteObjs.map((obj: BufferGeometry, i: number) => {
      obj
    })
    createMeteosData()
    dispatch(
      LOAD_UPDATE({
        meteolites: true
      })
    )
  }, [aspect, createMeteosData, dispatch, load.meteolites, meteoliteObjs])

  return {
    ship: shipObj,
    meteos: {
      geometries: meteoliteObjs
    }
  }
}
