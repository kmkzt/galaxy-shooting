import React, { Fragment } from 'react'
import Models from './Models'
import useCameraControl from './Camera'

function GameApp() {
  useCameraControl()
  return (
    <Fragment>
      <hemisphereLight
        args={[0xeeeeff, 0x222222, 1]}
        position={[0, 0, 10]}
        intensity={0.6}
      />
      <Models />
    </Fragment>
  )
}

export default GameApp
