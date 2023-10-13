import React from 'react'
import styles from 'styles/components/atoms/overlay.module.scss'

interface OverlayProps {
  isShow: boolean
  onClick: () => void
  zIndex?: number
  additionalstyle?: string
}

const Overlay = ({
  isShow,
  onClick,
  zIndex,
  additionalstyle,
}: OverlayProps) => {
  return (
    <div
      style={{ zIndex }}
      className={`${styles.overlay} ${
        isShow ? styles.showOverlay : ''
      } ${additionalstyle}`}
      onClick={onClick}
    />
  )
}
export default Overlay
