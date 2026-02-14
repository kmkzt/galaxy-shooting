import { useFrame, useThree } from '@react-three/fiber'
import type React from 'react'
import { useMemo, useRef } from 'react'
import type { Camera, Color, Scene, Vector2 } from 'three'
import { PerspectiveCamera } from 'three'

export interface ViewOption<T extends Camera = Camera> {
  isMain?: boolean
  left: number
  bottom: number
  width: number
  height: number
  background?: Color
  renderPriority?: number
  updateCamera: (params: { camera: T; scene: Scene; mouse: Vector2 }) => T
}

function useView<T extends Camera = Camera>(option: ViewOption<T>): React.RefObject<T | null> {
  const cam = useRef<T>(null)
  const { size, pointer } = useThree()

  const left = useMemo(() => Math.floor(size.width * option.left), [size.width, option.left])
  const bottom = useMemo(
    () => Math.floor(size.height * option.bottom),
    [size.height, option.bottom],
  )
  const width = useMemo(() => Math.floor(size.width * option.width), [size.width, option.width])
  const height = useMemo(
    () => Math.floor(size.height * option.height),
    [size.height, option.height],
  )

  useFrame(({ scene, camera, gl }) => {
    if (!cam.current) return
    option.updateCamera({ camera: cam.current, scene, mouse: pointer })
    gl.autoClear = true
    if (option.isMain) {
      gl.clearDepth()
    }
    gl.setViewport(left, bottom, width, height)
    gl.setScissor(left, bottom, width, height)
    gl.setScissorTest(true)
    if (option.background) {
      gl.setClearColor(option.background)
    }
    if (cam.current instanceof PerspectiveCamera) {
      ;(camera as PerspectiveCamera).aspect = width / height
      ;(camera as PerspectiveCamera).fov = cam.current.fov
    }
    camera.position.copy(cam.current.position)
    camera.rotation.copy(cam.current.rotation)
    gl.render(scene, camera)
  }, option.renderPriority)

  return cam
}

export default useView
