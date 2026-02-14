import type { FC } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { LayerProps } from '../style/Layer'
import Layer from '../style/Layer'

const Loading: FC<LayerProps> = (props) => {
  const load = useGameStore((s) => s.load)
  if (Object.values(load).every((l) => l)) return null
  return (
    <Layer {...props}>
      <div>loading...</div>
    </Layer>
  )
}

export default Loading
