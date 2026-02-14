import { Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { lazy, Suspense } from 'react'
import { Fog } from 'three'
import ControlCamera from './camera/ControlCamera'
import MapCamera from './camera/MapCamera'

const SpaceShip = lazy(() => import('./spaceship'))
const Meteolites = lazy(() => import('./meteolites'))
const Lasers = lazy(() => import('./lasers'))

const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5

const defaultCameraOption = {
  position: [0, 0, CAMERA_DISTANCE] as [number, number, number],
  near: NEAR,
  far: FAR,
  fov: FOV,
}

const GameApp = () => {
  return (
    <>
      <ControlCamera {...defaultCameraOption} />
      <MapCamera {...defaultCameraOption} />
      <Suspense fallback={null}>
        <SpaceShip />
        <Meteolites num={100} />
        <Lasers />
      </Suspense>
      <hemisphereLight args={[0x999999, 0x222222, 0.6]} position={[0, 0, 10]} />
      <Stats />
    </>
  )
}

const Scene = () => (
  <Canvas
    camera={defaultCameraOption}
    dpr={window.devicePixelRatio}
    onCreated={({ scene }) => {
      scene.fog = new Fog(0x000000, NEAR, FAR)
    }}
  >
    <GameApp />
  </Canvas>
)

export default Scene
