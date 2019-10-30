import styled from 'styled-components'
import React, { FC, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '@/store'
import { PLAY_START } from '@/store/Play'

const Layer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100vh;
  height: 100vw;
  background: rgba(0, 0, 0, 0.4);
  padding: 12px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`

export const Start: FC<{}> = () => {
  const active = useSelector<RootStore, boolean>(
    ({ play }) => play.active && !play.menu
  )
  const dispatch = useDispatch()
  const handleStartClick = useCallback(() => dispatch(PLAY_START()), [dispatch])
  return active ? null : (
    <Layer>
      <button onClick={handleStartClick}>START</button>
    </Layer>
  )
}
