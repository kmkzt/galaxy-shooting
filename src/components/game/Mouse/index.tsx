import React, { useCallback, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useThree } from 'react-three-fiber'
import { PLAY_STOP } from '@/store/Play'

interface Props {
  el: HTMLElement | null
}
function useElementMouse({ el }: Props) {
  const { camera, raycaster, mouse } = useThree()

  const dispatch = useDispatch()
  /**
   * MOUSE MOVE BEHAVIOR
   */
  const handleMouse = useCallback(
    (x: number, y: number) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
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
    [camera, el, mouse, raycaster]
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
    if (!el) return
    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('mousemove', handlePointerMove)
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('mousemove', handlePointerMove)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handlePointerMove, handleTouchMove, handleMouseLeave, el])
}

export default useElementMouse
