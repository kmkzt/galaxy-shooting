import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import store from '@/store'
import { Menu } from '@/components/ui/Menu'
import { Start } from '@/components/ui/Start'

const UiPanel = () => (
  <Provider store={store}>
    <Fragment>
      <Start />
      <Menu />
    </Fragment>
  </Provider>
)
export default UiPanel
