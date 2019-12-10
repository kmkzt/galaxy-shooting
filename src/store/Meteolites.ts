// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import { Obj } from '@/interface/Obj'

const meteos = actionCreatorFactory('meteo')

export const METEOS_UPDATE = meteos<State>('UPDATE')
export const METEO_REPLACE = meteos<Meteo>('REPLACE_METEO')
export const METEOS_RESET = meteos('RESET')

const initialState: State = {}

export type State = {
  [key: number]: Meteo
}
export interface Meteo extends Obj {
  guid: number
  pattern: number
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, METEOS_UPDATE)) {
    return {
      ...state,
      ...action.payload
    }
  }
  if (isType(action, METEO_REPLACE)) {
    const replaceMeteo = action.payload
    return {
      ...state,
      [replaceMeteo.guid]: replaceMeteo
    }
  }
  if (isType(action, METEOS_RESET)) {
    return initialState
  }
  return state
}
