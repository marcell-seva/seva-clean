import { SolidThumb } from 'components/atoms/icon/SolidThumb'
import React, { ForwardedRef } from 'react'
import styles from 'styles/components/molecules/incomeAgeSection.module.scss'
import { forwardRef } from 'react'
import clsx from 'clsx'

type IncomeAgeSectionProps = {
  children: React.ReactNode
  shake?: boolean
}

export const forwardIncomeAgeSection = (
  { children, shake }: IncomeAgeSectionProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div
      ref={ref}
      className={clsx({
        ['shake-animation-X']: shake,
        [styles.container]: true,
      })}
    >
      <div className={styles.uppperSection}>
        <div>
          <SolidThumb height={40} width={40} />
        </div>
        <div className={styles.titleSection}>
          <span className={styles.title}>
            Cicil Mobil Impianmu dengan Mudah!
          </span>
          <span className={styles.titleDesc}>
            Dapatkan{' '}
            <span className={styles.titleDescSemiBold}>
              Rekomendasi Cicilan Ideal
            </span>{' '}
            yang ringan dengan mengisi data dibawah ini.
          </span>
        </div>
      </div>
      <div className={styles.formSection}>{children}</div>
    </div>
  )
}

export const IncomeAgeSection = forwardRef(forwardIncomeAgeSection)
