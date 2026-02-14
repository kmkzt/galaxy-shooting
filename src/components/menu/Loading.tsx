import type { FC } from 'react'
import { useSelector } from 'react-redux'
import Layer, { type Props } from '@/components/style/Layer'
import type { RootStore } from '@/store'

const Loading: FC<Props> = (props) => {
  const load = useSelector((state: RootStore) => state.load)
  if (Object.values(load).every((l) => l)) return null
  return (
    <Layer {...props}>
      <div>loading...</div>
    </Layer>
  )
}

export default Loading
