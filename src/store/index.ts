import { createStore, combineReducers, Action } from 'redux'
import actionCreatorFactory, { isType } from 'typescript-fsa'
import * as Score from './Score'
import * as Play from './Play'
import * as SpaceShip from './SpaceShip'
import * as Camera from './Camera'
import * as Meteolites from './Meteolites'

export type RootStore = {
  score: Score.State
  play: Play.State
  spaceShip: SpaceShip.State
  cam: Camera.State
  meteos: Meteolites.State
}

const initialState: RootStore = {
  score: Score.initialState,
  play: Play.initialState,
  spaceShip: SpaceShip.initialState,
  cam: Camera.initialState,
  meteos: Meteolites.initialState
}

const root = actionCreatorFactory('root')
export const ROOT_UPDATE = root<Partial<RootStore>>('UPDATE')
const moduleReducer = combineReducers({
  score: Score.reducer,
  play: Play.reducer,
  spaceShip: SpaceShip.reducer,
  cam: Camera.reducer,
  meteos: Meteolites.reducer
})
const rootReducer = (
  state: RootStore = initialState,
  action: Action
): RootStore => {
  if (isType(action, ROOT_UPDATE)) {
    return {
      ...state,
      ...action.payload
    }
  }
  return moduleReducer(state, action)
}
export default createStore<RootStore, any, {}, {}>(rootReducer)
