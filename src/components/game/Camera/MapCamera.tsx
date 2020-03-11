import React from 'react'
import useView from '@/hooks/useView'
import { OrthographicCamera, Color, Object3D, Vector3 } from 'three'
import { useSelector } from 'react-redux'
import { RootStore } from '@/store'

function MapCamera(props: any) {
  const ship = useSelector((state: RootStore) => state.spaceShip)
  const ref = useView<OrthographicCamera>({
    left: 0,
    bottom: 0,
    width: 0.25,
    height: 0.25,
    background: new Color(0, 0, 0),
    updateCamera: ({ camera }) => {
      camera.position.z = ship.position.z
      camera.position.y = 20
      camera.lookAt(0, 0, ship.position.z)
      return camera
    }
  })

  return <perspectiveCamera ref={ref} {...props} />
}

export default MapCamera
