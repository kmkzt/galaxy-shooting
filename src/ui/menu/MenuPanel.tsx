import { Fragment } from 'react'
import { useGameStore } from '../../store/gameStore'
import Loading from './Loading'
import Start from './Start'

const Menu = () => {
  const active = useGameStore((s) => s.play.active)
  if (active) return null
  return (
    <Fragment>
      <Loading zIndex={100} background="#555" />
      <Start zIndex={50} />
    </Fragment>
  )
}

const MenuPanel = () => <Menu />
export default MenuPanel
