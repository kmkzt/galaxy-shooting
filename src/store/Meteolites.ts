// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const meteos = actionCreatorFactory('meteo')

export const METEOS_UPDATE = meteos<State>('UPDATE')
export const METEOS_RESET = meteos('RESET')

const initialState: State = []

type State = Meteo[]
export interface Meteo {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, METEOS_UPDATE)) {
    return action.payload
  }
  if (isType(action, METEOS_RESET)) {
    return initialState
  }
  return state
}
