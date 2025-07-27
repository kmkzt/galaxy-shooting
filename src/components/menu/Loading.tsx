import type { FC } from 'react';
import React from 'react'
import { useSelector } from 'react-redux'
import type { RootStore } from '@/store'
import type { Props } from '@/components/style/Layer';
import Layer from '@/components/style/Layer'

const Loading: FC<Props> = props => {
  const load = useSelector((state: RootStore) => state.load)
  if (Object.values(load).every(l => l)) return null
  return (
    <Layer {...props}>
      <div>loading...</div>
    </Layer>
  )
}

export default Loading
