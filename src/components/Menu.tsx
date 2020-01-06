import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '@/store'
import { PLAY_MENU_TOGGLE } from '@/store/Play'

export const Menu: FC<{}> = ({}) => {
  const point = useSelector<RootStore, number>(({ score }) => score.point)
  const meteosCount = useSelector<RootStore, number>(
    ({ meteos }) => Object.keys(meteos).length
  )
  const dispatch = useDispatch()
  const handleClickMenu = useCallback(() => dispatch(PLAY_MENU_TOGGLE()), [
    dispatch
  ])
  return (
    <Wrap>
      <div>POINT: {point}</div>
      <div>METEOLITES: {meteosCount}</div>
      <button onClick={handleClickMenu}>MENU</button>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  position: fixed;
  background: rgba(255, 255, 255, 0.4);
  bottom: 0;
  right: 0;
  padding: 12px;
`
