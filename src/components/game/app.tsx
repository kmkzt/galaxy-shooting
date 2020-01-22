import React, { Fragment } from 'react'
import Models from './Models'
import useCameraControl from './Camera'
import { useFrame } from 'react-three-fiber'
import { PerspectiveCamera } from 'three'

let camera2 = new PerspectiveCamera(40, 1, 1, 1000)
function GameApp() {
  useCameraControl()
  useFrame(({ gl, camera, scene }) => {
    gl.setClearColor(0x222222, 1)
    gl.clearDepth() // important!
    gl.setScissorTest(true)
    gl.setScissor(0, 0, window.innerWidth, window.innerHeight)
    gl.setViewport(0, 0, window.innerWidth, window.innerHeight)
    gl.render(scene, camera)

    // Mutiple Camera
    camera2.position.copy(camera.position)
    camera2.quaternion.copy(camera.quaternion)
    camera2.rotation.x += Math.PI / 10
    camera2.rotation.y += Math.PI / 10
    camera2.rotation.z += Math.PI / 10
    gl.setClearColor(0x222222, 1)
    gl.clearDepth() // important!
    gl.setScissorTest(true)
    gl.setScissor(20, 20, window.innerWidth / 4, window.innerHeight / 4)
    gl.setViewport(20, 20, window.innerWidth / 4, window.innerHeight / 4)
    gl.render(scene, camera2)
  })
  return (
    <Fragment>
      <hemisphereLight
        args={[0xeeeeff, 0x222222, 1]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <Models />
    </Fragment>
  )
}

export default GameApp
