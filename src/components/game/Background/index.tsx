import React, { Fragment, useLayoutEffect } from 'react'
import { useThree } from 'react-three-fiber'
import { Math, Scene, Color } from 'three'

const Background = ({ background }: { background: Scene['background'] }) => {
  const { scene } = useThree()
  useLayoutEffect(() => {
    scene.background = background || new Color(0x333366)
  }, [background, scene.background])
  return null

  // TODO: Space texture
  // return (
  //   <Fragment>
  //     {Array(10000).map((_, i) => {
  //       const x = Math.randFloatSpread(2000)
  //       const y = Math.randFloatSpread(2000)
  //       const z = Math.randFloatSpread(2000)
  //       return (
  //         <points key={i}>
  //           <geometry />
  //           <pointsMaterial color={0x888888} />
  //         </points>
  //       )
  //     })}
  //   </Fragment>
  // )
}

export default Background
