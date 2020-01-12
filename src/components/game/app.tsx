import React, { Fragment, useCallback, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { useFrame, useThree } from 'react-three-fiber'
import { RootStore } from '@/store'
import Models from './Models'
import Point from './Point'
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
      <Point />
      <Models />
    </Fragment>
  )
}

export default GameApp
