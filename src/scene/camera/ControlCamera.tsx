import { useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { Color, type PerspectiveCamera } from 'three'
import useView from '../../hooks/useView'
import { useGameStore } from '../../store/gameStore'

interface Props {
  position: [number, number, number]
  fov: number
  near: number
  far: number
}

function ControlCamera(props: Props) {
  const aspect = useThree((s) => s.viewport.aspect)
  const ref = useView<PerspectiveCamera>({
    isMain: true,
    left: 0,
    bottom: 0,
    width: 1,
    height: 1,
    background: new Color(0x333366),
    updateCamera: ({ camera }) => {
      const { spaceShip, cam } = useGameStore.getState()
      camera.position.z = spaceShip.position.z + cam.distance
      return camera
    },
  })

  useLayoutEffect(() => {
    if (!ref.current) return
    useGameStore.getState().updateCamera({
      aspect,
      far: ref.current.far,
      near: ref.current.near,
      position: {
        x: ref.current.position.x,
        y: ref.current.position.y,
        z: ref.current.position.z,
      },
    })
  }, [aspect, ref])

  return <perspectiveCamera ref={ref} {...props} />
}

export default ControlCamera
