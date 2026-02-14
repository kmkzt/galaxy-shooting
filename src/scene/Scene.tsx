import polyfill from '@juggle/resize-observer'
import { type FC, lazy, Suspense } from 'react'
import { Provider } from 'react-redux'
import { Canvas } from 'react-three-fiber'
import { Fog } from 'three'
import store from '@/store'
import ControlCamera from './Camera/ControlCamera'
import MapCamera from './Camera/MapCamera'
import useElementMouse from './Mouse'
import StatsDom from './StatsDom'

const Models = lazy(() => import('./Models'))
/**
 * Camera
 */
const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5

const defaultCameraOption = {
  position: [0, 0, CAMERA_DISTANCE],
  near: NEAR,
  far: FAR,
  fov: FOV,
}

const GameApp = () => {
  useElementMouse({ el: document.getElementById('app') })
  return (
    <>
      <ControlCamera {...defaultCameraOption} />
      <MapCamera {...defaultCameraOption} />
      <Suspense fallback={null}>
        <Models />
      </Suspense>
      <hemisphereLight
        args={[0x999999, 0x222222, 0x999999]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <StatsDom />
    </>
  )
}
const GamePanel: FC = () => (
  <Canvas
    // concurrent={true} // react conncurrentMode
    orthographic={false}
    // https://github.com/react-spring/react-three-fiber/issues/208
    // TODO: Remove camera option
    camera={defaultCameraOption}
    onCreated={({ scene }) => {
      scene.fog = new Fog(0x000000, NEAR, FAR)
    }}
    pixelRatio={window.devicePixelRatio}
    resize={{ polyfill } as any}
  >
    <Provider store={store}>
      <GameApp />
    </Provider>
  </Canvas>
)

export default GamePanel
