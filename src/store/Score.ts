// reducer.ts
import type { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const score = actionCreatorFactory('SCORE')

export const POINT_SET = score<number>('POINT_SET')
export const POINT_INC = score<number>('POINT_INC')
export const POINT_DEC = score<number>('POINT_DEC')
export const POINT_RESET = score('POINT_RESET')

export const initialState = { point: 0 }
export type State = { point: number }

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, POINT_SET)) {
    return { ...state, point: action.payload }
  }
  if (isType(action, POINT_INC)) {
    return { ...state, point: state.point + action.payload }
  }
  if (isType(action, POINT_DEC)) {
    return { ...state, point: state.point - action.payload }
  }
  if (isType(action, POINT_RESET)) {
    return { ...state, point: 0 }
  }
  return state
}
