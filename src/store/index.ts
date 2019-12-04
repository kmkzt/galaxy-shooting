import { createStore, combineReducers } from 'redux'
import { reducer as score, State as Score } from './Score'
import { reducer as play, State as Play } from './Play'
import { reducer as spaceShip, State as SpaceShip } from './SpaceShip'
import { reducer as cam, State as Camera } from './Camera'

export type RootStore = {
  score: Score
  play: Play
  spaceShip: SpaceShip
  cam: Camera
}

export default createStore<RootStore, any, {}, {}>(
  combineReducers({ score, play, spaceShip, cam })
)
