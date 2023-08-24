import React from 'react'
import styles from 'styles/components/organisms/popup-multi-kk-result.module.scss'
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { IconClose } from 'components/atoms'

interface Props {
  isOpen: boolean
  onDismissPopup: () => void
  onClickClosePopup: () => void
}

export const PopupMultiCreditQualificationResult = ({
  isOpen,
  onDismissPopup,
  onClickClosePopup,
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
        <div className={styles.wrapperDescription}>
          Rekomendasi mobil ini berdasarkan hasil kualifikasi kreditmu. Hasil
          ini bukan bersifat final dan membutuhkan data tambahan sebelum hasil
          akhir dapat dipastikan.
          <br />
          <br /> Kamu bisa
          <span> lanjut ke tahap Instant Approval </span>
          untuk hasil yang pasti dan cepat secara langsung dari perusahaan
          pembiayaan Astra.
        </div>
      </div>
    </BottomSheet>
  )
}
