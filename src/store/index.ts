import { createStore, combineReducers } from 'redux'
import { reducer as score, State as Score } from '@/store/Score'
import { reducer as play, State as Play } from '@/store/Play'

export type RootStore = {
  score: Score
  play: Play
}

export default createStore<RootStore, any, {}, {}>(
  combineReducers({ score, play })
)
