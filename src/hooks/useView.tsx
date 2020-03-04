import React, { useRef, useMemo, useEffect, createContext } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { PerspectiveCamera, Color, Scene, Vector2, Camera } from 'three'

export interface ViewOption<T extends Camera = any> {
  isMain?: boolean
  left: number
  bottom: number
  width: number
  height: number
  background?: Color
  renderPriority?: number
  updateCamera: ({
    camera,
    scene,
    mouse
  }: {
    camera: T
    scene: Scene
    mouse: Vector2
  }) => T
}

const defaultOption: ViewOption = {
  isMain: true,
  left: 0,
  bottom: 0,
  width: 1,
  height: 1,
  updateCamera: ({ camera }) => camera
}
function useView<T extends Camera = Camera>(
  option: ViewOption = defaultOption
): React.MutableRefObject<T | undefined> {
  const cam = useRef<T>()
  const { size, setDefaultCamera } = useThree()

  const left = useMemo(() => Math.floor(size.width * option.left), [
    size.width,
    option.left
  ])
  const bottom = useMemo(() => Math.floor(size.height * option.bottom), [
    size.height,
    option.bottom
  ])
  const width = useMemo(() => Math.floor(size.width * option.width), [
    size.width,
    option.width
  ])
  const height = useMemo(() => Math.floor(size.height * option.height), [
    size.height,
    option.height
  ])

  /**
   * https://github.com/react-spring/react-three-fiber/blob/master/recipes.md#heads-up-display-rendering-multiple-scenes
   */
  useFrame(({ scene, camera, gl, mouse, raycaster }) => {
    if (!cam.current) return
    option.updateCamera({ camera: cam.current, scene, mouse })
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
    ;(camera as any).aspect = width / height
    if (cam.current instanceof PerspectiveCamera) {
      ;(camera as any).fov = cam.current.fov
    }
    camera.position.copy(cam.current.position)
    camera.rotation.copy(cam.current.rotation)
    gl.render(scene, camera)
  }, option.renderPriority)
  return cam
}

export default useView
