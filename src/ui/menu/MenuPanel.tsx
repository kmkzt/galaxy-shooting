import { Fragment } from 'react'
import { Provider, useSelector } from 'react-redux'
import store, { type RootStore } from '@/store'
import Loading from './Loading'
import Start from './Start'

const Menu = () => {
  const active = useSelector<RootStore, boolean>(({ play }) => play.active)
  if (active) return null
  return (
    <Fragment>
      <Loading zIndex={100} background="#555" />
      <Start zIndex={50} />
    </Fragment>
  )
}
const MenuPanel = () => (
  <Provider store={store}>
    <Menu />
  </Provider>
)
export default MenuPanel
