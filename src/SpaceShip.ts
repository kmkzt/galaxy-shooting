import {
  Mesh,
  Geometry,
  Material,
  BoxGeometry,
  MeshNormalMaterial,
  BufferGeometry,
  Object3D
} from 'three'

export class SpaceShip extends Mesh {
  public isRotation: boolean = false
  public isClashed: boolean = false
  constructor(
    geometry: Geometry | BufferGeometry = new BoxGeometry(1, 0.2, 0.2),
    material: Material | Material[] = new MeshNormalMaterial()
  ) {
    super(geometry, material)
    this.switchRotate = this.switchRotate.bind(this)
    this.checkVector = this.checkVector.bind(this)
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
