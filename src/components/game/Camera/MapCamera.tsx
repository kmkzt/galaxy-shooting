import React from 'react'
import useView from '@/hooks/useView'
import { OrthographicCamera, Color } from 'three'

function MapCamera(props: any) {
  const ref = useView<OrthographicCamera>({
    left: 0,
    bottom: 0,
    width: 0.25,
    height: 0.25,
    background: new Color(0, 0, 0),
    updateCamera: ({ camera }) => camera
  })

  return <perspectiveCamera ref={ref} {...props} />
}

export default MapCamera
