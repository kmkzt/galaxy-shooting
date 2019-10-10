import {
  Mesh,
  // Renderer,
  Camera,
  Geometry,
  Material,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshNormalMaterial,
  MeshPhongMaterial,
  WebGLRenderer,
  VertexColors,
  Float32BufferAttribute,
  Color,
  BoxBufferGeometry,
  Fog,
  HemisphereLight,
  Object3D
} from 'three'
import React from 'react'
import { hydrate } from 'react-dom'
import Stats from 'stats.js'
import dat from 'dat.gui'
import { Controler } from './Controler'
import { Keyboard } from './enum/keyboard'

const TRANSLATE_UNIT = 0.05
const CAMERA_MOVE_UNIT = 20
const ROTATE_UNIT = 0.1

const FRAME_X = 500
const FRAME_Y = 500
// const FRAME_X = innerWidth
// const FRAME_Y = innerHeight

const ASPECT_RATIO = FRAME_X / FRAME_Y
const FAR = 10

/**
 * Object
 */
let spaceShip: Mesh
let spaceShip_rotate: boolean = false

let boxs: Object3D[] = []

/**
 * Controler
 */
const stats = new Stats()
const canvasFrame = document.getElementById('drawarea') as HTMLCanvasElement

const camera = new PerspectiveCamera(200, ASPECT_RATIO, 0.02, FAR)
const scene = new Scene()

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: canvasFrame
})

/**
 * Generate SpaceShip
 */
const genSpaceShip = (s: Scene) => {
  const geometry: Geometry = new BoxGeometry(1, 0.2, 0.2)
  const material: Material = new MeshNormalMaterial()

  spaceShip = new Mesh(geometry, material)
  s.add(spaceShip)
}
/**
 * Generate box
 */
const genBox = (s: Scene) => {
  const boxBufferGeometry = new BoxBufferGeometry(1, 1, 1)
  const boxGeometry = boxBufferGeometry.toNonIndexed() // ensure each face has unique vertices
  const position = boxGeometry.attributes.position
  const colors = []
  const color = new Color()
  for (var i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    colors.push(color.r, color.g, color.b)
  }
  boxGeometry.addAttribute('color', new Float32BufferAttribute(colors, 3))
  for (var i = 0; i < 500; i++) {
    const boxMaterial = new MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: VertexColors
    })
    boxMaterial.color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75
    )
    // const boxMaterial = new MeshNormalMaterial()

    const box = new Mesh(boxGeometry, boxMaterial)
    box.position.x = Math.floor(Math.random() * FRAME_X) * 0.5 - FRAME_X / 10
    box.position.y = Math.floor(Math.random() * FRAME_Y) * 0.5 - FRAME_Y / 10
    box.position.z = Math.floor(Math.random() * 100) / 10 - 5 - FAR
    s.add(box)
    boxs.push(box)
  }
}

const init = () => {
  camera.position.z = 1

  /**
   * background color
   */
  scene.background = new Color(0x000000)
  /**
   * Fog
   */
  scene.fog = new Fog(0x000000, 50, 2000)
  /**
   * Light
   */
  const light = new HemisphereLight(0xeeeeff, 0x777788, 0.75)
  light.position.set(0.5, 1, 0.75)
  scene.add(light)

  /**
   * TODO: adjust box scene
   */
  // scene = new Scene()
  // scene.background = new Color(0xffffff)
  scene.fog = new Fog(0xffffff, 0, 750)
  /**
   * generate space ship
   */
  genSpaceShip(scene)

  /**
   * generate box
   */
  genBox(scene)

  /**
   * Renderer config
   */
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(FRAME_X, FRAME_Y)

  /**
   * DEV TOOLS
   */
  document.body.appendChild(stats.dom)

  const gui = new dat.GUI()
  setDataGui(camera, gui.addFolder('camera'))
  setDataGui(scene, gui.addFolder('scene'))
  setDataGui(light, gui.addFolder('light'))
  setDataGui(spaceShip, gui.addFolder('spaceShip'))
}

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
 * Check Block
 * TODO: Fix check no block
 */
const isNoBlock = () => camera.position.z < -15

/**
 * Animation loop
 */
const animate = () => {
  requestAnimationFrame(animate)

  if (spaceShip_rotate) {
    spaceShip.rotation.z += ROTATE_UNIT
  }

  if (isNoBlock()) {
    scene.remove(...boxs)
    genBox(scene)
    camera.position.z = 0
    spaceShip.position.z = 0
  }
  /**
   * Moving SpaceShip
   */
  spaceShip.position.z -= 0.2
  camera.position.z -= 0.2
  /**
   * stats.js update
   */
  stats.update()
  renderer.render(scene, camera)
}

init()
animate()

/**
 *
 */
canvasFrame.addEventListener('click', () => {
  spaceShip_rotate = !spaceShip_rotate
})

/**
 * MOUSEMOVE HANDLER
 */
canvasFrame.addEventListener('mousemove', (e: MouseEvent) => {
  const canvasRect = canvasFrame.getBoundingClientRect()
  /**
   * frame point
   */
  const x =
    (canvasRect.width - e.clientX) / canvasRect.width - camera.aspect / 2
  const y =
    (e.clientY - canvasRect.height) / canvasRect.height + camera.aspect / 2

  /**
   * SpaceShip move
   */
  spaceShip.position.x = x * camera.far
  spaceShip.position.y = y * camera.far
})

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
    /**
     * spaceShip POSITION Y
     */
    case Keyboard.UP_ARROW:
      spaceShip.position.y -= TRANSLATE_UNIT
      break
    case Keyboard.DOWN_ARROW:
      spaceShip.position.y += TRANSLATE_UNIT
      break
    /**
     * BOX POSITION X
     */
    case Keyboard.RIGHT_ARROW:
      spaceShip.position.x -= TRANSLATE_UNIT
      break
    case Keyboard.LEFT_ARROW:
      spaceShip.position.x += TRANSLATE_UNIT
      break
    /**
     * CAMERA POSITION Y
     */
    case Keyboard.KEY_U:
      camera.position.y -= CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_D:
      camera.position.y += CAMERA_MOVE_UNIT
      break
    /**
     * CAMERA POSITION X
     */
    case Keyboard.KEY_L:
      camera.position.x -= CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_R:
      camera.position.x += CAMERA_MOVE_UNIT
      break
    /**
     * CAMERA POSITION Z
     */
    case Keyboard.KEY_N:
      camera.position.z -= CAMERA_MOVE_UNIT
      break
    case Keyboard.KEY_F:
      camera.position.z += CAMERA_MOVE_UNIT
      break
  }
}

hydrate(
  <Controler onKeyboard={keyboardAction} />,
  document.getElementById('controler')
)
