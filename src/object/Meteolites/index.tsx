import React, { useEffect } from 'react'
import {
  Material,
  BufferGeometry,
  BoxBufferGeometry,
  MeshPhongMaterial,
  VertexColors,
  Color,
  Float32BufferAttribute,
  Group
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { useLoader } from 'react-three-fiber'
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

const Meteolites = () => {
  const objs = [
    useLoader(OBJLoader, require('@/models/Meteolite/Meteolite1.obj')),
    useLoader(OBJLoader, require('@/models/Meteolite/Meteolite2.obj')),
    useLoader(OBJLoader, require('@/models/Meteolite/Meteolite3.obj')),
    useLoader(OBJLoader, require('@/models/Meteolite/Meteolite4.obj'))
  ]
  const meteos = useSelector((state: RootStore) => state.meteos)
  return (
    <>
      {meteos.map(({ pattern, ...me }: Meteo, i: number) => (
        <group key={i} position={[me.position.x, me.position.y, me.position.z]}>
          <primitive object={objs[pattern].clone()} />
        </group>
      ))}
    </>
  )
}
export default Meteolites
