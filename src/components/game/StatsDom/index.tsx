import { useFrame } from 'react-three-fiber'
import Stats from 'stats.js'

/**
 * DEV TOOLS
 */
const stats = new Stats()
document.body.appendChild(stats.dom)
const StatsDom = () => {
  useFrame(() => {
    stats.update()
  })
  return null
}

export default StatsDom
