// reducer.ts
import type { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'
import type { Obj } from '@/interface/Obj'
import type { Omit } from 'react-redux'

const lasers = actionCreatorFactory('LASER')

export const LASERS_UPDATE = lasers<State>('UPDATE')
export const LASER_ADD = lasers<Omit<Laser, 'guid'>>('ADD')

export const LASER_REPLACE = lasers<Partial<Laser> & { guid: number }>(
  'REPLACE'
)
export const LASER_REMOVE = lasers<number>('REMOVE')
export const LASERS_RESET = lasers('RESET')

export const initialState: State = {}

let nextId = 0
export type State = {
  [key: number]: Laser
}
export interface Laser extends Obj {
  guid: number
}

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, LASERS_UPDATE)) {
    return {
      ...state,
      ...action.payload,
    }
  }
  if (isType(action, LASER_ADD)) {
    const updateLaser = {
      ...state,
      [nextId]: {
        guid: nextId,
        ...action.payload,
      },
    }
    nextId += 1
    return updateLaser
  }
  if (isType(action, LASER_REPLACE)) {
    return {
      ...state,
      [action.payload.guid]: {
        ...state[action.payload.guid],
        ...action.payload,
      },
    }
  }
  if (isType(action, LASER_REMOVE)) {
    const guid = action.payload
    const { [guid]: _, ...update } = state
    return update
  }
  if (isType(action, LASERS_RESET)) {
    return initialState
  }
  return state
}
