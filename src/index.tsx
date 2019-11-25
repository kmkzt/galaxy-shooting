import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Fog,
  HemisphereLight,
  Vector2,
  Raycaster,
  Intersection
} from 'three'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import { hydrate } from 'react-dom'
import Stats from 'stats.js'
import dat from 'dat.gui'
import { Controler } from './components/Controler'
import { Keyboard } from './enum/keyboard'
import { SpaceShip } from './object/SpaceShip'
import { Meteolite } from './object/Meteolite'
import { Provider } from 'react-redux'
import store from './store'
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
const canvasFrame = document.getElementById('drawarea') as HTMLCanvasElement
const FRAME_X = window.innerWidth
const FRAME_Y = window.innerHeight
// const FRAME_X = 500
// const FRAME_Y = 500

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: canvasFrame
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(FRAME_X, FRAME_Y)

/**
 * Camera
 */
const ASPECT_RATIO = FRAME_X / FRAME_Y
const FOV = 60
const NEAR = 9
const FAR = 2000
const CAMERA_DISTANCE = NEAR + 5
const camera = new PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR)
camera.position.z = CAMERA_DISTANCE
/**
 * Scene
 */
const scene = new Scene()
scene.background = new Color(0x333366)
// scene.fog = new Fog(0x000000, 50, 2000)
scene.fog = new Fog(0x000000, NEAR, FAR)
const light = new HemisphereLight(0xeeeeff, 0x222222, 1)
light.position.set(0.5, 1, 0.75)
scene.add(light)

/**
 * Mouse point
 */
const raycaster = new Raycaster()
const mouse = new Vector2()
/**
 * SpaceShip Configuration
 */
const spaceShip = new SpaceShip()
const spaceShipGUI = gui.add(spaceShip.rotation, 'x')
spaceShipGUI.onChange((val: string) => (spaceShip.rotation.x = Number(val)))
/**
 * Generate box
 */
let meteolites: Meteolite[] = []

interface GenerateMeteolitesOption {
  quauntity: number
  base_z: number
}

const generateMeteolitesDefaultOption: GenerateMeteolitesOption = {
  quauntity: 100,
  base_z: FAR
}

const generateMeteolites = (option?: GenerateMeteolitesOption) => {
  const { quauntity, base_z }: GenerateMeteolitesOption = {
    ...generateMeteolitesDefaultOption,
    ...(option || {})
  }
  for (var i = 0; i < quauntity; i++) {
    meteolites.push(initMeteo(base_z))
  }
}

const initMeteo = (mateoZ: number): Meteolite => {
  const meteo = new Meteolite()
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
const init = async () => {
  await spaceShip.init()
  /**
   * generate space ship
   */
  scene.add(spaceShip)

  /**
   * generate box
   */
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
 * game is active
 */
const isGameActive = (): boolean =>
  store.getState().play.active && !store.getState().play.menu

/**
 * Geme behavior
 */
const gameBehaviorUpdate = () => {
  if (!isGameActive()) {
    return
  }
  /** SpaceShip Move */
  if (spaceShip.isRotation) {
    spaceShip.rotation.z += ROTATE_UNIT
  }

  /**
   * Repeat Meteolites Position
   */
  meteolites
    .filter((me: Meteolite) => me.position.z > spaceShip.position.z + 10)
    .map((me: Meteolite) => {
      me.position.z -= FAR
    })

  /**
   * Check Crash
   */
  const hitMeteolites = meteolites.find((me: Meteolite) => spaceShip.touch(me))
  if (hitMeteolites) {
    spaceShip.isClashed = true
  }

  /**
   * Moving SpaceShip
   */
  if (!spaceShip.isClashed) {
    spaceShip.position.z -= spaceShip.flightSpeed
    camera.position.z -= spaceShip.flightSpeed
    store.dispatch(POINT_INC(1))
  }
}
/**
 * 3D animation
 */
const animate = () => {
  /**
   * Game parameter update
   */
  gameBehaviorUpdate()
  /**
   * stats.js update
   */
  stats.update()
  /**
   * Render animation
   */
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

init()
animate()

/**
 * CLICK ACTION
 */
canvasFrame.addEventListener('click', () => {
  spaceShip.switchRotate()
})

/**
 * MOUSEMOVE ACTION
 */
canvasFrame.addEventListener('mousemove', (e: MouseEvent) => {
  e.preventDefault()
  /**
   * mosemove point
   */
  const rect = canvasFrame.getBoundingClientRect()

  /**
   * Mouse Point 2D
   */
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  raycaster.intersectObjects(meteolites, true).map((inMeteo: Intersection) => {
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
  spaceShip.position.x = mousemove_x * camera.aspect * CAMERA_DISTANCE
  spaceShip.position.y = mousemove_y * CAMERA_DISTANCE
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

hydrate(
  <Provider store={store}>
    <Fragment>
      <Start />
      <Panel>
        <Menu />
        <Controler onKeyboard={keyboardAction} />
      </Panel>
    </Fragment>
  </Provider>,
  document.getElementById('controler')
)
