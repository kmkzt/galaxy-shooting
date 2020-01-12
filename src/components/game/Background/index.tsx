import React, { Fragment } from 'react'
import { Math } from 'three'

const Background = () => (
  <Fragment>
    {Array(10000).map((_, i) => {
      const x = Math.randFloatSpread(2000)
      const y = Math.randFloatSpread(2000)
      const z = Math.randFloatSpread(2000)
      return (
        <points key={i}>
          <geometry />
          <pointsMaterial color={0x888888} />
        </points>
      )
    })}
  </Fragment>
)

export default Background
