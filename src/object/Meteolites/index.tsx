import React, { memo, useRef } from 'react'
import { BufferGeometry, Group, TextureLoader, Texture, Loader } from 'three'
import { useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { Meteo, METEO_REPLACE } from '@/store/Meteolites'
import useGameFrame from '@/hooks/useGameFrame'

interface MeteoProps extends Meteo {
  geometry: BufferGeometry
  texture?: Texture
}

const Meteo = memo(
  ({ geometry, texture, position, rotation, scale, ...rest }: MeteoProps) => {
    const ref = useRef<Group>()
    const { raycaster, camera } = useThree()
    const dispatch = useDispatch()

    useGameFrame(() => {
      if (!ref.current) return
      const isMouseOver =
        raycaster.intersectObject(ref.current, true).length > 0
      const isFrameOut = ref.current.position.z > camera.position.z
      if (!isMouseOver && !isFrameOut) return
      dispatch(
        METEO_REPLACE({
          ...rest,
          scale,
          position: isFrameOut
            ? {
                ...position,
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

    return (
      <mesh
        ref={ref}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale.x, scale.y, scale.z]}
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
