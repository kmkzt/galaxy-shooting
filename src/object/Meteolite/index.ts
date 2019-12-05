import {
  Group,
  Mesh,
  Material,
  BufferGeometry,
  BoxBufferGeometry,
  MeshPhongMaterial,
  VertexColors,
  Color,
  Float32BufferAttribute,
  Object3D
} from 'three'
import { loadObject3D } from '@/utils/loadObject3d'

const initGeoMetry = (size: number = 1): BufferGeometry => {
  const bs = Math.random() * size + 0.5
  const geometry = new BoxBufferGeometry(bs, bs, bs).toNonIndexed()
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

export const loadMeteolitesModel = (): Promise<Group[]> =>
  Promise.all([
    loadObject3D({
      texturePath: require('./models/textures/Meteolite1.png'),
      objectPath: require('./models/Meteolite1.obj')
    }),
    loadObject3D({
      texturePath: require('./models/textures/Meteolite2.png'),
      objectPath: require('./models/Meteolite2.obj')
    }),
    loadObject3D({
      texturePath: require('./models/textures/Meteolite3.png'),
      objectPath: require('./models/Meteolite3.obj')
    }),
    loadObject3D({
      texturePath: require('./models/textures/Meteolite4.png'),
      objectPath: require('./models/Meteolite4.obj')
    })
  ])

interface MeteoLiteOption {
  size?: number
  model?: Object3D
}
export default class Meteolite extends Group {
  public isRotation: boolean = false
  constructor({ size, model }: MeteoLiteOption = {}) {
    super()
    this.setRandomPosition = this.setRandomPosition.bind(this)
    this.add(model || new Mesh(initGeoMetry(size), initMaterial()))
  }

  public setRandomPosition(x: number, y: number, z: number) {
    this.position.x = (Math.random() - 0.5) * x
    this.position.y = (Math.random() - 0.5) * y
    this.position.z = (Math.random() - 0.5) * z
    return this
  }
}

export const initMeteo = (
  models: Group[],
  { x, y, z, far }: { x: number; y: number; z: number; far: number }
): Meteolite => {
  const meteo = new Meteolite({
    model:
      models.length !== 0
        ? models[Math.floor(Math.random() * models.length)].clone()
        : undefined
  })
  meteo.setRandomPosition(x, y, z)
  meteo.position.z += far
  return meteo
}

interface GenerateMeteolitesOption {
  quauntity: number
  models: Group[]
  basePosition: { x: number; y: number; z: number }
  far: number
}

const generateMeteolitesDefaultOption: GenerateMeteolitesOption = {
  quauntity: 20,
  models: [],
  basePosition: { x: 0, y: 0, z: 0 },
  far: 0
}

export const generateMeteolites = (
  option?: Partial<GenerateMeteolitesOption>
) => {
  const { quauntity, models, basePosition, far }: GenerateMeteolitesOption = {
    ...generateMeteolitesDefaultOption,
    ...(option || {})
  }
  return Array(quauntity)
    .fill(null)
    .map((_: null, i: number) =>
      initMeteo(models, {
        ...basePosition,
        far
      })
    )
}
