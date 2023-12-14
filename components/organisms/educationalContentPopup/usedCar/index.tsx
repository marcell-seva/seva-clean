import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import React from 'react'
import styles from 'styles/components/organisms/educationalPopupUsedCar.module.scss'
import { Button } from 'components/atoms'
import { isIphone } from 'utils/window'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { IconIdea } from 'components/atoms/icon/IconIdea'
import stylesButton from 'styles/components/atoms/button.module.scss'
import clsx from 'clsx'

type FilterMobileProps = {
  onButtonClick?: () => void
  isOpenBottomSheet?: boolean
  educationalName?: string
}
const EducationalContentPopupUsedCar = ({
  onButtonClick,
  isOpenBottomSheet,
  educationalName = 'Down Payment (DP)',
}: FilterMobileProps) => {
  const onClickClose = () => {
    onButtonClick && onButtonClick()
  }
  const EducationalDP = (): JSX.Element => (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.popupSubHeader}>
          <p className={styles.kanyonMedium}>Down Payment (DP)</p>
        </div>
        <div className={styles.content}>
          <div className={styles.spacingText}>
            <p className={styles.openSans}>
              DP adalah sejumlah uang muka yang hanya dihitung berdasarkan harga
              kendaraan atau OTR mobil pilihanmu.
            </p>
          </div>
          <b className={styles.kanyonSemiBold}>
            Apa bedanya DP dengan Total DP (TDP)?
          </b>
          <p className={styles.openSans} style={{ paddingTop: '16px' }}>
            Total DP (juga dikenal dengan Total Pembayaran Pertama) adalah total
            uang muka yang harus dibayar di awal pembelian mobil. Besarannya
            mencakup penjumlahan dari beberapa biaya, seperti DP, biaya
            administrasi, asuransi, dan cicilan pertama.
            <br />
            <br />
          </p>
          <div className={styles.wrapperButton}>
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              onClick={onClickClose}
              size={ButtonSize.Big}
            >
              Oke, Saya Mengerti
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <BottomSheet
        open={isOpenBottomSheet || false}
        onDismiss={() => onClickClose()}
        className={styles.bottomSheetSmall}
        // scrollLocking={!isIphone}
      >
        <EducationalDP />
      </BottomSheet>
    </div>
  )
}

export default EducationalContentPopupUsedCar
