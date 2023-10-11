import React from 'react'
import { BottomSheetProps } from 'react-spring-bottom-sheet'
import styles from 'styles/components/organisms/insuranceTooltip.module.scss'
import { BottomSheet, Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

interface InsuranceTooltipProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
}

const tooltipInformation = [
  {
    title: 'Asuransi Comprehensive',
    desc: 'Comprehensive menjamin Partial Loss + Total Loss, yaitu memberikan jaminan kerugian/kerusakan sebagian dan keseluruhan yang diakibatkan oleh semua risiko yang dijamin dalam polis asuransi kendaraan bermotor termasuk kehilangan akibat pencurian dengan tambahan fitur dan layanan yang lebih lengkap.',
  },
  {
    title: 'Asuransi Total Loss Only (TLO)',
    desc: 'Total Loss Only menjamin Total Loss Accident + Total Loss Stolen yaitu memberikan jaminan atas kerugian/kerusakan di mana biaya perbaikan ≥ 75% dari harga kendaraan sesaat sebelum kerugian dan kehilangan mobil akibat pencurian.',
  },
]

export const InsuranceTooltip = ({
  onClose,
  ...props
}: InsuranceTooltipProps) => {
  return (
    <BottomSheet
      title="Asuransi"
      onDismiss={onClose}
      maxHeight={window.innerHeight * 0.93}
      className={styles.bottomSheet}
      additionalHeaderClassname={styles.bottomSheetHeader}
      {...props}
    >
      <div style={{ height: window.innerHeight * 0.93 }}>
        <div className={styles.container}>
          {tooltipInformation.map((item, index) => (
            <>
              <div key={index} className={styles.insurance}>
                <h3 className={styles.title}>{item.title}</h3>
                <span className={styles.desc}>{item.desc}</span>
              </div>
              {index + 1 !== tooltipInformation.length && (
                <div className={styles.line} />
              )}
            </>
          ))}
        </div>
        <div className={styles.btnWrapper}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={onClose}
          >
            Oke, Saya Mengerti
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
