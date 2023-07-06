import React from 'react'
import { IconApplication, IconSecure, IconVoucher } from 'components/atoms/icon'
import { InfoCard } from 'components/molecules'
import styles from 'styles/saas/components/organism/creditCualificationBenefit.module.scss'

interface Props {
  additionalContainerStyle?: string
  additionalCardWrapperStyle?: string
}

export default function CreditCualificationBenefit({
  additionalContainerStyle,
  additionalCardWrapperStyle,
}: Props) {
  return (
    <div className={`${styles.container} ${additionalContainerStyle}`}>
      <h3 className={styles.title}>
        Keuntungan Kualifikasi Kredit dengan SEVA
      </h3>

      <div className={`${styles.cardWrapper} ${additionalCardWrapperStyle}`}>
        <InfoCard
          title={
            <>
              <h4 className={styles.cardMainTitle}>
                Mudah{' '}
                <span
                  className={`${styles.cardSecondaryTitle} ${styles.separator}`}
                >
                  &nbsp;&
                </span>
              </h4>{' '}
              <h4 className={styles.cardSecondaryTitle}>
                Cepat{' '}
                <IconApplication
                  className={styles.icon}
                  color="#B4231E"
                  width={20}
                  height={20}
                />{' '}
              </h4>{' '}
            </>
          }
          description="Pengecekan kualifikasi kredit dapat dilakukan di mana pun dan kapan pun."
        />

        <InfoCard
          title={
            <>
              <h4 className={styles.cardMainTitle}>
                Promo{' '}
                <IconVoucher
                  className={styles.icon}
                  color="#B4231E"
                  width={20}
                  height={20}
                />
              </h4>
              <h4 className={styles.cardSecondaryTitle}>Tambahan</h4>{' '}
            </>
          }
          description="Dapatkan promo dengan unggah KTP kamu saat melakukan pengecekan kualifikasi kredit 
          di SEVA."
        />

        <InfoCard
          title={
            <>
              <h4 className={styles.cardMainTitle}>
                Terjamin{' '}
                <span
                  className={`${styles.cardSecondaryTitle} ${styles.separator}`}
                >
                  &nbsp;&
                </span>
              </h4>
              <h4 className={styles.cardMainTitle}>
                Terpercaya{' '}
                <IconSecure
                  className={styles.icon}
                  color="#B4231E"
                  width={20}
                  height={20}
                />
              </h4>
            </>
          }
          description="SEVA bekerja sama dengan ACC & TAF, perusahaan pembiayaan otomotif terpercaya di Indonesia."
        />
      </div>
    </div>
  )
}
