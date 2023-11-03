import styles from 'styles/components/molecules/popupCarDetail/creditCarDetail.module.scss'
import React from 'react'

interface CreditCarDetailProps {
  price: string
  dpLabelText?: string
  dp: string
  dpBeforeDiscount?: string
  tenure: string
  installmentFeeLabelText?: string
  installmentFee: string
  installmentFeeBeforeDiscount?: string
}

const CreditCarDetail: React.FC<CreditCarDetailProps> = ({
  price,
  dpLabelText = 'DP',
  dp,
  dpBeforeDiscount,
  installmentFeeLabelText = 'Cicilan per bulan',
  installmentFee,
  installmentFeeBeforeDiscount,
  tenure,
}) => {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Harga</h2>
        <h2 className={styles.subtitle}>{price}</h2>
      </div>
      <div>
        <h2 className={styles.title}>Tenor</h2>
        <h2 className={styles.subtitle}>{tenure}</h2>
      </div>

      <div>
        <h2 className={styles.title}>{installmentFeeLabelText}</h2>
        <h2 className={styles.subtitle}>{installmentFee}</h2>
        {installmentFeeBeforeDiscount ? (
          <h2 className={styles.subtitleBeforeDiscount}>
            {installmentFeeBeforeDiscount}
          </h2>
        ) : (
          <></>
        )}
      </div>
      <div>
        <h2 className={styles.title}>{dpLabelText}</h2>
        <h2 className={styles.subtitle}>{dp}</h2>
        {dpBeforeDiscount ? (
          <h2 className={styles.subtitleBeforeDiscount}>{dpBeforeDiscount}</h2>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default CreditCarDetail
