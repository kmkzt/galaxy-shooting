import React, { Suspense, useRef, useEffect, memo, useState } from 'react'
import { Group, Vector3, Euler } from 'three'
import { useLoader, useFrame, useUpdate } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { RootStore } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'

// Fallback Spaceship object
// const genDammySpaceShip = (): Mesh =>
//   new Mesh(new BoxGeometry(1, 0.2, 0.2), new MeshNormalMaterial())

const SpaceShip = memo(({ obj }: { obj: Group }) => {
  const { position, rotation, scale } = useSelector(
    (state: RootStore) => state.spaceShip
  )

  return (
    <primitive
      object={obj}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
    />
  )
})

export default SpaceShip
