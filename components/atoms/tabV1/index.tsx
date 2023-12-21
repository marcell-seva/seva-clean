import { useRouter } from 'next/router'
import React from 'react'
import styles from 'styles/components/atoms/tabV1.module.scss'
import { TabItemProps } from 'utils/types/props'

export const TabV1 = ({
  label,
  value,
  isActive,
  onClickHandler,
  dataTestId,
}: TabItemProps) => {
  const router = useRouter()
  const isMobilBekas =
    router.asPath.split('/')[1] === 'mobil-bekas' ? true : false
  return (
    <div
      className={`${styles.container} ${isActive && styles.containerActive}`}
      style={isMobilBekas ? { marginLeft: '0px' } : {}}
      onClick={() => onClickHandler && onClickHandler(value)}
      data-testid={dataTestId}
    >
      <h2 className={`${styles.text} ${isActive && styles.textActive}`}>
        {label}
      </h2>
    </div>
  )
}
