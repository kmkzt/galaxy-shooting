import { createStore } from 'redux'
import { reducer as score, State as Score } from '@/store/Score'

// import createStore from 'redux'
// import  from 'react-redux'

export type RootStore = Score

export default createStore(score)
