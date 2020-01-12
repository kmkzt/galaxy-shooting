import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '@/store'
import { PLAY_MENU_TOGGLE } from '@/store/Play'
import useMeteoData from '@/hooks/useMeteoData'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'

export const Menu: FC<{}> = ({}) => {
  const point = useSelector<RootStore, number>(({ score }) => score.point)
  const meteosCount = useSelector<RootStore, number>(
    ({ meteos }) => Object.keys(meteos).length
  )
  const { set } = useMeteoData({ patternNum: 4 })
  const dispatch = useDispatch()
  const handleClickMenu = useCallback(() => dispatch(PLAY_MENU_TOGGLE()), [
    dispatch
  ])
  const handleClickReset = useCallback(() => {
    dispatch(
      SPACESHIP_UPDATE({
        isClashed: false,
        position: {
          x: 0,
          y: 0,
          z: 0
        }
      })
    )
    set(100)
  }, [dispatch, set])
  return (
    <Wrap>
      <div>POINTS: {point}</div>
      <div>METEOLITES: {meteosCount}</div>
      <button onClick={handleClickMenu}>MENU</button>
      <button onClick={handleClickReset}>RESET</button>
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
