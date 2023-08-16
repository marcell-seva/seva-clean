import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/molecules/labelCard/promo/promo.module.scss'
import { IconPromo } from 'components/atoms/icon'
import { colors } from 'utils/helpers/style/colors'

interface Props extends HTMLAttributes<HTMLDivElement> {
  regulerText?: string
  boldText?: string
}

const LabelPromo = ({
  regulerText = 'Tersedia ',
  boldText = 'promo',
  className,
  ...restProps
}: Props) => {
  return (
    <div className={`${styles.container} ${className}`} {...restProps}>
      <IconPromo height={16} width={16} color={colors.white} />
      <span className={styles.microReguler}>
        {regulerText}
        <span className={styles.microBold}>{boldText}</span>
      </span>
    </div>
  )
}
export default LabelPromo
