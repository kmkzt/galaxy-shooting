import {
  Mesh,
  // Renderer,
  Camera,
  Geometry,
  Material,
  BoxGeometry,
  MeshNormalMaterial,
  BufferGeometry,
  BoxBufferGeometry,
  MeshPhongMaterial,
  VertexColors,
  Color,
  Float32BufferAttribute
} from 'three'

const initGeoMetry = (): BufferGeometry => {
  const geometry = new BoxBufferGeometry(1, 1, 1).toNonIndexed()
  const colors: number[] = []
  const color = new Color()
  for (let i = 0, l = geometry.attributes.position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    colors.push(color.r, color.g, color.b)
  }
  geometry.addAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}

const initMaterial = (): Material => {
  const material = new MeshPhongMaterial({
    specular: 0xffffff,
    flatShading: true,
    vertexColors: VertexColors
  })
  material.color.setHSL(
    Math.random() * 0.2 + 0.5,
    0.75,
    Math.random() * 0.25 + 0.75
  )
  return material
}

export class Meteolite extends Mesh {
  public isRotation: boolean = false
  constructor(
    geometry: Geometry | BufferGeometry = initGeoMetry(),
    material: Material | Material[] = initMaterial()
  ) {
    super(geometry, material)
    this.setRandomPosition = this.setRandomPosition.bind(this)
  }

  public setRandomPosition(x: number, y: number, z: number) {
    this.position.x = (Math.random() - 0.5) * x
    this.position.y = (Math.random() - 0.5) * y
    this.position.z = (Math.random() - 0.5) * z
    return this
  }
}
