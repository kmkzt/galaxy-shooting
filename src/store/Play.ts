// reducer.ts
import type { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const play = actionCreatorFactory('PLAY')

export type State = {
  active: boolean
}
export const initialState: State = {
  active: false
}
export const PLAY_START = play('START')
export const PLAY_STOP = play('STOP')

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, PLAY_START)) {
    return { ...state, active: true }
  }
  if (isType(action, PLAY_STOP)) {
    return { ...state, active: false }
  }
  return state
}
