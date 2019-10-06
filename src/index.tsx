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
  HemisphereLight
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

let boxs: Mesh[] = []

/**
 * COntroler
 */
let stats: Stats
const canvasFrame = document.getElementById('drawarea') as HTMLCanvasElement

let camera: PerspectiveCamera
let scene: Scene

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: canvasFrame
})

const genSpaceShip = () => {
  const geometry: Geometry = new BoxGeometry(1, 0.2, 0.2)
  const material: Material = new MeshNormalMaterial()

  spaceShip = new Mesh(geometry, material)
  scene.add(spaceShip)
}
/**
 * Generate box
 */
const genBox = () => {
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
    box.position.x = Math.floor(Math.random() * 100) / 10 - 5
    box.position.y = Math.floor(Math.random() * 100) / 10 - 5
    box.position.z = Math.floor(Math.random() * 100) / 10 - 5 - FAR

    console.log(box.position)
    scene.add(box)
    boxs.push(box)
  }
}

const init = () => {
  camera = new PerspectiveCamera(200, ASPECT_RATIO, 0.02, FAR)
  camera.position.z = 1

  scene = new Scene()
  scene.background = new Color(0xffffff)

  const light = new HemisphereLight(0xeeeeff, 0x777788, 0.75)
  light.position.set(0.5, 1, 0.75)
  scene.add(light)
  /**
   * TODO: adjust box scene
   */
  // scene = new Scene()
  // scene.background = new Color(0xffffff)
  // scene.fog = new Fog(0xffffff, 0, 750)
  /**
   * generate space ship
   */
  genSpaceShip()

  /**
   * generate box
   */
  genBox()

  /**
   * Renderer config
   */
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(FRAME_X, FRAME_Y)

  /**
   * DEV TOOLS
   */
  stats = new Stats()
  document.body.appendChild(stats.dom)
  const gui = new dat.GUI()
  for (let key in spaceShip) {
    if (typeof spaceShip[key] === 'object') {
      // console.log(key, typeof spaceShip[key])
      for (let param in spaceShip[key]) {
        // console.log(param, typeof spaceShip[key][param])
        if (
          typeof spaceShip[key][param] !== 'object' &&
          typeof spaceShip[key][param] !== 'function'
        ) {
          gui.add(spaceShip[key], param)
        }
      }
    }
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  // camera.rotation.x += ROTATE_UNIT
  // camera.rotation.y += ROTATE_UNIT
  // camera.rotation.z += ROTATE_UNIT

  if (spaceShip_rotate) {
    // spaceShip.rotation.x += ROTATE_UNIT
    // spaceShip.rotation.y += ROTATE_UNIT * 2
    spaceShip.rotation.z += ROTATE_UNIT
  }
  /**
   * stats.js update
   */
  stats.update()
  renderer.render(scene, camera)
}

init()
animate()

setInterval(() => {
  camera.position.z -= 0.01
  spaceShip.position.z -= 0.01
}, 10)

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
  console.log(e)
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
  console.log(spaceShip.position)
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
  console.log(key)
  console.log('spaceShip: ', spaceShip)
  console.log('camera:', camera)
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
