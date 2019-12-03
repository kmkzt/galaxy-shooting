// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const score = actionCreatorFactory('SCORE')

export const SPACESHIP_UPDATE = score<Partial<State>>('SPACESHIP/UPDATE')
export const SPACESHIP_RESET = score('SPACESHIP/RESET')

const initialState: State = {
  flightSpeed: 0.5,
  isClashed: false,
  isRotation: false
}
export interface State {
  flightSpeed: number
  isClashed: boolean
  isRotation: boolean
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, SPACESHIP_UPDATE)) {
    return { ...state, ...action.payload }
  }
  if (isType(action, SPACESHIP_UPDATE)) {
    return { ...state, ...action.payload }
  }
  if (isType(action, SPACESHIP_RESET)) {
    return initialState
  }
  return state
}
