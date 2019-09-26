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

let camera: Camera, scene: Scene, renderer: Renderer
let geometry: Geometry, material: Material, mesh: Mesh

const MOVE_POINT = 1
const init = () => {
  camera = new PerspectiveCamera(
    200,
    window.innerWidth / window.innerHeight,
    0.02,
    10
  )
  camera.position.z = 1

  scene = new Scene()

  geometry = new BoxGeometry(0.2, 0.2, 0.2)
  material = new MeshNormalMaterial()

  mesh = new Mesh(geometry, material)
  scene.add(mesh)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}

const animate = () => {
  requestAnimationFrame(animate)

  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.02

  renderer.render(scene, camera)
}

init()
animate()

setInterval(() => {
  console.log(camera.position)
  let { x } = camera.position
  camera.position.setX(x + MOVE_POINT)
}, 1000)
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
