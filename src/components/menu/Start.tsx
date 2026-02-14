import { type FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Layer, { type Props } from '@/components/style/Layer'
import { PLAY_START } from '@/store/Play'

const Start: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const handleStartClick = useCallback(() => dispatch(PLAY_START()), [dispatch])
  return (
    <Layer {...props}>
      <button type="button" onClick={handleStartClick}>
        START
      </button>
    </Layer>
  )
}

export default Start
