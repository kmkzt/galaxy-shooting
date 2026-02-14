import { type Action, combineReducers, createStore } from 'redux'
import actionCreatorFactory, { isType } from 'typescript-fsa'
import * as Camera from './Camera'
import * as Lasers from './Lasers'
import * as Load from './Load'
import * as Meteolites from './Meteolites'
import * as Play from './Play'
import * as Score from './Score'
import * as SpaceShip from './SpaceShip'

export type RootStore = {
  score: Score.State
  play: Play.State
  spaceShip: SpaceShip.State
  cam: Camera.State
  meteos: Meteolites.State
  lasers: Lasers.State
  load: Load.State
}

const root = actionCreatorFactory('root')
export const ROOT_UPDATE = root<Partial<RootStore>>('UPDATE')
const moduleReducer = combineReducers({
  score: Score.reducer,
  play: Play.reducer,
  spaceShip: SpaceShip.reducer,
  cam: Camera.reducer,
  meteos: Meteolites.reducer,
  lasers: Lasers.reducer,
  load: Load.reducer,
})
const rootReducer = (
  state: RootStore = moduleReducer(undefined, { type: '' }),
  action: Action,
): RootStore => {
  if (isType(action, ROOT_UPDATE)) {
    return {
      ...state,
      ...action.payload,
    }
  }
  return moduleReducer(state, action)
}
// biome-ignore lint/suspicious/noExplicitAny: Redux createStore legacy API, will be replaced by Zustand
export default createStore<RootStore, any, Record<string, never>, Record<string, never>>(
  rootReducer,
  // biome-ignore lint/suspicious/noExplicitAny: accessing Redux DevTools extension
  (window as any).__REDUX_DEVTOOLS_EXTENSION__?.(),
)
