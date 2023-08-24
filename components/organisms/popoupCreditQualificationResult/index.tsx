import React from 'react'
import styles from 'styles/components/organisms/popup-credit-qualification-result.module.scss'
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import clsx from 'clsx'
import { Button, IconClose } from 'components/atoms'
import Link from 'next/link'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

interface Props {
  isOpen: boolean
  onClickClosePopup: () => void
  onDismissPopup: () => void
  loanCalculatorDestinationUrl: string
  onClickChangeCreditPlan?: () => void
  onClickContinueApproval: () => void
}

export const PopupCreditQualificationResult = ({
  isOpen,
  onClickClosePopup,
  onDismissPopup,
  loanCalculatorDestinationUrl,
  onClickChangeCreditPlan,
  onClickContinueApproval,
}: Props) => {
  return (
    <BottomSheet
      open={isOpen}
      onDismiss={onDismissPopup}
      className={styles.sheetContainer}
    >
      <div className={styles.popupContent}>
        <div className={styles.popupHeaderSection}>
          <h2 className={styles.popupTitle}>
            Perhitungan
            <br />
            Kualifikasi Kredit
          </h2>
          <div
            role="button"
            className={styles.iconWrapper}
            onClick={onClickClosePopup}
          >
            <IconClose width={24} height={24} color={'#13131B'} />
          </div>
        </div>
        <p className={clsx(styles.bodyText, styles.popupParapgraph)}>
          Hasil peluang kredit ini bukan bersifat final dan membutuhkan data
          tambahan sebelum hasil akhir dapat dipastikan.
          <br />
          <br />
          Kamu masih dapat melakukan perubahan pada paket kredit atau unit yang
          dipilih untuk meningkatkan hasil peluang kreditmu.{' '}
          <Link
            role="button"
            className={styles.smallButtonText}
            href={loanCalculatorDestinationUrl}
            onClick={onClickChangeCreditPlan}
          >
            Ubah Disini
          </Link>
          <br />
          <br />
          Opsi lainnya, kamu juga bisa lanjut ke tahap Instant Approval untuk
          hasil yang pasti dan cepat secara langsung dari perusahaan Pembiayaan
          Astra.
        </p>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          onClick={onClickContinueApproval}
        >
          Lanjut Instant Approval
        </Button>
      </div>
    </BottomSheet>
  )
}
