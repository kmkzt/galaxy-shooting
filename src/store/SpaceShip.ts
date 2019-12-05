// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import { Obj } from '@/interface/Obj'

const ship = actionCreatorFactory('SPACESHIP')

export const SPACESHIP_UPDATE = ship<Partial<State>>('UPDATE')
export const SPACESHIP_RESET = ship('RESET')

const initialState: State = {
  flightSpeed: 0.5,
  isClashed: false,
  isRotation: false,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 0, y: 0, z: 0 }
}
export interface State extends Obj {
  flightSpeed: number
  isClashed: boolean
  isRotation: boolean
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, SPACESHIP_UPDATE)) {
    return { ...state, ...action.payload }
  }
  if (isType(action, SPACESHIP_RESET)) {
    return initialState
  }
  return state
}
