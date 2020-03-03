import React, { useLayoutEffect, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { CAMERA_UPDATE } from '@/store/Camera'
import { PerspectiveCamera } from 'three'
interface Props {
  position: number[]
  fov: number
  near: number
  far: number
}
function ControlCamera(props: Props) {
  const ref = useRef<PerspectiveCamera>()
  const { camera, aspect, setDefaultCamera } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )

  const dispatch = useDispatch()
  /**
   * register camera status
   */
  useLayoutEffect(() => {
    dispatch(
      CAMERA_UPDATE({
        far: camera.far,
        near: camera.near,
        aspect
      })
    )
  }, [aspect, camera, dispatch])
  /**
   * change default camera
   */
  useEffect(() => {
    if (!ref.current) return
    setDefaultCamera(ref.current)
  })
  /**
   * COMMON FRAME BEHAVIOR
   */
  useFrame(({ camera }) => {
    camera.position.z = ship.position.z + cameraDistane
  })

  return <perspectiveCamera ref={ref} {...props} />
}

export default ControlCamera
