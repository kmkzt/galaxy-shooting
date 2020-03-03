import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  METEOS_UPDATE,
  State as MeteoState,
  METEOS_REPLACE_ALL
} from '@/store/Meteolites'
import { getRandom } from '@/utils/getRandom'
import { RootStore } from '@/store'

const useMeteoData = ({ patternNum }: { patternNum: number }) => {
  const camera = useSelector((state: RootStore) => state.cam)
  const dispatch = useDispatch()

  const set = useCallback(
    (num: number) => {
      const meteoData: MeteoState = Array(num)
        .fill(null)
        .reduce((res: MeteoState, _: null, i: number): MeteoState => {
          const DISPLAY_SIZE = camera.near + 5
          const ASPECT = camera.aspect
          const DISTANCE = camera.far

          const pattern = Math.floor(Math.random() * patternNum)
          const randomScale = getRandom({ min: 0.5, max: 2 })
          return {
            ...res,
            [i]: {
              guid: i,
              position: {
                x: getRandom({
                  min: (-DISPLAY_SIZE * ASPECT) / 2,
                  max: (DISPLAY_SIZE * ASPECT) / 2
                }),
                y: getRandom({
                  min: -DISPLAY_SIZE / 2,
                  max: DISPLAY_SIZE / 2
                }),
                z: getRandom({ min: DISTANCE, max: DISTANCE * 2 })
              },
              rotation: {
                x: 0,
                y: 0,
                z: 0
              },
              scale: {
                x: randomScale,
                y: randomScale,
                z: randomScale
              },
              pattern
            }
          }
        }, {})
      dispatch(METEOS_REPLACE_ALL(meteoData))
    },
    [camera.aspect, camera.far, camera.near, dispatch, patternNum]
  )

  return {
    set
  }
}
export default useMeteoData
