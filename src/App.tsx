import { lazy, Suspense } from 'react'
import styles from './App.module.css'
import MenuPanel from './ui/menu/MenuPanel'

const Scene = lazy(() => import('./scene/Scene'))
const HudPanel = lazy(() => import('./ui/hud/HudPanel'))

const App = () => {
  return (
    <div className={styles.displayArea}>
      <MenuPanel />
      <Suspense fallback={null}>
        <Scene />
        <HudPanel />
      </Suspense>
    </div>
  )
}

export default App
