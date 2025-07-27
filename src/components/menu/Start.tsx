import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { PLAY_START } from '@/store/Play'
import type { Props } from '@/components/style/Layer'
import Layer from '@/components/style/Layer'

const Start: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const handleStartClick = useCallback(() => dispatch(PLAY_START()), [dispatch])
  return (
    <Layer {...props}>
      <button onClick={handleStartClick}>START</button>
    </Layer>
  )
}

export default Start
