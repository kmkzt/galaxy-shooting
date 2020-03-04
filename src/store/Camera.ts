// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import { Xyz } from '@/interface/Obj'

const cam = actionCreatorFactory('CAMERA')

export const CAMERA_UPDATE = cam<Partial<State>>('CAMERA/UPDATE')
export const CAMERA_RESET = cam('CAMERA/RESET')

export const initialState: State = {
  fov: 60,
  near: 9,
  far: 200,
  distance: 15,
  aspect: 1,
  position: {
    x: 0,
    y: 0,
    z: 0
  }
}
export interface State {
  fov: number
  near: number
  far: number
  distance: number
  aspect: number
  position: Xyz
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
