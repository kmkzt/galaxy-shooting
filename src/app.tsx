import React, { FC, lazy, Suspense } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader/root'
import Menu from '@/components/menu'

const GamePanel = lazy(() => import('@/components/game'))
const UiPanel = lazy(() => import('@/components/ui'))

const DisplayArea = styled.div`
  width: 100vw;
  height: 100vh;
`
const App: FC = () => {
  return (
    <DisplayArea>
      <Menu />
      <Suspense fallback={null}>
        <GamePanel />
        <UiPanel />
      </Suspense>
    </DisplayArea>
  )
}

export default hot(App)
