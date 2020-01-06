import React, { Suspense } from 'react'
import useObject from '@/hooks/useObject'
import Lasers from './Lasers'
import SpaceShip from './SpaceShip'
import Meteolites from './Meteolites'

const Models = () => {
  /**
   * LOAD OBJECT
   */
  const {
    ship: shipObj,
    meteos: { geometries: meteoliteGeometries }
  } = useObject({
    meteosOption: {
      num: 100
    }
  })
  return (
    <Suspense fallback={null}>
      <SpaceShip obj={shipObj} />
      <Meteolites geometries={meteoliteGeometries} />
      <Lasers />
    </Suspense>
  )
}

export default Models
