import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect,
  Fragment
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { CAMERA_UPDATE } from '@/store/Camera'
import { PLAY_STOP } from '@/store/Play'
import { PerspectiveCamera } from 'three'

const app = document.getElementById('app') as HTMLElement

interface Props {
  position: [number, number, number]
  fov: number
  near: number
  far: number
}
function ControlCamera(props: Props) {
  const ref = useRef<PerspectiveCamera>()
  const { camera, raycaster, mouse, aspect, setDefaultCamera } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )

  const dispatch = useDispatch()
  /**
   * MOUSE MOVE BEHAVIOR
   */
  const handleMouse = useCallback(
    (x: number, y: number) => {
      const rect = app.getBoundingClientRect()
      /**
       * Mouse Point 2D
       */
      mouse.x = ((x - rect.left) / rect.width) * 2 - 1
      mouse.y = -((y - rect.top) / rect.height) * 2 + 1

      /**
       * SET Raycaster
       */
      raycaster.setFromCamera(mouse, camera)
    },
    [camera, mouse, raycaster]
  )
  const handlePointerMove = useCallback(
    (e: PointerEvent | MouseEvent) => {
      e.preventDefault()
      handleMouse(e.clientX, e.clientY)
    },
    [handleMouse]
  )

  const handleTouchMove = useCallback((e: TouchEvent) => e.preventDefault(), [])
  /**
   * MOUSE LEAVE BEHAVIOR
   */
  const handleMouseLeave = useCallback(
    (_e: MouseEvent) => {
      dispatch(PLAY_STOP())
    },
    [dispatch]
  )
  useLayoutEffect(() => {
    app.addEventListener('pointermove', handlePointerMove)
    app.addEventListener('mousemove', handlePointerMove)
    app.addEventListener('touchmove', handleTouchMove, { passive: false })
    app.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      app.removeEventListener('pointermove', handlePointerMove)
      app.removeEventListener('mousemove', handlePointerMove)
      app.removeEventListener('touchmove', handleTouchMove)
      app.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handlePointerMove, handleTouchMove, handleMouseLeave])

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
