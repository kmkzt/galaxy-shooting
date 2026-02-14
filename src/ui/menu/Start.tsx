import type { FC } from 'react'
import { useCallback } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { LayerProps } from '../style/Layer'
import Layer from '../style/Layer'

const Start: FC<LayerProps> = (props) => {
  const startPlay = useGameStore((s) => s.startPlay)
  const handleStartClick = useCallback(() => startPlay(), [startPlay])
  return (
    <Layer {...props}>
      <button type="button" onClick={handleStartClick}>
        START
      </button>
    </Layer>
  )
}

export default Start
