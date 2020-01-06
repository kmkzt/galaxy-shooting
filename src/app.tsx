import React, { FC } from 'react'
import styled from 'styled-components'
import UiPanel from '@/components/ui'
import GamePanel from '@/components/game'
import { hot } from 'react-hot-loader/root'

const DisplayArea = styled.div`
  width: 100vw;
  height: 100vh;
`
const App: FC = () => {
  return (
    <DisplayArea>
      <GamePanel />
      <UiPanel />
    </DisplayArea>
  )
}

export default hot(App)
