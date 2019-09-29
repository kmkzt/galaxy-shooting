import {
  Mesh,
  Renderer,
  Camera,
  Geometry,
  Material,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshNormalMaterial,
  WebGLRenderer
} from 'three'
import React from 'react'
import { hydrate } from 'react-dom'
import { Controler } from './Controler'
import { Keyboard } from './enum/keyboard'

const TRANSLATE_UNIT = 0.05
const ROTATE_UNIT = 0.01

const FRAME_X = 500
const FRAME_Y = 500
// const FRAME_X = innerWidth
// const FRAME_Y = innerHeight

const ASPECT_RATIO = FRAME_X / FRAME_Y
const FAR = 10

let spaceShip: Mesh
const canvasFrame = document.getElementById('drawarea') as HTMLCanvasElement

const scene: Scene = new Scene()
const renderer = new WebGLRenderer({
  antialias: true,
  canvas: canvasFrame
})

const camera = new PerspectiveCamera(200, ASPECT_RATIO, 0.02, FAR)

const genSpaceShip = () => {
  const geometry: Geometry = new BoxGeometry(0.2, 0.2, 0.2)
  const material: Material = new MeshNormalMaterial()

  return new Mesh(geometry, material)
}

const init = () => {
  camera.position.z = 1
  spaceShip = genSpaceShip()
  scene.add(spaceShip)

  renderer.setSize(FRAME_X, FRAME_Y)
}

const animate = () => {
  requestAnimationFrame(animate)
  // camera.rotation.x += ROTATE_UNIT
  // camera.rotation.y += ROTATE_UNIT
  // camera.rotation.z += ROTATE_UNIT

  // spaceShip.rotation.x += ROTATE_UNIT
  // spaceShip.rotation.y += ROTATE_UNIT * 2
  // spaceShip.rotation.z += ROTATE_UNIT * 3

  renderer.render(scene, camera)
}

init()
animate()

// setInterval(() => {
//   console.log(camera.position)
//   let { x } = camera.position
//   camera.position.setX(x + MOVE_POINT)
// }, 1000)
canvasFrame.addEventListener('mousemove', (e: MouseEvent) => {
  console.log(e)
  const canvasRect = canvasFrame.getBoundingClientRect()
  const x =
    (canvasRect.width - e.clientX) / canvasRect.width - camera.aspect / 2
  const y =
    (e.clientY - canvasRect.height) / canvasRect.height + camera.aspect / 2
  console.log('x', x)
  console.log('y', y)

  spaceShip.position.x = x * camera.far
  spaceShip.position.y = y * camera.far
  // camera.position.setX(ev.clientX)
  // if (window.innerWidth / 2 > ev.clientX) {
  //   camera.translateX(MOVE_POINT)
  // } else {
  //   camera.translateX(-MOVE_POINT)
  // }
  // if (window.innerHeight / 2 > ev.clientY) {
  //   camera.translateY(MOVE_POINT)
  // } else {
  //   camera.translateY(-MOVE_POINT)
  // }
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
      camera.position.y -= TRANSLATE_UNIT
      break
    case Keyboard.KEY_D:
      camera.position.y += TRANSLATE_UNIT
      break
    /**
     * CAMERA POSITION X
     */
    case Keyboard.KEY_L:
      camera.position.x -= TRANSLATE_UNIT
      break
    case Keyboard.KEY_R:
      camera.position.x += TRANSLATE_UNIT
      break
    /**
     * CAMERA POSITION Z
     */
    case Keyboard.KEY_N:
      camera.position.z -= TRANSLATE_UNIT
      break
    case Keyboard.KEY_F:
      camera.position.z += TRANSLATE_UNIT
      break
  }
}

hydrate(
  <Controler onKeyboard={keyboardAction} />,
  document.getElementById('controler')
)
