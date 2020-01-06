import polyfill from '@juggle/resize-observer'
import { Scene, Color, Fog, HemisphereLight, Loader } from 'three'
import React, {
  Fragment,
  useCallback,
  FC,
  Suspense,
  useLayoutEffect
} from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import styled from 'styled-components'
import store, { RootStore } from '@/store'
import Stats from 'stats.js'
import SpaceShip from '@/object/SpaceShip'
import Meteolites from '@/object/Meteolites'
import Lasers from '@/object/Lasers'
import { POINT_INC } from '@/store/Score'
import { Menu } from '@/components/Menu'
import { Start } from '@/components/Start'
import useObject from '@/hooks/useObject'
import useGameFrame from '@/hooks/useGameFrame'
import { hot } from 'react-hot-loader/root'

/**
 * Camera
 */
const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5
const app = document.getElementById('app') as HTMLElement

function Game() {
  const { camera, raycaster, aspect, mouse } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )
  const dispatch = useDispatch()

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
  /**
   * POINT COUNT
   */
  useGameFrame(() => dispatch(POINT_INC(1)))
  return (
    <Fragment>
      <hemisphereLight
        args={[0xeeeeff, 0x222222, 1]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <Suspense fallback={null}>
        <SpaceShip obj={shipObj} />
        <Meteolites geometries={meteoliteGeometries} />
        <Lasers />
      </Suspense>
    </Fragment>
  )
}
const DisplayArea = styled.div`
  width: 100vw;
  height: 100vh;
`
/**
 * DEV TOOLS
 */
const stats = new Stats()
document.body.appendChild(stats.dom)
const StatsDom = () => {
  useFrame(() => {
    stats.update()
  })
  return null
}
const App: FC = () => {
  return (
    <DisplayArea>
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
      <Provider store={store}>
        <Start />
        <Menu />
      </Provider>
    </DisplayArea>
  )
}

export default hot(App)
