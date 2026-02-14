import type { FC, ReactNode } from 'react'
import styles from './Layer.module.css'

export interface LayerProps {
  zIndex?: number
  background?: string
  children?: ReactNode
}

const Layer: FC<LayerProps> = ({ zIndex, background, children }) => {
  return (
    <div
      className={styles.layer}
      style={{
        zIndex: zIndex ?? 'auto',
        background: background ?? 'rgba(0, 0, 0, 0.4)',
      }}
    >
      {children}
    </div>
  )
}

export default Layer
