// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const cam = actionCreatorFactory('CAMERA')

export const CAMERA_UPDATE = cam<Partial<State>>('CAMERA/UPDATE')
export const CAMERA_RESET = cam('CAMERA/RESET')

export const initialState: State = {
  fov: 60,
  near: 9,
  far: 200,
  distance: 15,
  aspect: 1
}
export interface State {
  fov: number
  near: number
  far: number
  distance: number
  aspect: number
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
