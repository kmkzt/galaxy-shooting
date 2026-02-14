import { memo, Suspense, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLoader, useThree } from 'react-three-fiber'
import {
  type BufferGeometry,
  type Geometry,
  type Group,
  IcosahedronGeometry,
  type Loader,
  type Texture,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import useGameFrame from '@/hooks/useGameFrame'
import useMeteoData from '@/hooks/useMeteoData'
import type { RootStore } from '@/store'
import { LOAD_UPDATE } from '@/store/Load'
import { METEO_REPLACE, type Meteo } from '@/store/Meteolites'
import { getRandom } from '@/utils/getRandom'

const dracoLoaderExtend = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('./libs/draco/')
  }
}

interface MeteoProps extends Meteo {
  geometry: BufferGeometry | Geometry
  texture?: Texture
}

const MeteoComponent = memo(
  ({ guid, geometry, texture, position, rotation, scale, color, ...rest }: MeteoProps) => {
    const ref = useRef<Group>()
    const { raycaster, aspect } = useThree()
    const dispatch = useDispatch()
    const mainCameraPostion = useSelector((state: RootStore) => state.cam.position)
    useGameFrame(({ camera }) => {
      if (!ref.current) return
      const isMouseOver = raycaster.intersectObject(ref.current, true).length > 0
      const isFrameOut = ref.current.position.z > mainCameraPostion.z

      if (!isMouseOver && !isFrameOut) return
      const CAMERA_DISTANCE = camera.near + 5
      const randomScale = getRandom({ min: 0.5, max: 2 })
      const updateScale = {
        x: randomScale,
        y: randomScale,
        z: randomScale,
      }

      const updatePosition = {
        x: getRandom({
          min: (-CAMERA_DISTANCE * aspect) / 2,
          max: (CAMERA_DISTANCE * aspect) / 2,
        }),
        y: getRandom({
          min: -CAMERA_DISTANCE / 2,
          max: CAMERA_DISTANCE / 2,
        }),
        z: position.z - camera.far,
      }
      const updateRotation = {
        x: rotation.x + Math.PI * 0.05,
        y: rotation.y + Math.PI * 0.05,
        z: rotation.z + Math.PI * 0.05,
      }
      dispatch(
        METEO_REPLACE({
          ...rest,
          guid,
          scale: isFrameOut ? updateScale : scale,
          position: isFrameOut ? updatePosition : position,
          rotation: isMouseOver ? updateRotation : rotation,
        }),
      )
    })

    return (
      <mesh
        ref={ref}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale.x, scale.y, scale.z]}
      >
        <bufferGeometry attach="geometry" {...geometry} />
        <meshLambertMaterial attach="material" color={color || 'lightblue'} transparent />
      </mesh>
    )
  },
  (prev, next) =>
    prev.rotation.x === next.rotation.x &&
    prev.rotation.y === next.rotation.y &&
    prev.rotation.z === next.rotation.z &&
    prev.position.x === next.position.x &&
    prev.position.y === next.position.y &&
    prev.position.z === next.position.z &&
    prev.color === next.color,
)

const fallbackGeometry: Geometry = new IcosahedronGeometry()
const Meteolites = ({ num }: { num: number }) => {
  const load = useSelector((state: RootStore) => state.load.meteolites)
  const meteos = useSelector((state: RootStore) => state.meteos)
  const dispatch = useDispatch()

  /**
   * LOAD METEOLITES
   */
  const geometries: BufferGeometry[] = useLoader<any>(
    DRACOLoader,
    [
      require('./drc/Meteolite1.drc'),
      require('./drc/Meteolite2.drc'),
      require('./drc/Meteolite3.drc'),
      require('./drc/Meteolite4.drc'),
    ],
    dracoLoaderExtend,
  )

  const { set: createMeteosData } = useMeteoData({
    patternNum: geometries.length,
  })

  useLayoutEffect(() => {
    if (!geometries || load) return
    for (const _obj of geometries) {
      // geometry iteration (no-op for now, geometries loaded via useLoader)
    }
    createMeteosData(num)
    dispatch(
      LOAD_UPDATE({
        meteolites: true,
      }),
    )
  }, [createMeteosData, dispatch, load, geometries, num])
  return (
    <>
      {Object.values(meteos).map((info: Meteo, _i: number) => {
        return (
          <Suspense
            key={info.guid}
            fallback={() => <MeteoComponent geometry={fallbackGeometry} {...info} />}
          >
            <MeteoComponent
              geometry={geometries[info.pattern]}
              // texture={textures[info.pattern]}
              {...info}
            />
          </Suspense>
        )
      })}
    </>
  )
}
export default Meteolites
