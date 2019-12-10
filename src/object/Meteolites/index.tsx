import React, { useEffect, memo } from 'react'
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
  Euler
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useLoader, useUpdate, useFrame } from 'react-three-fiber'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { Meteo, METEOS_UPDATE } from '@/store/Meteolites'

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
const setDracoResourcePath = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('/libs/draco/')
  }
}

interface MeteoProps extends Meteo {
  // obj: Group
  obj: BufferGeometry
}
const Meteo = ({ obj, position, rotation }: MeteoProps) => {
  return (
    // LOAD OBJECT
    // <group position={[me.position.x, me.position.y, me.position.z]}>
    //   <primitive object={obj.clone()} />
    // </group>
    <mesh position={[position.x, position.y, position.z]}>
      <bufferGeometry attach="geometry" {...obj.clone()} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}
const Meteolites = () => {
  // LOAD OBJECT
  // const objs = [
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite1.obj')),
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite2.obj')),
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite3.obj')),
  //   useLoader(OBJLoader, require('@/models/Meteolite/Meteolite4.obj'))
  // ]

  // Load Draco
  const objs = [
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite1.drc'),
      setDracoResourcePath
    ),
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite2.drc'),
      setDracoResourcePath
    ),
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite3.drc'),
      setDracoResourcePath
    ),
    useLoader(
      DRACOLoader,
      require('@/models/Meteolite/Meteolite4.drc'),
      setDracoResourcePath
    )
  ]
  const meteos = useSelector((state: RootStore) => state.meteos)
  return (
    <>
      {Object.values(meteos).map((info: Meteo, i: number) => (
        <Meteo key={info.guid} obj={objs[info.pattern]} {...info} />
      ))}
    </>
  )
}
export default Meteolites
