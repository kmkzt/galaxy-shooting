import React, { useCallback, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import { CAMERA_UPDATE } from '@/store/Camera'
import { PLAY_STOP } from '@/store/Play'

const app = document.getElementById('app') as HTMLElement

function useCameraControl() {
  const { camera, raycaster, mouse, aspect } = useThree()
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
  useLayoutEffect(() => {
    app.addEventListener('pointermove', handlePointerMove)
    app.addEventListener('mousemove', handlePointerMove)
    app.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      app.removeEventListener('pointermove', handlePointerMove)
      app.removeEventListener('mousemove', handlePointerMove)
      app.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handlePointerMove, handleTouchMove])

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
   * MOUSE LEAVE BEHAVIOR
   */
  const handleMouseLeave = useCallback(
    (_e: MouseEvent) => {
      dispatch(PLAY_STOP())
    },
    [dispatch]
  )
  useLayoutEffect(() => {
    app.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      app.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseLeave, handlePointerMove, handleTouchMove])
  /**
   * COMMON FRAME BEHAVIOR
   */
  useFrame(({ camera }) => {
    camera.position.z = ship.position.z + cameraDistane
  })
}

export default useCameraControl
