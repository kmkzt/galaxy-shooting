import React from 'react'
import { useDispatch } from 'react-redux'
import { POINT_INC } from '@/store/Score'
import useGameFrame from '@/hooks/useGameFrame'

const Point = () => {
  const dispatch = useDispatch()
  /**
   * POINT COUNT
   */
  useGameFrame(() => dispatch(POINT_INC(1)))

  return null
}

export default Point
