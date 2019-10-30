import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '@/store'
import { PLAY_MENU_TOGGLE } from '@/store/Play'

export const Menu: FC<{}> = ({}) => {
  const point = useSelector<RootStore, number>(({ score }) => score.point)
  const dispatch = useDispatch()
  const handleClickMenu = useCallback(() => dispatch(PLAY_MENU_TOGGLE()), [
    dispatch
  ])
  return (
    <Wrap>
      <p>POINT: {point}</p>
      <button onClick={handleClickMenu}>MENU</button>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`
