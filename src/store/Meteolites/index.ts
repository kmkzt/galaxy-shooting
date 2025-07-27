// reducer.ts
import type { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import type { Obj } from '@/interface/Obj'

const meteos = actionCreatorFactory('meteo')

export const METEOS_UPDATE = meteos<State>('UPDATE')
export const METEOS_REPLACE_ALL = meteos<State>('REPLACE')
export const METEOS_RESET = meteos('RESET')
export const METEO_REPLACE = meteos<Meteo>('REPLACE_METEO')
export const METEO_REMOVE = meteos<number>('REMOVE_METEO')

export const initialState: State = {}

export type State = {
  [key: number]: Meteo
}
export interface Meteo extends Obj {
  guid: number
  pattern: number
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, METEOS_REPLACE_ALL)) {
    return action.payload
  }
  if (isType(action, METEOS_UPDATE)) {
    return {
      ...state,
      ...action.payload
    }
  }
  if (isType(action, METEO_REPLACE)) {
    return {
      ...state,
      [action.payload.guid]: {
        ...state[action.payload.guid],
        ...action.payload
      }
    }
  }
  if (isType(action, METEO_REMOVE)) {
    const guid = action.payload
    const { [guid]: _remove, ...update } = state
    return update
  }
  if (isType(action, METEOS_RESET)) {
    return initialState
  }
  return state
}
