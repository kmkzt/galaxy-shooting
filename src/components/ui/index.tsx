import React from 'react'
import { Provider } from 'react-redux'
import store from '@/store'
import { Menu } from '@/components/ui/Menu'

const UiPanel = () => (
  <Provider store={store}>
    <Menu />
  </Provider>
)
export default UiPanel
