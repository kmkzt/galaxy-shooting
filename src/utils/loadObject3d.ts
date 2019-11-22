import { Mesh, Group, TextureLoader, Texture } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

interface LoadObjectParam {
  resourcePath?: string
  texturePath: string
  objectPath: string
}
export const loadObject3D = async ({
  resourcePath,
  texturePath,
  objectPath
}: LoadObjectParam): Promise<Group> =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(), 100000)
    const texture: Texture = new TextureLoader().load(texturePath)
    const loader = new OBJLoader()
    loader.setResourcePath(resourcePath || 'http://localhost:9000')
    loader.load(objectPath, (obj: Group) => {
      obj.traverse(child => {
        if ((child as any).isMesh) {
          ;((child as Mesh).material as any).normalMap = texture
        }
      })
      obj.scale.x /= 2
      obj.scale.y /= 2
      obj.scale.z /= 2
      resolve(obj)
    })
  })
