import React from 'react'
import styles from 'styles/components/organisms/notFoundMultiUnit.module.scss'
import { useMultiUnitQueryContext } from 'services/context/multiUnitQueryContext'
import { Currency } from 'utils/handler/calculation'
import { Button, Gap, IconWhatsapp, Modal } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'

const EmptyCarIllustration = '/revamp/illustration/empty-car.webp'

interface PropsNotFoundMultiUnit {
  open: boolean
  onAdjustForm: () => void
  onCancel: () => void
}

export const NotFoundMultiUnit: React.FC<PropsNotFoundMultiUnit> = ({
  open,
  onAdjustForm,
  onCancel,
}: PropsNotFoundMultiUnit) => {
  const { multiUnitQuery } = useMultiUnitQueryContext()

  const onClose = () => {
    onCancel && onCancel()
  }

  const sendToWhatsapp = async () => {
    const transmissionText =
      multiUnitQuery.transmission.length === 1
        ? multiUnitQuery.transmission[0].toLowerCase()
        : `manual & otomatis`
    const splitPrice = multiUnitQuery.priceRangeGroup.split('-')
    const rangePriceText = `Rp${Currency(splitPrice[0])} - Rp${Currency(
      splitPrice[1],
    )}`
    const message = `Halo, saya tertarik untuk mencari mobil ${transmissionText} di SEVA dalam kisaran harga ${rangePriceText} dengan DP sebesar Rp${Currency(
      multiUnitQuery.downPaymentAmount,
    )}, pendapatan per bulan Rp${Currency(
      multiUnitQuery.monthlyIncome,
    )}, dan tenor ${multiUnitQuery.tenure} tahun.`

    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    window.open(`${whatsAppUrl}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <Modal open={open} onCancel={onClose} isFull>
      <div className={styles.wrapper}>
        <div className={styles.wrapperImage}>
          <Image
            src={EmptyCarIllustration}
            width={200}
            height={150}
            alt="Empty car"
          />
        </div>
        <h2 className={styles.textHeading}>
          Mobil baru yang cocok buatmu ada di SEVA, tapi...
        </h2>
        <Gap height={16} />
        <p className={styles.additionInfo}>
          Kamu perlu menyesuaikan nominal DP dan pilihan tenor untuk
          meningkatkan hasil peluang kreditmu.
        </p>
        <Gap height={32} />
        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          onClick={onAdjustForm}
        >
          Sesuaikan DP dan Tenor
        </Button>
        <Gap height={13} />
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={sendToWhatsapp}
        >
          <div className={styles.whatsappCtaTextWrapper}>
            <IconWhatsapp width={16} height={16} />
            Hubungi Agen SEVA
          </div>
        </Button>
      </div>
    </Modal>
  )
}
