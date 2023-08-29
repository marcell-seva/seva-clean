import React from 'react'
import styles from 'styles/components/atoms/overlay.module.scss'

interface OverlayProps {
  isShow: boolean
  onClick: () => void
  zIndex?: number
}

const Overlay = ({ isShow, onClick, zIndex }: OverlayProps) => {
  return (
    <div
      style={{ zIndex }}
      className={`${styles.overlay} ${isShow ? styles.showOverlay : ''}`}
      onClick={onClick}
    />
  )
}
export default Overlay
