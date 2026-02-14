import type { FC } from 'react'
import { useCallback, useEffect } from 'react'
import useMeteoData from '../../hooks/useMeteoData'
import { useGameStore } from '../../store/gameStore'
import styles from './GameMenu.module.css'

export const GameMenu: FC = () => {
  const point = useGameStore((s) => s.score.point)
  const shipPosition = useGameStore((s) => Math.floor(s.spaceShip.position.z))
  const meteosCount = useGameStore((s) => Object.keys(s.meteos).length)
  const stopPlay = useGameStore((s) => s.stopPlay)
  const updateSpaceShip = useGameStore((s) => s.updateSpaceShip)
  const { set } = useMeteoData({ patternNum: 4 })

  const restart = useCallback(() => {
    updateSpaceShip({
      isClashed: false,
      position: { x: 0, y: 0, z: 0 },
    })
    stopPlay()
    set(100)
  }, [updateSpaceShip, stopPlay, set])

  useEffect(() => {
    if (!document.hasFocus()) {
      stopPlay()
    }
  })

  return (
    <div className={styles.wrap}>
      <div>POINTS: {point}</div>
      <div>SHIP POSITION: {shipPosition}</div>
      <div>METEOLITES: {meteosCount}</div>
      <button type="button" onClick={stopPlay}>
        MENU
      </button>
      <button type="button" onClick={restart}>
        RESTART
      </button>
    </div>
  )
}
