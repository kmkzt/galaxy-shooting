import React from 'react'
import { useSelector } from 'react-redux'
import { useFrame } from 'react-three-fiber'
import { RootStore } from '@/store'

type Args = Parameters<Parameters<typeof useFrame>[0]>
export default function useGameFrame(
  callback: Parameters<typeof useFrame>[0],
  renderPriority?: Parameters<typeof useFrame>[1]
): void {
  const isActive = useSelector(
    (state: RootStore) => state.play.active && !state.spaceShip.isClashed
  )
  useFrame((context: Args[0], num: Args[1]) => {
    if (!isActive) return
    callback(context, num)
  }, renderPriority)
}
