import type { Mesh, Group, Texture } from 'three';
import { TextureLoader } from 'three'
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
    loader.setResourcePath((resourcePath || '/') + '/assets/textures')
    loader.load(objectPath, (obj: Group) => {
      obj.traverse(child => {
        if ((child as any).isMesh) {
          ;((child as Mesh).material as any).normalMap = texture
        }
      })
      resolve(obj)
    })
  })
