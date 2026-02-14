// reducer.ts
import type { Action } from 'redux'
import actionCreatorFactory, { isType } from 'typescript-fsa'

const load = actionCreatorFactory('LOAD')

export type State = {
  spaceShip: boolean
  meteolites: boolean
}
export const initialState: State = {
  spaceShip: false,
  meteolites: false,
}
export const LOAD_UPDATE = load<Partial<State>>('UPDATE')
export const LOAD_RESET = load('RESET')

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, LOAD_UPDATE)) {
    return { ...state, ...action.payload }
  }
  if (isType(action, LOAD_RESET)) {
    return initialState
  }
  return state
}
