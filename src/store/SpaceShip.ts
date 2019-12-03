// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import { Vector3 } from 'three'

const score = actionCreatorFactory('SCORE')

export const SPACESHIP_UPDATE = score<Partial<State>>('SPACESHIP/UPDATE')
export const SPACESHIP_RESET = score('SPACESHIP/RESET')

const initialState: State = {
  flightSpeed: 0.5,
  isClashed: false,
  isRotation: false,
  position: { x: 0, y: 0, z: 0 }
}
export interface State {
  flightSpeed: number
  isClashed: boolean
  isRotation: boolean
  position: { x: number; y: number; z: number }
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
