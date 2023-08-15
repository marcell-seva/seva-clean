import { IconWarningCircle } from 'components/atoms/icon'
import React, { HTMLAttributes } from 'react'
import { colors } from 'styles/colors'
import styles from 'styles/components/molecules/labelCard/sedang/sedang.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  additionalClassname?: string
  prefixComponent?: () => JSX.Element
  labelText?: string
}

const LabelSedang = ({
  additionalClassname,
  prefixComponent,
  labelText = 'Kualifikasi Kredit Sedang',
  ...restProps
}: Props) => {
  return (
    <div
      className={`${styles.container} ${styles.labelResult} ${additionalClassname}`}
      {...restProps}
    >
      {prefixComponent ? (
        prefixComponent()
      ) : (
        <IconWarningCircle
          height={16}
          width={16}
          color={colors.white}
          fillColor="#FFA800"
        />
      )}
      <span className={styles.microBold}>{labelText}</span>
    </div>
  )
}

export default LabelSedang
