import React from 'react'
import styles from '../../../styles/saas/components/atoms/overlay.module.scss'

interface OverlayProps {
  isShow: boolean
  onClick: () => void
  zIndex?: number
}

export const Overlay = ({ isShow, onClick, zIndex }: OverlayProps) => {
  return (
    <div
      style={{ zIndex }}
      className={`${styles.overlay} ${isShow ? styles.showOverlay : ''}`}
      onClick={onClick}
    />
  )
}
