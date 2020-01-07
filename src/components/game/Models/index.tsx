import React, { Suspense } from 'react'
import Lasers from './Lasers'
import SpaceShip from './SpaceShip'
import Meteolites from './Meteolites'

const Models = () => (
  <Suspense fallback={null}>
    <SpaceShip />
    <Meteolites num={100} />
    <Lasers />
  </Suspense>
)

export default Models
