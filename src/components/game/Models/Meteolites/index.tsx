import React, {
  memo,
  useRef,
  useCallback,
  useLayoutEffect,
  Suspense
} from 'react'
import { useThree, useLoader } from 'react-three-fiber'
import { BufferGeometry, Group, TextureLoader, Texture, Loader } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import {
  Meteo,
  METEO_REPLACE,
  METEOS_UPDATE,
  State as MeteoState
} from '@/store/Meteolites'
import useGameFrame from '@/hooks/useGameFrame'
import { getRandom } from '@/utils/getRandom'
import { LOAD_UPDATE } from '@/store/Load'

const dracoLoaderExtend = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('./libs/draco/')
  }
}

interface MeteoProps extends Meteo {
  geometry: BufferGeometry
  texture?: Texture
}

const Meteo = memo(
  ({
    guid,
    geometry,
    texture,
    position,
    rotation,
    scale,
    color,
    ...rest
  }: MeteoProps) => {
    const ref = useRef<Group>()
    const { raycaster, camera, aspect } = useThree()
    const dispatch = useDispatch()

    useGameFrame(() => {
      if (!ref.current) return
      const isMouseOver =
        raycaster.intersectObject(ref.current, true).length > 0
      const isFrameOut = ref.current.position.z > camera.position.z

      if (!isMouseOver && !isFrameOut) return
      const CAMERA_DISTANCE = camera.near + 5
      const randomScale = getRandom({ min: 0.5, max: 2 })
      const updateScale = {
        x: randomScale,
        y: randomScale,
        z: randomScale
      }

      const updatePosition = {
        x: getRandom({
          min: (-CAMERA_DISTANCE * aspect) / 2,
          max: (CAMERA_DISTANCE * aspect) / 2
        }),
        y: getRandom({
          min: -CAMERA_DISTANCE / 2,
          max: CAMERA_DISTANCE / 2
        }),
        z: position.z - camera.far
      }
      const updateRotation = {
        x: rotation.x + Math.PI * 0.05,
        y: rotation.y + Math.PI * 0.05,
        z: rotation.z + Math.PI * 0.05
      }
      dispatch(
        METEO_REPLACE({
          ...rest,
          guid,
          scale: isFrameOut ? updateScale : scale,
          position: isFrameOut ? updatePosition : position,
          rotation: isMouseOver ? updateRotation : rotation
        })
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
        <meshStandardMaterial
          attach="material"
          color={color || 'hotpink'}
          transparent
        />
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
    prev.color === next.color
)

const Meteolites = ({ num }: { num: number }) => {
  const { camera, aspect } = useThree()
  const load = useSelector((state: RootStore) => state.load.meteolites)
  const meteos = useSelector((state: RootStore) => state.meteos)
  const dispatch = useDispatch()
  /**
   * LOAD METEOLITES
   */
  const geometries: BufferGeometry[] = useLoader<any>(
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
    const meteoData: MeteoState = Array(num)
      .fill(null)
      .reduce((res: MeteoState, _: null, i: number): MeteoState => {
        const CAMERA_DISTANCE = camera.near + 5
        const pattern = Math.floor(Math.random() * geometries.length)
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
  }, [aspect, camera.far, camera.near, dispatch, geometries.length, num])

  useLayoutEffect(() => {
    if (!geometries || load) return
    geometries.map((obj: BufferGeometry, i: number) => {
      obj
    })
    createMeteosData()
    dispatch(
      LOAD_UPDATE({
        meteolites: true
      })
    )
  }, [createMeteosData, dispatch, load, geometries])
  return (
    <>
      {Object.values(meteos).map((info: Meteo, i: number) => (
        <Suspense key={info.guid} fallback={null}>
          <Meteo
            geometry={geometries[info.pattern]}
            // texture={textures[info.pattern]}
            {...info}
          />
        </Suspense>
      ))}
    </>
  )
}
export default Meteolites
