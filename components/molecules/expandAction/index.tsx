import clsx from 'clsx'
import { DownOutlined } from 'components/atoms'
import React from 'react'
import styles from 'styles/components/molecules/expandAction.module.scss'

type ExpandActionProps = {
  open: boolean
  onClick: () => void
  className?: string
  arrowColor?: string
  lineHeight?: string
}

export const ExpandAction = ({
  open,
  onClick,
  className,
  arrowColor,
  lineHeight = '16px',
}: ExpandActionProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <label onClick={onClick} style={{ lineHeight: lineHeight }}>
        {!open ? 'Baca Selengkapnya' : 'Tutup'}
      </label>
      <div
        className={clsx({
          [styles.iconWrapper]: true,
          [styles.iconWrapperOpened]: open,
        })}
        onClick={onClick}
      >
        <DownOutlined
          width={16}
          height={6}
          color={arrowColor || '#246ed4'}
          marginBottom={'2px'}
        />
      </div>
    </div>
  )
}
