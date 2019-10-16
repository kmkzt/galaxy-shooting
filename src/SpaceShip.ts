import {
  Mesh,
  // Renderer,
  Camera,
  Geometry,
  Material,
  BoxGeometry,
  MeshNormalMaterial,
  BufferGeometry
} from 'three'

export class SpaceShip extends Mesh {
  public isRotation: boolean = false
  constructor(
    geometry: Geometry | BufferGeometry = new BoxGeometry(1, 0.2, 0.2),
    material: Material | Material[] = new MeshNormalMaterial()
  ) {
    super(geometry, material)
    this.switchRotate = this.switchRotate.bind(this)
  }

  public switchRotate() {
    this.isRotation = !this.isRotation
  }
}
