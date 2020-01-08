import React, { Fragment } from 'react'
import { Provider, useSelector } from 'react-redux'
import store, { RootStore } from '@/store'
import Start from './Start'
import Loading from './Loading'

const Menu = () => {
  const active = useSelector<RootStore, boolean>(
    ({ play }) => play.active && !play.menu
  )
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
