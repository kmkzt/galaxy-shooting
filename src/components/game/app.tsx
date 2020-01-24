import React, { Fragment, useRef, Suspense } from 'react'
import Models from './Models'
import useCameraControl from './Camera'
import { useFrame, useThree } from 'react-three-fiber'
import { PerspectiveCamera, Scene, Color, Camera } from 'three'

function Main() {
  useCameraControl()
  useFrame(({ gl, scene, camera }) => {
    gl.autoClear = true
    gl.setClearColor(0x333366, 1)
    gl.clearDepth()
    gl.setScissorTest(true)
    gl.setScissor(0, 0, window.innerWidth, window.innerHeight)
    gl.setViewport(0, 0, window.innerWidth, window.innerHeight)
    gl.render(scene, camera)
  })
  return (
    <>
      <hemisphereLight
        args={[0xeeeeff, 0x222222, 1]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <Models />
    </>
  )
}

function PlaceMap() {
  const camera = useRef<PerspectiveCamera>(new PerspectiveCamera())
  const scene = useRef<Scene>(new Scene())
  const { size } = useThree()
  useFrame(({ gl }) => {
    if (!camera.current || !scene.current) return
    gl.autoClear = true
    gl.setClearColor(0x000000, 1)
    gl.clearDepth()
    gl.setScissorTest(true)
    gl.setScissor(20, 20, window.innerWidth / 4, window.innerHeight / 4)
    gl.setViewport(20, 20, window.innerWidth / 4, window.innerHeight / 4)
    camera.current.rotateX(Math.PI / 10)
    gl.render(new Scene(), camera.current)
  })
  return (
    <>
      <perspectiveCamera
        ref={camera}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        rotate={camera}
        // onUpdate={(self: any) => self.updateProjectionMatrix()}
      />
    </>
  )
}
function GameApp() {
  return (
    <>
      <Main />
      <PlaceMap />
    </>
  )
}

export default GameApp
