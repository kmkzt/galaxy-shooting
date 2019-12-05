// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import { Obj } from '@/interface/Obj'

const meteos = actionCreatorFactory('meteo')

export const METEOS_UPDATE = meteos<State>('UPDATE')
export const METEOS_RESET = meteos('RESET')

const initialState: State = []

export type State = Array<Meteo>
export interface Meteo extends Obj {}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, METEOS_UPDATE)) {
    return action.payload
  }
  if (isType(action, METEOS_RESET)) {
    return initialState
  }
  return state
}
