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

const TRANSLATE_UNIT = 0.1
const ROTATE_UNIT = 0.01

const FRAME_X = 500
const FRAME_Y = 500
// const FRAME_X = innerWidth
// const FRAME_Y = innerHeight

const ASPECT_RATIO = FRAME_X / FRAME_Y

let mesh: Mesh

const scene: Scene = new Scene()
const renderer = new WebGLRenderer({
  antialias: true,
  canvas: document.getElementById('drawarea') as HTMLCanvasElement
})

const camera = new PerspectiveCamera(200, ASPECT_RATIO, 0.02, 10)

const box = () => {
  const geometry: Geometry = new BoxGeometry(0.2, 0.2, 0.2)
  const material: Material = new MeshNormalMaterial()

  return new Mesh(geometry, material)
}

const init = () => {
  camera.position.z = 1
  mesh = box()
  scene.add(mesh)

  renderer.setSize(FRAME_X, FRAME_Y)
}

const animate = () => {
  requestAnimationFrame(animate)

  mesh.rotation.x += ROTATE_UNIT
  mesh.rotation.y += ROTATE_UNIT * 2

  renderer.render(scene, camera)
}

init()
animate()

// setInterval(() => {
//   console.log(camera.position)
//   let { x } = camera.position
//   camera.position.setX(x + MOVE_POINT)
// }, 1000)
window.addEventListener('mousemove', (ev: MouseEvent) => {
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
  console.log(keyCode)
  if (isKeycode(keyCode)) {
    keyboardAction(keyCode)
  }
})

const keyboardAction = (key: Keyboard) => {
  console.log(key)
  console.log('mesh: ', mesh, '\ncamera:', camera)
  switch (key) {
    case Keyboard.UP_ARROW:
      mesh.position.setY(mesh.position.y - TRANSLATE_UNIT)
      break
    case Keyboard.DOWN_ARROW:
      mesh.position.setY(mesh.position.y + TRANSLATE_UNIT)
      break
    case Keyboard.RIGHT_ARROW:
      mesh.position.setX(mesh.position.x - TRANSLATE_UNIT)
      break
    case Keyboard.LEFT_ARROW:
      mesh.position.setX(mesh.position.x + TRANSLATE_UNIT)
      break
    case Keyboard.KEY_U:
      camera.position.setY(camera.position.y - TRANSLATE_UNIT)
      break
    case Keyboard.KEY_D:
      camera.position.setY(camera.position.y + TRANSLATE_UNIT)
      break
    case Keyboard.KEY_L:
      camera.position.setX(camera.position.x - TRANSLATE_UNIT)
      break
    case Keyboard.KEY_R:
      camera.position.setX(camera.position.x + TRANSLATE_UNIT)
      break
  }
}
hydrate(
  <Controler onKeyboard={keyboardAction} />,
  document.getElementById('controler')
)
