import { lazy, Suspense } from 'react'

const SpaceShip = lazy(() => import('./SpaceShip'))
const Meteolites = lazy(() => import('./Meteolites'))
const Lasers = lazy(() => import('./Lasers'))

const Models = () => (
  <Suspense fallback={null}>
    <SpaceShip />
    <Meteolites num={100} />
    <Lasers />
  </Suspense>
)

export default Models
