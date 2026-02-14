import { Color, type OrthographicCamera } from 'three'
import useView from '../../hooks/useView'
import { useGameStore } from '../../store/gameStore'

function MapCamera(props: Record<string, unknown>) {
  const ref = useView<OrthographicCamera>({
    left: 0,
    bottom: 0,
    width: 0.25,
    height: 0.25,
    background: new Color(0, 0, 0),
    updateCamera: ({ camera }) => {
      const { spaceShip } = useGameStore.getState()
      camera.position.z = spaceShip.position.z
      camera.position.y = 20
      camera.lookAt(0, 0, spaceShip.position.z)
      return camera
    },
  })

  return <perspectiveCamera ref={ref} {...props} />
}

export default MapCamera
