import { IconWarningCircle } from 'components/atoms/icon'
import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/molecules/labelCard/sulit/sulit.module.scss'
import { colors } from 'utils/helpers/style/colors'

interface Props extends HTMLAttributes<HTMLDivElement> {
  additionalClassname?: string
  prefixComponent?: () => JSX.Element
  labelText?: string
}

const LabelSulit = ({
  additionalClassname,
  prefixComponent,
  labelText = 'Sulit disetujui',
  ...props
}: Props) => {
  return (
    <div
      className={` ${styles.container} ${styles.labelResult} ${additionalClassname}`}
      {...props}
    >
      <IconWarningCircle
        height={16}
        width={16}
        color={colors.white}
        fillColor="#B4231E"
      />
      <span className={styles.microBold}>Sulit disetujui</span>
    </div>
  )
}

export default LabelSulit
