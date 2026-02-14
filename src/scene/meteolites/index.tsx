import { useLoader, useThree } from '@react-three/fiber'
import { memo, Suspense, useLayoutEffect, useRef } from 'react'
import type { BufferGeometry, Texture } from 'three'
import { type Group, IcosahedronGeometry, type Loader } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import useGameFrame from '../../hooks/useGameFrame'
import useMeteoData from '../../hooks/useMeteoData'
import { getRandom } from '../../logic/random'
import type { Meteo } from '../../store/gameStore'
import { useGameStore } from '../../store/gameStore'
import drc1 from './assets/drc/Meteolite1.drc?url'
import drc2 from './assets/drc/Meteolite2.drc?url'
import drc3 from './assets/drc/Meteolite3.drc?url'
import drc4 from './assets/drc/Meteolite4.drc?url'

const dracoLoaderExtend = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  }
}

interface MeteoProps extends Meteo {
  geometry: BufferGeometry
  texture?: Texture
}

const MeteoComponent = memo(
  ({ guid, geometry, position, rotation, scale, color, ...rest }: MeteoProps) => {
    const ref = useRef<Group>(null)
    const aspect = useThree((s) => s.viewport.aspect)
    const raycaster = useThree((s) => s.raycaster)
    const replaceMeteo = useGameStore((s) => s.replaceMeteo)

    useGameFrame(({ camera }) => {
      if (!ref.current) return
      const mainCameraPosition = useGameStore.getState().cam.position
      const isMouseOver = raycaster.intersectObject(ref.current, true).length > 0
      const isFrameOut = ref.current.position.z > mainCameraPosition.z

      if (!isMouseOver && !isFrameOut) return

      const CAMERA_DISTANCE = camera.near + 5
      const randomScale = getRandom({ min: 0.5, max: 2 })
      const updateScale = { x: randomScale, y: randomScale, z: randomScale }
      const updatePosition = {
        x: getRandom({ min: (-CAMERA_DISTANCE * aspect) / 2, max: (CAMERA_DISTANCE * aspect) / 2 }),
        y: getRandom({ min: -CAMERA_DISTANCE / 2, max: CAMERA_DISTANCE / 2 }),
        z: position.z - camera.far,
      }
      const updateRotation = {
        x: rotation.x + Math.PI * 0.05,
        y: rotation.y + Math.PI * 0.05,
        z: rotation.z + Math.PI * 0.05,
      }

      replaceMeteo({
        ...rest,
        guid,
        scale: isFrameOut ? updateScale : scale,
        position: isFrameOut ? updatePosition : position,
        rotation: isMouseOver ? updateRotation : rotation,
      })
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

const fallbackGeometry = new IcosahedronGeometry()

const Meteolites = ({ num }: { num: number }) => {
  const load = useGameStore((s) => s.load.meteolites)
  const meteos = useGameStore((s) => s.meteos)
  const updateLoad = useGameStore((s) => s.updateLoad)

  const geometries = useLoader(DRACOLoader, [drc1, drc2, drc3, drc4], dracoLoaderExtend)

  const { set: createMeteosData } = useMeteoData({
    patternNum: geometries.length,
  })

  useLayoutEffect(() => {
    if (!geometries || load) return
    createMeteosData(num)
    updateLoad({ meteolites: true })
  }, [createMeteosData, load, geometries, num, updateLoad])

  return (
    <>
      {Object.values(meteos).map((info: Meteo) => (
        <Suspense
          key={info.guid}
          fallback={<MeteoComponent geometry={fallbackGeometry} {...info} />}
        >
          <MeteoComponent geometry={geometries[info.pattern]} {...info} />
        </Suspense>
      ))}
    </>
  )
}

export default Meteolites
