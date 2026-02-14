import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'

type FrameCallback = Parameters<typeof useFrame>[0]

export default function useGameFrame(callback: FrameCallback, renderPriority?: number): void {
  useFrame((state, delta, frame) => {
    if (!useGameStore.getState().isGameActive()) return
    callback(state, delta, frame)
  }, renderPriority)
}
