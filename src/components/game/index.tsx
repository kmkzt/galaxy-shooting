import polyfill from '@juggle/resize-observer'
import { Color, Fog } from 'three'
import React, {
  Fragment,
  useCallback,
  FC,
  Suspense,
  useLayoutEffect
} from 'react'
import { Provider, useSelector } from 'react-redux'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import store, { RootStore } from '@/store'
import useObject from '@/hooks/useObject'
import Lasers from './Lasers'
import StatsDom from './StatsDom'
import SpaceShip from './SpaceShip'
import Meteolites from './Meteolites'
import Point from './Point'

/**
 * Camera
 */
const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5
const app = document.getElementById('app') as HTMLElement

function Game() {
  const { camera, raycaster, mouse } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )

  /**
   * HANDLE MOUSE
   */
  const handleMouse = useCallback(
    (x: number, y: number) => {
      const rect = app.getBoundingClientRect()
      /**
       * Mouse Point 2D
       */
      mouse.x = ((x - rect.left) / rect.width) * 2 - 1
      mouse.y = -((y - rect.top) / rect.height) * 2 + 1

      /**
       * SET Raycaster
       */
      raycaster.setFromCamera(mouse, camera)
    },
    [camera, mouse, raycaster]
  )
  const handlePointerMove = useCallback(
    (e: PointerEvent | MouseEvent) => {
      e.preventDefault()
      handleMouse(e.clientX, e.clientY)
    },
    [handleMouse]
  )
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const t: Touch = e.touches[0]
      handleMouse(t.clientX, t.clientY)
    },
    [handleMouse]
  )
  /**
   * LOAD OBJECT
   */
  const {
    ship: shipObj,
    meteos: { geometries: meteoliteGeometries }
  } = useObject({
    meteosOption: {
      num: 100
    }
  })
  /**
   * EventListner
   */
  useLayoutEffect(() => {
    app.addEventListener('pointermove', handlePointerMove)
    app.addEventListener('mousemove', handlePointerMove)
    app.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      app.removeEventListener('pointermove', handlePointerMove)
      app.removeEventListener('mousemove', handlePointerMove)
      app.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handlePointerMove, handleTouchMove])

  /**
   * COMMON FRAME BEHAVIOR
   */
  useFrame(({ camera }) => {
    camera.position.z = ship.position.z + cameraDistane
  })
  return (
    <Fragment>
      <hemisphereLight
        args={[0xeeeeff, 0x222222, 1]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <Point />
      <Suspense fallback={null}>
        <SpaceShip obj={shipObj} />
        <Meteolites geometries={meteoliteGeometries} />
        <Lasers />
      </Suspense>
    </Fragment>
  )
}

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
          <Game />
          <StatsDom />
        </Suspense>
      </Provider>
    </Canvas>
  )
}

export default GamePanel
