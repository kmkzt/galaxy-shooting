import {
  Mesh,
  Geometry,
  Material,
  BoxGeometry,
  MeshNormalMaterial,
  BufferGeometry,
  Object3D,
  Group
} from 'three'

import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js'

const loadSpaceShip = async (): Promise<Group> =>
  new Promise((resolve, reject) => {
    const loader = new TDSLoader()
    setTimeout(() => reject(), 100000)
    loader.setResourcePath(
      require('../models/3ds/spaceShip/textures/F15A.jpg.meta')
    )
    loader.load(
      require('../models/3ds/spaceShip/spaceShip.3ds'),
      (obj: Group) => {
        console.log(obj)
        resolve(obj)
      }
    )
  })
export class SpaceShip extends Group {
  public isRotation: boolean = false
  public isClashed: boolean = false
  public flightSpeed: number = 0.2
  constructor() {
    super()
    this.init = this.init.bind(this)
    this.switchRotate = this.switchRotate.bind(this)
    this.checkVector = this.checkVector.bind(this)
  }

  public async init(): Promise<void> {
    try {
      const spaceShipObj = await loadSpaceShip()
      this.add(spaceShipObj)
      this.scale.x = 0.2
      this.scale.y = 0.2
      this.scale.z = 0.2
      // this.rotateY(90)
      this.rotateX(90)
    } catch (err) {
      const geometry: Geometry | BufferGeometry = new BoxGeometry(1, 0.2, 0.2)
      const material: Material | Material[] = new MeshNormalMaterial()
      this.add(new Mesh(geometry, material))
    }
  }
  public switchRotate() {
    this.isRotation = !this.isRotation
  }

  public touch(obj: Object3D): boolean {
    const x1 = obj.position.x + obj.scale.x / 2
    const x2 = obj.position.x - obj.scale.x / 2
    const y1 = obj.position.y + obj.scale.y / 2
    const y2 = obj.position.y - obj.scale.y / 2
    const z1 = obj.position.z + obj.scale.z / 2
    const z2 = obj.position.z - obj.scale.z / 2
    return (
      this.checkVector(x1, y1, z1) ||
      this.checkVector(x2, y1, z1) ||
      this.checkVector(x1, y2, z1) ||
      this.checkVector(x2, y2, z1) ||
      this.checkVector(x1, y1, z2) ||
      this.checkVector(x1, y2, z2) ||
      this.checkVector(x2, y1, z2) ||
      this.checkVector(x2, y2, z2)
    )
  }

  private checkVector(x: number, y: number, z: number): boolean {
    return (
      x > this.position.x - this.scale.x / 2 &&
      x < this.position.x + this.scale.x / 2 &&
      y > this.position.y - this.scale.y / 2 &&
      y < this.position.y + this.scale.y / 2 &&
      z > this.position.z - this.scale.z / 2 &&
      z < this.position.z + this.scale.z / 2
    )
  }
}
