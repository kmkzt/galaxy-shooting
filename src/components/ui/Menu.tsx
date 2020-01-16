import React, { FC, useCallback, useLayoutEffect, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '@/store'
import { PLAY_STOP } from '@/store/Play'
import useMeteoData from '@/hooks/useMeteoData'
import { SPACESHIP_UPDATE } from '@/store/SpaceShip'

export const Menu: FC<{}> = ({}) => {
  const point = useSelector<RootStore, number>(({ score }) => score.point)
  const shipPosition = useSelector<RootStore, number>(({ spaceShip }) =>
    Math.floor(spaceShip.position.z)
  )
  const meteosCount = useSelector<RootStore, number>(
    ({ meteos }) => Object.keys(meteos).length
  )
  const { set } = useMeteoData({ patternNum: 4 })
  const dispatch = useDispatch()
  const playStop = useCallback(() => dispatch(PLAY_STOP()), [dispatch])
  const restart = useCallback(() => {
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
    playStop()
    set(100)
  }, [dispatch, playStop, set])

  /**
   * check window Active
   */
  useEffect(() => {
    if (!document.hasFocus()) {
      playStop()
    }
  })

  return (
    <Wrap>
      <div>POINTS: {point}</div>
      <div>SHIP POSITION: {shipPosition}</div>
      <div>METEOLITES: {meteosCount}</div>
      <button onClick={playStop}>MENU</button>
      <button onClick={restart}>RESTART</button>
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
