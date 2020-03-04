import React, { useLayoutEffect, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { CAMERA_UPDATE } from '@/store/Camera'
import useView from '@/hooks/useView'
import { PerspectiveCamera, Color } from 'three'
interface Props {
  position: number[]
  fov: number
  near: number
  far: number
}
function ControlCamera(props: Props) {
  const { aspect, setDefaultCamera } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )
  const dispatch = useDispatch()
  const ref = useView<PerspectiveCamera>({
    isMain: true,
    left: 0,
    bottom: 0,
    width: 1,
    height: 1,
    background: new Color(0x333366),
    updateCamera: ctx => {
      ctx.camera.position.z = ship.position.z + cameraDistane
    }
  })

  /**
   * register main camera status
   */
  useLayoutEffect(() => {
    if (!ref.current) return
    dispatch(
      CAMERA_UPDATE({
        aspect,
        far: ref.current.far,
        near: ref.current.near,
        position: ref.current.position
      })
    )
  }, [aspect, dispatch, ref])

  return <perspectiveCamera ref={ref} {...props} />
}

export default ControlCamera
