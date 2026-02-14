import { Provider } from 'react-redux'
import { Menu } from '@/components/ui/Menu'
import store from '@/store'

const UiPanel = () => (
  <Provider store={store}>
    <Menu />
  </Provider>
)
export default UiPanel
