import React from 'react'
import styles from 'styles/saas/components/atoms/tabV1.module.scss'
import { TabItemProps } from 'utils/types/props'

export const TabV1 = ({
  label,
  value,
  isActive,
  onClickHandler,
  dataTestId,
}: TabItemProps) => {
  return (
    <div
      className={`${styles.container} ${isActive && styles.containerActive}`}
      onClick={() => onClickHandler && onClickHandler(value)}
      data-testid={dataTestId}
    >
      <h2 className={`${styles.text} ${isActive && styles.textActive}`}>
        {label}
      </h2>
    </div>
  )
}
