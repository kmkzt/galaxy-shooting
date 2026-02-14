import { describe, expect, it } from 'vitest'
import { getRandom } from './random'

describe('getRandom', () => {
  it('returns a value within the specified range', () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandom({ min: 5, max: 10 })
      expect(result).toBeGreaterThanOrEqual(5)
      expect(result).toBeLessThan(10)
    }
  })

  it('returns min when range is zero', () => {
    const result = getRandom({ min: 5, max: 5 })
    expect(result).toBe(5)
  })

  it('works with negative ranges', () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandom({ min: -10, max: -5 })
      expect(result).toBeGreaterThanOrEqual(-10)
      expect(result).toBeLessThan(-5)
    }
  })
})
