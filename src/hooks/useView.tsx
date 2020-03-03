import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { PerspectiveCamera, Color, Scene, Vector2, Camera } from 'three'

export interface ViewOption {
  isMain?: boolean
  left: number
  bottom: number
  width: number
  height: number
  background: Color
  updateCamera: ({
    camera,
    scene,
    mouse
  }: {
    camera: Camera
    scene: Scene
    mouse: Vector2
  }) => Camera
}

export const useView = (option: ViewOption) => {
  const cam = useRef<PerspectiveCamera>()
  const { size, mouse } = useThree()

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
  if (process.env.NODE_ENV !== 'prodcution') {
    const handleLogger = useCallback(
      (e: MouseEvent) => {
        console.log(e, size, mouse)
      },
      [size, mouse]
    )
    useEffect(() => {
      window.addEventListener('click', handleLogger)
      // return window.removeEventListener('click', handleLogger)
    }, [handleLogger])
  }
  useFrame(
    ({ scene, camera, gl, mouse, raycaster }) => {
      if (!cam.current) return
      option.updateCamera({ camera: cam.current, scene, mouse })
      if (option.isMain) {
        gl.autoClear = true
      } else {
        gl.autoClear = true
        gl.clearDepth()
      }
      gl.setViewport(left, bottom, width, height)
      gl.setScissor(left, bottom, width, height)
      gl.setScissorTest(true)
      gl.setClearColor(option.background)
      ;(camera as any).aspect = width / height
      ;(camera as any).fov = cam.current.fov
      camera.position.copy(cam.current.position)
      camera.rotation.copy(cam.current.rotation)
      camera.updateProjectionMatrix()
      gl.render(scene, camera)
    },
    option.isMain ? Infinity : 0
  )
  return cam
}
