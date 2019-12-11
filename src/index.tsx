import polyfill from '@juggle/resize-observer'
import {
  Scene,
  Color,
  Fog,
  HemisphereLight,
  Vector2,
  Intersection,
  Loader,
  DefaultLoadingManager
} from 'three'
import React, { Fragment, useEffect, useCallback, FC, Suspense } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { Canvas, useFrame, useThree, useLoader } from 'react-three-fiber'
import styled from 'styled-components'
import { hydrate } from 'react-dom'
import store, { RootStore } from './store'
import Stats from 'stats.js'
import dat from 'dat.gui'
import { Controler } from './components/Controler'
import { Keyboard } from './enum/keyboard'
import SpaceShip from './object/SpaceShip'
import Meteolites from './object/Meteolites'
import { POINT_INC, POINT_RESET } from './store/Score'
import { Menu } from './components/Menu'
import { Start } from './components/Start'
import { PLAY_MENU_TOGGLE } from './store/Play'
import { SPACESHIP_UPDATE } from './store/SpaceShip'
import {
  METEOS_UPDATE,
  Meteo,
  METEO_REPLACE,
  State as MeteoState
} from './store/Meteolites'
import { getRandomPosition } from './utils/getRandomPostion'
import { touchObject } from './utils/touchObject'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { LOAD_UPDATE } from './store/Load'

/**
 * DEV TOOLS
 */
const stats = new Stats()
const gui = new dat.GUI()
// TODO: add onChange
// const setDataGui = (data: object, g: dat.GUI) => {
//   for (let key in data) {
//     switch (typeof data[key]) {
//       case 'object':
//         // console.log(key, typeof spaceShip[key])
//         let paramGui = g.addFolder(key)
//         for (let param in data[key]) {
//           if (typeof data[key][param] === 'function') continue
//           if (typeof data[key][param] === 'object') continue
//           paramGui.add(data[key], param)
//         }
//         break
//       case 'number':
//       case 'string':
//         g.add(data, key)
//         break
//     }
//   }
// }
/**
 * Renderer
 */
const app = document.getElementById('app') as HTMLElement
const FRAME_X = window.innerWidth
const FRAME_Y = window.innerHeight
// const FRAME_X = 500
// const FRAME_Y = 500
/**
 * Camera
 */
const ASPECT_RATIO = FRAME_X / FRAME_Y
const FOV = 60
const NEAR = 9
const FAR = 200
const CAMERA_DISTANCE = NEAR + 5

/**
 * Mouse point
 */

/**
 * Generate box
 */
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

/**
 * Keyboard parameter
 */
const TRANSLATE_UNIT = 0.05
const CAMERA_MOVE_UNIT = 1

const isKeycode = (key: number): key is Keyboard =>
  Object.values(Keyboard).includes(key)

// window.addEventListener('keydown', (ev: KeyboardEvent) => {
//   const keyCode = ev.keyCode
//   if (isKeycode(keyCode)) {
//     keyboardAction(keyCode)
//   }
// })

const keyboardAction = (key: Keyboard) => {
  switch (key) {
    // case Keyboard.UP_ARROW:
    //   spaceShip.position.y -= TRANSLATE_UNIT
    //   break
    // case Keyboard.DOWN_ARROW:
    //   spaceShip.position.y += TRANSLATE_UNIT
    //   break
    // case Keyboard.RIGHT_ARROW:
    //   spaceShip.position.x -= TRANSLATE_UNIT
    //   break
    // case Keyboard.LEFT_ARROW:
    //   spaceShip.position.x += TRANSLATE_UNIT
    //   break
    // case Keyboard.KEY_U:
    //   camera.position.y -= CAMERA_MOVE_UNIT
    //   break
    // case Keyboard.KEY_D:
    //   camera.position.y += CAMERA_MOVE_UNIT
    //   break
    // case Keyboard.KEY_L:
    //   camera.position.x -= CAMERA_MOVE_UNIT
    //   break
    // case Keyboard.KEY_R:
    //   camera.position.x += CAMERA_MOVE_UNIT
    //   break
    // case Keyboard.KEY_N:
    //   camera.position.z -= CAMERA_MOVE_UNIT
    //   break
    // case Keyboard.KEY_F:
    //   camera.position.z += CAMERA_MOVE_UNIT
    //   break
    // case Keyboard.ENTER:
    //   spaceShip.isClashed = false
    //   store.dispatch(POINT_RESET())
    //   break
    case Keyboard.SPACE:
      store.dispatch(
        SPACESHIP_UPDATE({
          isClashed: false
        })
      )
      break
  }
}

const Panel = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.4);
  padding: 12px;
