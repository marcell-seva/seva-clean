import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/molecules/labelCard/mudah/mudah.module.scss'
import { IconChecked } from 'components/atoms/icon'
import { colors } from 'utils/helpers/style/colors'

interface Props extends HTMLAttributes<HTMLDivElement> {
  additionalClassname?: string
  prefixComponent?: () => JSX.Element
  labelText?: string
}

const LabelMudah = ({
  additionalClassname,
  prefixComponent,
  labelText = 'Rekomendasi',
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
        <IconChecked
          height={16}
          width={16}
          color={colors.white}
          fillColor="#1AA674"
        />
      )}
      <span className={styles.microBold}>{labelText}</span>
    </div>
  )
}

export default LabelMudah
