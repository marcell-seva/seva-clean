import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/atoms/mobilleView.module.scss'
import clsx from 'clsx'

export const MobileView = ({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={clsx(styles.container, props.className)}>
    {children}
  </div>
)
