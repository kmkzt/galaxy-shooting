import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { Keyboard } from './enum/keyboard'

interface Props {
  onKeyboard: (code: Keyboard) => void
}

export const Controler: FC<Props> = ({ onKeyboard }) => {
  const handleClickUp = useCallback(() => {
    onKeyboard(Keyboard.UP_ARROW)
  }, [onKeyboard])
  const handleClickRight = useCallback(() => {
    onKeyboard(Keyboard.RIGHT_ARROW)
  }, [onKeyboard])
  const handleClickDown = useCallback(() => {
    onKeyboard(Keyboard.DOWN_ARROW)
  }, [onKeyboard])
  const handleClickLeft = useCallback(() => {
    onKeyboard(Keyboard.LEFT_ARROW)
  }, [onKeyboard])
  return (
    <Wrap>
      <button className="up" onClick={handleClickUp}>
        ↑
      </button>
      <button className="right" onClick={handleClickRight}>
        →
      </button>
      <button className="down" onClick={handleClickDown}>
        ↓
      </button>
      <button className="left" onClick={handleClickLeft}>
        ←
      </button>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`
