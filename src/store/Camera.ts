// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const score = actionCreatorFactory('CAMERA')

export const CAMERA_UPDATE = score<Partial<State>>('CAMERA/UPDATE')
export const CAMERA_RESET = score('CAMERA/RESET')

const initialState: State = {
  near: 9,
  distance: 15
}
export interface State {
  near: number
  distance: number
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, CAMERA_UPDATE)) {
    return { ...state, ...action.payload }
  }

  if (isType(action, CAMERA_RESET)) {
    return initialState
  }
  return state
}
