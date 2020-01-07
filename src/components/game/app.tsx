import React, { Fragment, useCallback, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import Models from './Models'
import Point from './Point'

const app = document.getElementById('app') as HTMLElement

function Game() {
  const { camera, raycaster, mouse } = useThree()
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const { distance: cameraDistane } = useSelector(
    (state: RootStore) => state.cam
  )

  /**
   * HANDLE MOUSE
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
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const t: Touch = e.touches[0]
      handleMouse(t.clientX, t.clientY)
    },
    [handleMouse]
  )
  useLayoutEffect(() => {
    app.addEventListener('pointermove', handlePointerMove)
    app.addEventListener('mousemove', handlePointerMove)
    app.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      app.removeEventListener('pointermove', handlePointerMove)
      app.removeEventListener('mousemove', handlePointerMove)
      app.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handlePointerMove, handleTouchMove])

  /**
   * COMMON FRAME BEHAVIOR
   */
  useFrame(({ camera }) => {
    camera.position.z = ship.position.z + cameraDistane
  })
  return (
    <Fragment>
      <hemisphereLight
        args={[0xeeeeff, 0x222222, 1]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <Point />
      <Models />
    </Fragment>
  )
}

export default Game
