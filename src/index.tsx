import polyfill from '@juggle/resize-observer'
import {
  Scene,
  PerspectiveCamera,
  Color,
  Fog,
  HemisphereLight,
  Vector2,
  Raycaster,
  Intersection,
  Group,
  Camera
} from 'three'
import React, { Fragment, useEffect, useCallback } from 'react'
import { Provider, useSelector } from 'react-redux'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import styled from 'styled-components'
import { hydrate } from 'react-dom'
import store, { RootStore } from './store'
import Stats from 'stats.js'
import dat from 'dat.gui'
import { Controler } from './components/Controler'
import { Keyboard } from './enum/keyboard'
import SpaceShip, { loadSpaceShipModel } from './object/SpaceShip'
import Meteolite, { loadMeteolitesModel } from './object/Meteolite'
import { POINT_INC, POINT_RESET } from './store/Score'
import { Menu } from './components/Menu'
import { Start } from './components/Start'
import { PLAY_MENU_TOGGLE } from './store/Play'

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
const camera = new PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR)

/**
 * Mouse point
 */
const raycaster = new Raycaster()
const mouse = new Vector2()
/**
 * SpaceShip Configuration
 */
let spaceShip = new SpaceShip()

const setSpaceShipGUI = () => {
  const spaceShipGUI = gui.add(spaceShip.rotation, 'x')
  spaceShipGUI.onChange((val: string) => (spaceShip.rotation.x = Number(val)))
}
/**
 * Generate box
 */
let meteolites: Meteolite[] = []
let meteolitesModel: Group[] = []
interface GenerateMeteolitesOption {
  quauntity: number
  base_z: number
}

const generateMeteolitesDefaultOption: GenerateMeteolitesOption = {
  quauntity: 20,
  base_z: FAR
}

const generateMeteolites = (option?: Partial<GenerateMeteolitesOption>) => {
  const { quauntity, base_z }: GenerateMeteolitesOption = {
    ...generateMeteolitesDefaultOption,
    ...(option || {})
  }
  for (var i = 0; i < quauntity; i++) {
    meteolites.push(initMeteo(base_z, meteolitesModel))
  }
}

const initMeteo = (mateoZ: number, models: Group[]): Meteolite => {
  const meteo = new Meteolite({
    model:
      models.length !== 0
        ? models[Math.floor(Math.random() * models.length)].clone()
        : undefined
  })
  meteo.setRandomPosition(
    CAMERA_DISTANCE * ASPECT_RATIO,
    CAMERA_DISTANCE,
    mateoZ
  )
  meteo.position.z += FAR
  return meteo
}
/**
 * Init
 */
const init = async ({ scene, camera }: { scene: Scene; camera: Camera }) => {
  /**
   * Scene
   */
  scene.background = new Color(0x333366)
  // scene.fog = new Fog(0x000000, 50, 2000)
  scene.fog = new Fog(0x000000, NEAR, FAR)
  const light = new HemisphereLight(0xeeeeff, 0x222222, 1)
  light.position.set(0.5, 1, 0.75)
  scene.add(light)
  /**
   * CAMERA
   */

  camera.position.z = CAMERA_DISTANCE
  /**
   * generate space ship
   */
  const spaceShipModel = await loadSpaceShipModel()
  spaceShip = new SpaceShip({ model: spaceShipModel })
  setSpaceShipGUI()
  scene.add(spaceShip)

  /**
   * generate box
   */
  meteolitesModel = await loadMeteolitesModel()
  generateMeteolites()
  scene.add(...meteolites)
  /**
   * DEV TOOLS
   */
  document.body.appendChild(stats.dom)
  // TODO: FIX controlable object
  // setDataGui(camera, gui.addFolder('camera'))
  // setDataGui(scene, gui.addFolder('scene'))
  // setDataGui(light, gui.addFolder('light'))
  // setDataGui(spaceShip, gui.addFolder('spaceShip'))
}

/**
 * Geme behavior
 */
