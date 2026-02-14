import { describe, expect, it } from 'vitest'
import { checkParam, checkVector, touchObject } from './collision'

describe('checkParam', () => {
  it('returns true when value is within range', () => {
    expect(checkParam(5, { point: 5, range: 2 })).toBe(true)
  })

  it('returns false when value is outside range', () => {
    expect(checkParam(10, { point: 5, range: 2 })).toBe(false)
  })

  it('returns false when value is exactly at boundary', () => {
    // boundary is exclusive: c > point - range/2 && c < point + range/2
    expect(checkParam(6, { point: 5, range: 2 })).toBe(false)
    expect(checkParam(4, { point: 5, range: 2 })).toBe(false)
  })
})

describe('checkVector', () => {
  const obj = {
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
    rotation: { x: 0, y: 0, z: 0 },
  }

  it('returns true for point inside object', () => {
    expect(checkVector(obj, { x: 0, y: 0, z: 0 })).toBe(true)
  })

  it('returns false for point outside object', () => {
    expect(checkVector(obj, { x: 5, y: 0, z: 0 })).toBe(false)
  })
})

describe('touchObject', () => {
  it('returns true when objects overlap', () => {
    const obj1 = {
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
    }
    const obj2 = {
      position: { x: 0.5, y: 0.5, z: 0.5 },
      scale: { x: 2, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
    }
    expect(touchObject(obj1, obj2)).toBe(true)
  })

  it('returns false when objects are far apart', () => {
    const obj1 = {
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
    }
    const obj2 = {
      position: { x: 10, y: 10, z: 10 },
      scale: { x: 2, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
    }
    expect(touchObject(obj1, obj2)).toBe(false)
  })

  it('returns false when objects are adjacent but not overlapping', () => {
    const obj1 = {
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
    }
    const obj2 = {
      position: { x: 3, y: 0, z: 0 },
      scale: { x: 2, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
    }
    expect(touchObject(obj1, obj2)).toBe(false)
  })
})
