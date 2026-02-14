import { useCallback } from 'react'
import { getRandom } from '../logic/random'
import type { Meteo } from '../store/gameStore'
import { useGameStore } from '../store/gameStore'

const useMeteoData = ({ patternNum }: { patternNum: number }) => {
  const cam = useGameStore((s) => s.cam)
  const replaceAllMeteos = useGameStore((s) => s.replaceAllMeteos)

  const set = useCallback(
    (num: number) => {
      const meteoData: Record<number, Meteo> = {}
      const DISPLAY_SIZE = cam.near + 5
      const ASPECT = cam.aspect
      const DISTANCE = cam.far

      for (let i = 0; i < num; i++) {
        const pattern = Math.floor(Math.random() * patternNum)
        const randomScale = getRandom({ min: 0.5, max: 2 })
        meteoData[i] = {
          guid: i,
          position: {
            x: getRandom({ min: (-DISPLAY_SIZE * ASPECT) / 2, max: (DISPLAY_SIZE * ASPECT) / 2 }),
            y: getRandom({ min: -DISPLAY_SIZE / 2, max: DISPLAY_SIZE / 2 }),
            z: getRandom({ min: DISTANCE, max: DISTANCE * 2 }),
          },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: randomScale, y: randomScale, z: randomScale },
          pattern,
        }
      }
      replaceAllMeteos(meteoData)
    },
    [cam.aspect, cam.far, cam.near, patternNum, replaceAllMeteos],
  )

  return { set }
}

export default useMeteoData
