import React, { useEffect, memo, useRef } from 'react'
import {
  Material,
  BufferGeometry,
  BoxBufferGeometry,
  MeshPhongMaterial,
  VertexColors,
  Color,
  Float32BufferAttribute,
  Group,
  Loader,
  Vector3,
  Euler,
  Intersection
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useLoader, useUpdate, useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { Meteo, METEOS_UPDATE, METEO_REPLACE } from '@/store/Meteolites'

const initGeoMetry = (size: number = 1): BufferGeometry => {
  const bs = Math.random() * size + 0.5
  const geometry = new BoxBufferGeometry(bs, bs, bs).toNonIndexed()
  const colors: number[] = []
  const color = new Color()
  for (let i = 0, l = geometry.attributes.position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    colors.push(color.r, color.g, color.b)
  }
  geometry.addAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}

const initMaterial = (): Material => {
  const material = new MeshPhongMaterial({
    specular: 0xffffff,
    flatShading: true,
    vertexColors: VertexColors
  })
  material.color.setHSL(
    Math.random() * 0.2 + 0.5,
    0.75,
    Math.random() * 0.25 + 0.75
  )
  return material
}

interface MeteoProps extends Meteo {
  // obj: Group
  obj: BufferGeometry
}

const Meteo = memo(
  ({ obj, position, rotation, ...rest }: MeteoProps) => {
    // LOAD OBJECT
    // return (
    //   <group position={[position.x, position.y, position.z]}>
    //     <primitive object={obj.clone()} />
    //   </group>
    // )

    // TODO: MOUSE OVER METEOLITES ACTION
    // const ref = useRef<Group>()
    // const { raycaster } = useThree()
    // const dispatch = useDispatch()
    // useFrame(() => {
    //   if (!ref.current) return
    //   const isMouseOver =
    //     raycaster.intersectObject(ref.current, true).length > 0

    //   if (isMouseOver) {
    //     dispatch(
    //       METEO_REPLACE({
    //         ...rest,
    //         position,
    //         rotation: {
    //           x: rotation.x + Math.PI,
    //           y: rotation.y + Math.PI,
    //           z: rotation.z + Math.PI
    //         }
    //       })
    //     )
    //   }
    // })
    //
    return (
      <mesh
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
      >
        <bufferGeometry attach="geometry" {...obj.clone()} />
        <meshNormalMaterial attach="material" />
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
const Meteolites = ({ objs }: { objs: BufferGeometry[] }) => {
  // LOAD OBJECT
  // const objs = [
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite1.obj')),
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite2.obj')),
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite3.obj')),
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite4.obj'))
  // ]

  // Load Draco

  const meteos = useSelector((state: RootStore) => state.meteos)
  return (
    <>
      {Object.values(meteos)
        .sort((m1: Meteo, m2: Meteo) => (m1.guid > m2.guid ? 1 : -1))
        .map((info: Meteo, i: number) => (
          <Meteo key={info.guid} obj={objs[info.pattern]} {...info} />
        ))}
    </>
  )
}
export default Meteolites
