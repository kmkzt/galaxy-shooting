import React, { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { PLAY_START } from '@/store/Play'
import Layer, { Props } from '@/components/style/Layer'

const Start: FC<Props> = props => {
  const dispatch = useDispatch()
  const handleStartClick = useCallback(() => dispatch(PLAY_START()), [dispatch])
  return (
    <Layer {...props}>
      <button onClick={handleStartClick}>START</button>
    </Layer>
  )
}

export default Start
