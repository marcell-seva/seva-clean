import React, { HTMLAttributes } from 'react'
import { colors } from 'styles/colors'
import { IconPromo } from 'components/atoms/icon'
import styles from 'styles/molecules/labelCard/promo/promo.module.scss'

export const LabelPromo = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <>
      <div className={`${styles.container} ${className}`} {...props}>
        <IconPromo height={16} width={16} color={colors.white} />
        <span className={styles.microReguler}>
          Tersedia <span className={styles.microBold}>promo</span>
        </span>
      </div>
    </>
  )
}