`
const setDracoResourcePath = (loader: Loader) => {
  if (loader instanceof DRACOLoader) {
    loader.setDecoderPath('/libs/draco/')
  }
}

function Game() {
  const { scene, camera, raycaster, aspect, mouse } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const meteos = useSelector((state: RootStore) => state.meteos)
  const load = useSelector((state: RootStore) => state.load)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )
  const dispatch = useDispatch()

  const active = useSelector<RootStore, boolean>(
    ({ play }) => play.active && !play.menu
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
  const shipObj = useLoader(
    OBJLoader,
    require('@/models/SpaceShip/spaceShip.obj')
  )
  const meteoliteObjs = [
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
  useEffect(() => {
    if (load.spaceShip) return
    const meteoData: MeteoState = Array(100)
      .fill(null)
      .reduce((res: MeteoState, _: null, i: number): MeteoState => {
        const pattern = Math.floor(Math.random() * meteoliteObjs.length)
        return {
          ...res,
          [i]: {
            guid: i,
            position: getRandomPosition(
              {
                x: CAMERA_DISTANCE * ASPECT_RATIO,
                y: CAMERA_DISTANCE,
                z: FAR
              },
              {
                z: FAR
              }
            ),
            rotation: {
              x: 0,
              y: 0,
              z: 0
            },
            scale: {
              x: 1,
              y: 1,
              z: 1
            },
            pattern
          }
        }
      }, {})
    dispatch(METEOS_UPDATE(meteoData))
    dispatch(
      LOAD_UPDATE({
        meteolites: true
      })
    )
  }, [dispatch, load.spaceShip, meteoliteObjs.length])

  useEffect(() => {
    if (load.spaceShip) return
    dispatch(
      SPACESHIP_UPDATE({
        rotation: {
          x: shipObj.rotation.x - Math.PI,
          y: shipObj.rotation.y,
          z: shipObj.rotation.z
        },
        scale: {
          x: shipObj.scale.x / 2,
          y: shipObj.scale.y / 2,
          z: shipObj.scale.z / 2
        }
      })
    )
    dispatch(
      LOAD_UPDATE({
        spaceShip: true
      })
    )
  }, [dispatch, load.spaceShip, shipObj])

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
   * Animation
   */
  useFrame(({ camera }) => {
    // DEV TOOL
    {
      stats.update()
    }
    if (!active || ship.isClashed) return
    // Game Status Behavior
    {
      dispatch(POINT_INC(1))
    }
    // CAMERA Behavior
    {
      camera.position.z = ship.position.z + cameraDistane
    }
    // SpaceShip Behavior
    {
      const ROTATE_UNIT = 0.1
      const { position, flightSpeed, isRotation, rotation } = ship
      const isClashed = Object.values(meteos).some((me: Meteo) =>
        touchObject(me, ship)
      )

      const mousemove_x = mouse.x / 2
      const mousemove_y = mouse.y / 2

      dispatch(
        SPACESHIP_UPDATE({
          isClashed,
          // spaceShip Moving
          position: {
            ...position,
            x: mousemove_x * aspect * CAMERA_DISTANCE,
            y: mousemove_y * CAMERA_DISTANCE,
            z: position.z - flightSpeed
          },
          // spaceShip rotation
          rotation: {
            ...rotation,
            z: isRotation ? rotation.z + ROTATE_UNIT : rotation.z
          }
        })
      )
    }
    // Meteolites Behavior
    {
      const updateMeteos = Object.values(meteos).reduce(
        (upd: MeteoState, me: Meteo): MeteoState => {
          if (me.position.z < ship.position.z + 10) return upd
          return {
            ...upd,
            [me.guid]: {
              ...me,
              position: {
                ...me.position,
                z: me.position.z - FAR
              }
            }
          }
        },
        {}
      )

      if (Object.keys(updateMeteos).length > 0) {
        dispatch(METEOS_UPDATE(updateMeteos))
      }
    }
  })

  return (
    <Suspense fallback={null}>
      <SpaceShip obj={shipObj} />
      <Meteolites objs={meteoliteObjs} />
    </Suspense>
  )
}

const App: FC = ({}) => {
  return (
    <Fragment>
      <Canvas
        // concurrent={true} // react conncurrentMode
        style={{ width: FRAME_X, height: FRAME_Y }}
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
          // scene.fog = new Fog(0x000000, 50, 2000)
          scene.fog = new Fog(0x000000, NEAR, FAR)
          const light = new HemisphereLight(0xeeeeff, 0x222222, 1)
          light.position.set(0.5, 1, 0.75)
          scene.add(light)
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
    </Fragment>
  )
}
hydrate(<App />, app)
