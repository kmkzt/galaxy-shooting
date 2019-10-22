import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Fog,
  HemisphereLight
} from 'three'
import React from 'react'
import { hydrate } from 'react-dom'
import Stats from 'stats.js'
import dat from 'dat.gui'
import { Controler } from './Controler'
import { Keyboard } from './enum/keyboard'
import { SpaceShip } from './SpaceShip'
import { Meteolite } from './Meteolite'

/**
 * DEV TOOLS
 */
const stats = new Stats()
const gui = new dat.GUI()
const setDataGui = (data: object, g: dat.GUI) => {
  for (let key in data) {
    switch (typeof data[key]) {
      case 'object':
        // console.log(key, typeof spaceShip[key])
        let paramGui = g.addFolder(key)
        for (let param in data[key]) {
          if (typeof data[key][param] === 'function') continue
          if (typeof data[key][param] === 'object') continue
          paramGui.add(data[key], param)
        }
        break
      case 'number':
      case 'string':
        g.add(data, key)
        break
    }
  }
}
/**
 * Renderer
 */
const canvasFrame = document.getElementById('drawarea') as HTMLCanvasElement
const FRAME_X = window.innerWidth
const FRAME_Y = window.innerHeight
// const FRAME_X = 500
// const FRAME_Y = 500
const FRAME_Z = 2000

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
const NEAR = 7

const camera = new PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FRAME_Z)
/**
 * Scene
 */
const scene = new Scene()
scene.background = new Color(0x000000)
scene.fog = new Fog(0x000000, 50, 2000)
// scene.fog = new Fog(0xffffff, 0, 750)
const light = new HemisphereLight(0xeeeeff, 0x777788, 0.75)
light.position.set(0.5, 1, 0.75)
scene.add(light)
/**
 * SpaceShip Configuration
 */
const CAMERA_DISTANCE = 10
let spaceShip: SpaceShip = new SpaceShip()
spaceShip.position.z = -CAMERA_DISTANCE
/**
 * Generate box
 */
let meteolites: Meteolite[] = []
const METEOLITE_DEFAULT_NUMBER = 100
const genMeteolites = (num: number = METEOLITE_DEFAULT_NUMBER) => {
  for (var i = 0; i < num; i++) {
    const meteo = new Meteolite()
    meteo.setRandomPosition(FRAME_X, FRAME_Y, FRAME_Z)
    meteo.position.z += FRAME_Z
    meteolites.push(meteo)
  }
}
/**
 * Init
 */
const init = () => {
  /**
   * generate space ship
   */
  scene.add(spaceShip)

  /**
   * generate box
   */
  genMeteolites()
  scene.add(...meteolites)
  /**
   * DEV TOOLS
   */
  document.body.appendChild(stats.dom)

  // TODO: FIX controlable object
  setDataGui(camera, gui.addFolder('camera'))
  setDataGui(scene, gui.addFolder('scene'))
  setDataGui(light, gui.addFolder('light'))
  setDataGui(spaceShip, gui.addFolder('spaceShip'))
}

/**
 * Animation loop
 */
const animate = () => {
  requestAnimationFrame(animate)

  if (spaceShip.isRotation) {
    spaceShip.rotation.z += ROTATE_UNIT
  }

  /**
   * Repeat Meteolites Position
   */
  meteolites
    .filter((me: Meteolite) => me.position.z > camera.position.z)
    .map((me: Meteolite) => {
      me.position.z -= FRAME_Z
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
    spaceShip.position.z -= 0.2
    camera.position.z -= 0.2
  }
  /**
   * stats.js update
   */
  stats.update()
  renderer.render(scene, camera)
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
  /**
   * mosemove point
   */
  const canvasRect = canvasFrame.getBoundingClientRect()
  // min: -0.5, max: 0.5
  const mousemove_x = e.clientX / canvasRect.width - 0.5
  const mousemove_y = 0.5 - e.clientY / canvasRect.height

  /**
   * SpaceShip move
   */
  spaceShip.position.x = mousemove_x * camera.aspect * CAMERA_DISTANCE
  spaceShip.position.y = mousemove_y * CAMERA_DISTANCE
})

/**
 * Keyboard parameter
 */
const TRANSLATE_UNIT = 0.05
const CAMERA_MOVE_UNIT = 20
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
    case Keyboard.SPACE:
      spaceShip.switchRotate()
      break
  }
}

hydrate(
  <Controler onKeyboard={keyboardAction} />,
  document.getElementById('controler')
)
