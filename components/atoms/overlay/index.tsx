import React from 'react'
import styles from 'styles/components/atoms/overlay.module.scss'

interface OverlayProps {
  isShow: boolean
  onClick: () => void
  zIndex?: number
  additionalStyle?: string
}

const Overlay = ({
  isShow,
  onClick,
  zIndex,
  additionalStyle,
}: OverlayProps) => {
  return (
    <div
      style={{ zIndex }}
      className={`${styles.overlay} ${
        isShow ? styles.showOverlay : ''
      } ${additionalStyle}`}
      onClick={onClick}
    />
  )
}
export default Overlay
