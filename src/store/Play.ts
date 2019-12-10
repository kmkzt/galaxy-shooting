// reducer.ts
import { Action } from 'redux'
import { isType } from 'typescript-fsa'
import actionCreatorFactory from 'typescript-fsa'

const play = actionCreatorFactory('PLAY')

export type State = {
  active: boolean
  menu: boolean
}
export const initialState: State = {
  active: false,
  menu: false
}
export const PLAY_START = play('START')
export const PLAY_MENU_TOGGLE = play('MENU_TOGGLE')
export const PLAY_END = play('END')

export const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, PLAY_START)) {
    return { ...state, active: true, menu: false }
  }
  if (isType(action, PLAY_END)) {
    return { ...state, active: false }
  }
  if (isType(action, PLAY_MENU_TOGGLE)) {
    return { ...state, menu: !state.menu }
  }
  return state
}
