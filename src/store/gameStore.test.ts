import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './gameStore'

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      score: { point: 0 },
      play: { active: false },
      spaceShip: {
        flightSpeed: 0.5,
        isClashed: false,
        isRotation: false,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      cam: {
        fov: 60,
        near: 9,
        far: 200,
        distance: 15,
        aspect: 1,
        position: { x: 0, y: 0, z: 0 },
      },
      meteos: {},
      lasers: {},
      load: { spaceShip: false, meteolites: false },
    })
  })

  describe('score', () => {
    it('incPoint adds to score', () => {
      useGameStore.getState().incPoint(100)
      expect(useGameStore.getState().score.point).toBe(100)
    })

    it('decPoint subtracts from score', () => {
      useGameStore.getState().incPoint(100)
      useGameStore.getState().decPoint(30)
      expect(useGameStore.getState().score.point).toBe(70)
    })

    it('resetPoint resets to zero', () => {
      useGameStore.getState().incPoint(100)
      useGameStore.getState().resetPoint()
      expect(useGameStore.getState().score.point).toBe(0)
    })
  })

  describe('play', () => {
    it('startPlay sets active to true', () => {
      useGameStore.getState().startPlay()
      expect(useGameStore.getState().play.active).toBe(true)
    })

    it('stopPlay sets active to false', () => {
      useGameStore.getState().startPlay()
      useGameStore.getState().stopPlay()
      expect(useGameStore.getState().play.active).toBe(false)
    })
  })

  describe('lasers', () => {
    it('addLaser adds a laser with auto-incremented guid', () => {
      useGameStore.getState().addLaser({
        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.3, y: 0.3, z: 10 },
      })
      const lasers = Object.values(useGameStore.getState().lasers)
      expect(lasers).toHaveLength(1)
      expect(lasers[0].position).toEqual({ x: 1, y: 2, z: 3 })
    })

    it('removeLaser removes a laser by guid', () => {
      useGameStore.getState().addLaser({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.3, y: 0.3, z: 10 },
      })
      const lasers = Object.values(useGameStore.getState().lasers)
      useGameStore.getState().removeLaser(lasers[0].guid)
      expect(Object.values(useGameStore.getState().lasers)).toHaveLength(0)
    })
  })

  describe('meteos', () => {
    it('replaceAllMeteos replaces all meteos', () => {
      const meteos = {
        0: {
          guid: 0,
          pattern: 1,
          position: { x: 0, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
      }
      useGameStore.getState().replaceAllMeteos(meteos)
      expect(Object.values(useGameStore.getState().meteos)).toHaveLength(1)
    })

    it('removeMeteo removes a specific meteo', () => {
      const meteos = {
        0: {
          guid: 0,
          pattern: 1,
          position: { x: 0, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
        1: {
          guid: 1,
          pattern: 2,
          position: { x: 5, y: 5, z: 20 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
      }
      useGameStore.getState().replaceAllMeteos(meteos)
      useGameStore.getState().removeMeteo(0)
      const remaining = Object.values(useGameStore.getState().meteos)
      expect(remaining).toHaveLength(1)
      expect(remaining[0].guid).toBe(1)
    })
  })

  describe('isGameActive', () => {
    it('returns true when playing and not clashed', () => {
      useGameStore.getState().startPlay()
      expect(useGameStore.getState().isGameActive()).toBe(true)
    })

    it('returns false when not playing', () => {
      expect(useGameStore.getState().isGameActive()).toBe(false)
    })

    it('returns false when clashed', () => {
      useGameStore.getState().startPlay()
      useGameStore.getState().updateSpaceShip({ isClashed: true })
      expect(useGameStore.getState().isGameActive()).toBe(false)
    })
  })
})
