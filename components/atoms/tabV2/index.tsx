import React from 'react'
import styles from 'styles/components/atoms/tabV2.module.scss'
import { TabItemProps } from 'utils/types/props'

export const TabV2 = ({
  label,
  value,
  isActive,
  onClickHandler,
  dataTestId,
  onPage,
}: TabItemProps) => {
  return onPage === 'PDP' ? (
    <div
      className={`${styles.container} ${isActive && styles.containerActive}`}
      role="button"
      onClick={() => onClickHandler && onClickHandler(value)}
      data-testid={dataTestId}
    >
      <p className={`${styles.text} ${isActive && styles.textActive}`}>
        {label}
      </p>
    </div>
  ) : (
    <div
      className={`${styles.containerTabV2LC} ${
        isActive && styles.containerActive
      }`}
      role="button"
      onClick={() => onClickHandler && onClickHandler(value)}
      data-testid={dataTestId}
    >
      <p className={`${styles.text} ${isActive && styles.textActive}`}>
        {label}
      </p>
    </div>
  )
}
