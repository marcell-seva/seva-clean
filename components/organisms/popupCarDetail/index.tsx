import { Modal } from 'components/atoms'
import CreditCarDetail from 'components/molecules/popupCarDetail/creditCarDetail'
import SpecificationCarDetail from 'components/molecules/popupCarDetail/specificationCarDetail'
import React from 'react'
import { LanguageCode } from 'utils/enum'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import styles from 'styles/components/organisms/popupCarDetail.module.scss'

interface PopupCarDetailProps {
  isOpen: boolean
  price: number
  dpLabelText?: string
  dp: string
  dpBeforeDiscount?: string
  installmentFeeLabelText?: string
  installmentFee: string
  installmentFeeBeforeDiscount?: string
  tenure: number
  carSeats?: number
  engineCapacity?: number
  fuelType?: string
  transmission?: string
  rasioBahanBakar?: string
  dimenssion?: string
  onCancel: () => void
}

const PopupCarDetail: React.FC<PopupCarDetailProps> = ({
  isOpen,
  price,
  dpLabelText = 'DP',
  dp,
  dpBeforeDiscount,
  installmentFeeLabelText = 'Cicilan per bulan',
  installmentFee,
  installmentFeeBeforeDiscount,
  tenure,
  onCancel,
  carSeats,
  engineCapacity,
  fuelType,
  transmission,
  rasioBahanBakar,
  dimenssion,
}) => {
  return (
    <Modal title="Detail Mobil" open={isOpen} onCancel={onCancel}>
      <CreditCarDetail
        price={`Rp${formatPriceNumberThousandDivisor(price, LanguageCode.id)}`}
        dpLabelText={dpLabelText}
        dp={`Rp${formatNumberByLocalization(
          parseInt(dp),
          LanguageCode.id,
          1000000,
          100,
        )} jt`}
        dpBeforeDiscount={
          dpBeforeDiscount
            ? `Rp${formatNumberByLocalization(
                parseInt(dpBeforeDiscount),
                LanguageCode.id,
                1000000,
                100,
              )} jt`
            : undefined
        }
        installmentFeeLabelText={installmentFeeLabelText}
        installmentFee={`Rp${formatNumberByLocalization(
          parseInt(installmentFee),
          LanguageCode.id,
          1000000,
          100,
        )} jt/bln`}
        installmentFeeBeforeDiscount={
          installmentFeeBeforeDiscount
            ? `Rp${formatNumberByLocalization(
                parseInt(installmentFeeBeforeDiscount),
                LanguageCode.id,
                1000000,
                100,
              )} jt`
            : undefined
        }
        tenure={`${tenure} tahun`}
      />

      <hr className={styles.divider} />

      <h2 className={styles.overviewTitle}>Overview</h2>

      <SpecificationCarDetail
        carSeats={carSeats}
        engineCapacity={engineCapacity}
        fuelType={fuelType}
        transmission={transmission}
        rasioBahanBakar={rasioBahanBakar}
        dimenssion={dimenssion}
      />
    </Modal>
  )
}

export default PopupCarDetail
