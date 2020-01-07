import polyfill from '@juggle/resize-observer'
import { Color, Fog } from 'three'
import React, { FC, Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import { Canvas } from 'react-three-fiber'
import store from '@/store'
import StatsDom from './StatsDom'

const GameApp = lazy(() => import('./app'))
/**
 * Camera
 */
const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5

const GamePanel: FC = () => {
  return (
    <Canvas
      // concurrent={true} // react conncurrentMode
      orthographic={false}
      // https://github.com/react-spring/react-three-fiber/issues/208
      camera={{
        position: [0, 0, CAMERA_DISTANCE],
        near: NEAR,
        far: FAR,
        fov: FOV
      }}
      onCreated={({ scene }) => {
        scene.background = new Color(0x333366)
        scene.fog = new Fog(0x000000, NEAR, FAR)
      }}
      pixelRatio={window.devicePixelRatio}
      resize={{ polyfill } as any}
    >
      <Provider store={store}>
        <Suspense fallback={null}>
          <GameApp />
          <StatsDom />
        </Suspense>
      </Provider>
    </Canvas>
  )
}

export default GamePanel