import type { Color } from 'three'
import { create } from 'zustand'

// Types
export interface Xyz {
  x: number
  y: number
  z: number
}

export interface Obj {
  position: Xyz
  scale: Xyz
  rotation: Xyz
  color?: Color
}

export interface Meteo extends Obj {
  guid: number
  pattern: number
}

export interface Laser extends Obj {
  guid: number
}

interface CameraState {
  fov: number
  near: number
  far: number
  distance: number
  aspect: number
  position: Xyz
}

interface SpaceShipState extends Obj {
  flightSpeed: number
  isClashed: boolean
  isRotation: boolean
}

interface GameState {
  // Score
  score: { point: number }
  incPoint: (amount: number) => void
  decPoint: (amount: number) => void
  resetPoint: () => void

  // Play
  play: { active: boolean }
  startPlay: () => void
  stopPlay: () => void

  // SpaceShip
  spaceShip: SpaceShipState
  updateSpaceShip: (data: Partial<SpaceShipState>) => void
  resetSpaceShip: () => void

  // Camera
  cam: CameraState
  updateCamera: (data: Partial<CameraState>) => void
  resetCamera: () => void

  // Meteolites
  meteos: Record<number, Meteo>
  replaceAllMeteos: (data: Record<number, Meteo>) => void
  updateMeteos: (data: Record<number, Meteo>) => void
  replaceMeteo: (data: Meteo) => void
  removeMeteo: (guid: number) => void
  resetMeteos: () => void

  // Lasers
  lasers: Record<number, Laser>
  addLaser: (data: Omit<Laser, 'guid'>) => void
  replaceLaser: (data: Partial<Laser> & { guid: number }) => void
  removeLaser: (guid: number) => void
  resetLasers: () => void

  // Load
  load: { spaceShip: boolean; meteolites: boolean }
  updateLoad: (data: Partial<{ spaceShip: boolean; meteolites: boolean }>) => void
  resetLoad: () => void

  // Computed (selector helper)
  isGameActive: () => boolean
}

const initialSpaceShip: SpaceShipState = {
  flightSpeed: 0.5,
  isClashed: false,
  isRotation: false,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
}

const initialCamera: CameraState = {
  fov: 60,
  near: 9,
  far: 200,
  distance: 15,
  aspect: 1,
  position: { x: 0, y: 0, z: 0 },
}

let nextLaserId = 0

export const useGameStore = create<GameState>((set, get) => ({
  // Score
  score: { point: 0 },
  incPoint: (amount) => set((s) => ({ score: { point: s.score.point + amount } })),
  decPoint: (amount) => set((s) => ({ score: { point: s.score.point - amount } })),
  resetPoint: () => set({ score: { point: 0 } }),

  // Play
  play: { active: false },
  startPlay: () => set({ play: { active: true } }),
  stopPlay: () => set({ play: { active: false } }),

  // SpaceShip
  spaceShip: { ...initialSpaceShip },
  updateSpaceShip: (data) => set((s) => ({ spaceShip: { ...s.spaceShip, ...data } })),
  resetSpaceShip: () => set({ spaceShip: { ...initialSpaceShip } }),

  // Camera
  cam: { ...initialCamera },
  updateCamera: (data) => set((s) => ({ cam: { ...s.cam, ...data } })),
  resetCamera: () => set({ cam: { ...initialCamera } }),

  // Meteolites
  meteos: {},
  replaceAllMeteos: (data) => set({ meteos: data }),
  updateMeteos: (data) => set((s) => ({ meteos: { ...s.meteos, ...data } })),
  replaceMeteo: (data) =>
    set((s) => ({
      meteos: { ...s.meteos, [data.guid]: { ...s.meteos[data.guid], ...data } },
    })),
  removeMeteo: (guid) =>
    set((s) => {
      const { [guid]: _, ...rest } = s.meteos
      return { meteos: rest }
    }),
  resetMeteos: () => set({ meteos: {} }),

  // Lasers
  lasers: {},
  addLaser: (data) =>
    set((s) => {
      const id = nextLaserId++
      return { lasers: { ...s.lasers, [id]: { ...data, guid: id } } }
    }),
  replaceLaser: (data) =>
    set((s) => ({
      lasers: { ...s.lasers, [data.guid]: { ...s.lasers[data.guid], ...data } },
    })),
  removeLaser: (guid) =>
    set((s) => {
      const { [guid]: _, ...rest } = s.lasers
      return { lasers: rest }
    }),
  resetLasers: () => set({ lasers: {} }),

  // Load
  load: { spaceShip: false, meteolites: false },
  updateLoad: (data) => set((s) => ({ load: { ...s.load, ...data } })),
  resetLoad: () => set({ load: { spaceShip: false, meteolites: false } }),

  // Computed
  isGameActive: () => {
    const state = get()
    return state.play.active && !state.spaceShip.isClashed
  },
}))
