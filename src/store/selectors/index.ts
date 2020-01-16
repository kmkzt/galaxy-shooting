import { RootStore } from '@/store'

export const IS_GAME_ACTIVE = (state: RootStore) =>
  state.play.active && !state.spaceShip.isClashed
