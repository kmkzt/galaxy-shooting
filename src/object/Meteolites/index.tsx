import React, { memo, useRef, useCallback } from 'react'
import { BufferGeometry, Group, TextureLoader, Texture, Loader } from 'three'
import { useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { Meteo, METEO_REPLACE, METEO_REMOVE } from '@/store/Meteolites'
import useGameFrame from '@/hooks/useGameFrame'
import { getRandom } from '@/utils/getRandom'

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
      dispatch(
        METEO_REPLACE({
          ...rest,
          guid,
          scale: isFrameOut
            ? {
                x: randomScale,
                y: randomScale,
                z: randomScale
              }
            : scale,
          position: isFrameOut
            ? {
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
            : position,
          rotation: isMouseOver
            ? {
                x: rotation.x + Math.PI * 0.05,
                y: rotation.y + Math.PI * 0.05,
                z: rotation.z + Math.PI * 0.05
              }
            : rotation
        })
      )
    })
    const handleClick = useCallback(() => {
      dispatch(METEO_REMOVE(guid))
    }, [dispatch, guid])

    return (
      <mesh
        ref={ref}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale.x, scale.y, scale.z]}
        onClick={handleClick}
        // onPointerEnter={handleClick}
      >
        <bufferGeometry attach="geometry" {...geometry} />
        {texture ? (
          <meshStandardMaterial attach="material" map={texture} />
        ) : (
          <meshStandardMaterial attach="material" color="hotpink" transparent />
        )}
      </mesh>
    )
  },
  (prev, next) =>
    prev.rotation.x === next.rotation.x &&
    prev.rotation.y === next.rotation.y &&
    prev.rotation.z === next.rotation.z &&
    prev.position.x === next.position.x &&
    prev.position.y === next.position.y &&
    prev.position.z === next.position.z
)
// TODO: Fix Texture loader
// const loaderTextureExtend = (loader: Loader) => {
//   loader.setResourcePath('./assets/textures/')
// }
const Meteolites = ({ geometries }: { geometries: BufferGeometry[] }) => {
  const meteos = useSelector((state: RootStore) => state.meteos)
  // TODO: Fix Texture loader
  // const textures: Texture[] = useLoader<any>(
  //   TextureLoader,
  //   [
  //     require('@/models/Meteolite/textures/Meteolite1.png'),
  //     require('@/models/Meteolite/textures/Meteolite2.png'),
  //     require('@/models/Meteolite/textures/Meteolite3.png'),
  //     require('@/models/Meteolite/textures/Meteolite4.png')
  //   ],
  //   loaderTextureExtend
  // )
  return (
    <>
      {Object.values(meteos).map((info: Meteo, i: number) => (
        <Meteo
          key={info.guid}
          geometry={geometries[info.pattern]}
          // texture={textures[info.pattern]}
          {...info}
        />
      ))}
    </>
  )
}
export default Meteolites
