import polyfill from '@juggle/resize-observer'
import { Scene, Color, Fog, HemisphereLight, Loader } from 'three'
import React, {
  Fragment,
  useEffect,
  useCallback,
  FC,
  Suspense,
  useRef
} from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { hydrate } from 'react-dom'
import styled from 'styled-components'
import store, { RootStore } from '@/store'
import Stats from 'stats.js'
import SpaceShip from '@/object/SpaceShip'
import Meteolites from '@/object/Meteolites'
import Lasers from '@/object/Lasers'
import { POINT_INC, POINT_RESET } from '@/store/Score'
import { Menu } from '@/components/Menu'
import { Start } from '@/components/Start'
import useObject from '@/hooks/useObject'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'
import useGameFrame from './hooks/useGameFrame'

/**
 * DEV TOOLS
 */
const stats = new Stats()
/**
 * Renderer
 */
const app = document.getElementById('app') as HTMLElement
const FRAME_X = window.innerWidth
const FRAME_Y = window.innerHeight
/**
 * Camera
 */
const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5

/**
 * CLICK ACTION
 */
app.addEventListener('click', () => {
  store.dispatch(
    SPACESHIP_UPDATE({
      isRotation: !store.getState().spaceShip.isRotation
    })
  )
})

const Panel = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.4);
  padding: 12px;
`
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
  useEffect(() => {
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
    // DEV TOOL
    {
      stats.update()
    }
    // CAMERA BEHAVIOR
    {
      camera.position.z = ship.position.z + cameraDistane
    }
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
const App: FC = ({}) => {
  return (
    <Fragment>
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
            document.body.appendChild(stats.dom)
            scene.background = new Color(0x333366)
            scene.fog = new Fog(0x000000, NEAR, FAR)
          }}
          pixelRatio={window.devicePixelRatio}
          resize={{ polyfill } as any}
        >
          <Provider store={store}>
            <Suspense fallback={null}>
              <Game />
            </Suspense>
          </Provider>
        </Canvas>
        <Provider store={store}>
          <Start />
          <Panel>
            <Menu />
          </Panel>
        </Provider>
      </DisplayArea>
    </Fragment>
  )
}
hydrate(<App />, app)

// https://github.com/gaearon/react-hot-loader#appcontainer
// webpack Hot Module Replacement API
if ((module as any).hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  ;(module as any).hot.accept('', () => {
    hydrate(<App />, app)
  })
}