const gameBehaviorUpdate = ({ camera }: { camera: Camera }) => {
  if (spaceShip.isClashed) return

  /**
   * Meteolites Behavior
   */
  // check meteolite frame out
  meteolites
    .filter((me: Meteolite) => me.position.z > spaceShip.position.z + 10)
    .map((me: Meteolite) => {
      me.position.z -= FAR
    })

  // check clash
  const hitMeteolites = meteolites.find((me: Meteolite) => spaceShip.touch(me))
  if (hitMeteolites) {
    spaceShip.isClashed = true
  }

  /**
   * SpaceShip Behavior
   */
  // spaceShip rotation
  if (spaceShip.isRotation) spaceShip.rotation.z += ROTATE_UNIT

  // spaceShip rotation
  spaceShip.position.z -= spaceShip.flightSpeed
  camera.position.z -= spaceShip.flightSpeed

  /**
   * Point Counter
   */
  store.dispatch(POINT_INC(1))
}

/**
 * CLICK ACTION
 */
app.addEventListener('click', () => {
  spaceShip.switchRotate()
})

/**
 * Keyboard parameter
 */
const TRANSLATE_UNIT = 0.05
const CAMERA_MOVE_UNIT = 1
const ROTATE_UNIT = 0.1

const isKeycode = (key: number): key is Keyboard =>
  Object.values(Keyboard).includes(key)

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  const keyCode = ev.keyCode
  if (isKeycode(keyCode)) {
    keyboardAction(keyCode)
  }
})

const keyboardAction = (key: Keyboard) => {
  switch (key) {
    case Keyboard.UP_ARROW:
      spaceShip.position.y -= TRANSLATE_UNIT
      break
    case Keyboard.DOWN_ARROW:
      spaceShip.position.y += TRANSLATE_UNIT
      break
    case Keyboard.RIGHT_ARROW:
      spaceShip.position.x -= TRANSLATE_UNIT
      break
    case Keyboard.LEFT_ARROW:
      spaceShip.position.x += TRANSLATE_UNIT
      break
    case Keyboard.KEY_U:
      camera.position.y -= CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_D:
      camera.position.y += CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_L:
      camera.position.x -= CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_R:
      camera.position.x += CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_N:
      camera.position.z -= CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_F:
      camera.position.z += CAMERA_MOVE_UNIT
      break
    case Keyboard.ENTER:
      spaceShip.isClashed = false
      store.dispatch(POINT_RESET())
      break
    case Keyboard.SPACE:
      store.dispatch(PLAY_MENU_TOGGLE())
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
function Game() {
  const { scene, camera, raycaster, aspect } = useThree()
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
       * Rotate the meteorite in front of spaceShip
       */
      raycaster.setFromCamera(mouse, camera)

      raycaster
        .intersectObjects(meteolites, true)
        .map((inMeteo: Intersection) => {
          inMeteo.object.rotateX(3)
          inMeteo.object.rotateY(3)
          inMeteo.object.rotateZ(3)
        })
      /**
       * SpaceShip move
       */
      // min: -0.5, max: 0.5
      const mousemove_x = mouse.x / 2
      const mousemove_y = mouse.y / 2
      spaceShip.position.x = mousemove_x * aspect * CAMERA_DISTANCE
      spaceShip.position.y = mousemove_y * CAMERA_DISTANCE
    },
    [raycaster, camera, aspect]
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
   * Init
   */
  useEffect(() => {
    init({ scene, camera })
  }, [scene, camera])

  /**
   * EventListner
   */
  useEffect(() => {
    app.addEventListener('pointermove', handlePointerMove)
    app.addEventListener('mousemove', handlePointerMove)
    app.addEventListener('touchmove', handleTouchMove)
    return () => {
      app.removeEventListener('pointermove', handlePointerMove)
      app.removeEventListener('mousemove', handlePointerMove)
      app.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handlePointerMove, handleTouchMove])

  /**
   * Animation
   */
  useFrame(() => {
    if (!active) return
    gameBehaviorUpdate({ camera })
    stats.update()
  })
  return (
    <Fragment>
      <primitive object={spaceShip} />
      {meteolites.map((meteo: Meteolite, i: number) => (
        <primitive key={i} object={meteo} />
      ))}
    </Fragment>
  )
}

hydrate(
  <Fragment>
    <Canvas
      style={{ width: FRAME_X, height: FRAME_Y }}
      camera={camera as any}
      pixelRatio={window.devicePixelRatio}
      resize={{ polyfill } as any}
    >
      <Provider store={store}>
        <Game />
      </Provider>
    </Canvas>
    <Provider store={store}>
      <Start />
      <Panel>
        <Menu />
        <Controler onKeyboard={keyboardAction} />
      </Panel>
    </Provider>
  </Fragment>,
  app
)
