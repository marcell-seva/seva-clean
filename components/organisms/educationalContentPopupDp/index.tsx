import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import React, { useEffect } from 'react'
import styles from 'styles/components/organisms/educationalPopup.module.scss'
import { Button } from 'components/atoms'
import { isIphone } from 'utils/window'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { IconIdea } from 'components/atoms/icon/IconIdea'
import stylesButton from 'styles/components/atoms/button.module.scss'
import clsx from 'clsx'

type FilterMobileProps = {
  onButtonClick?: () => void
  isOpenBottomSheet?: boolean
}
const EducationalContentPopupDp = ({
  onButtonClick,
  isOpenBottomSheet,
}: FilterMobileProps) => {
  const onClickClose = () => {
    onButtonClick && onButtonClick()
  }

  return (
    <div>
      <BottomSheet
        open={isOpenBottomSheet || false}
        onDismiss={() => onClickClose()}
        className={clsx({
          [styles.bottomSheetSmall]: true,
        })}
        // scrollLocking={!isIphone}
      >
        <div className={styles.containerDP}>
          <div className={styles.wrapper}>
            <div className={styles.popupSubHeader}>
              <p className={styles.kanyonMedium}>Down Payment (DP)</p>
            </div>
            <div className={styles.content}>
              <div className={styles.spacingText}>
                <p className={styles.openSans}>
                  DP adalah sejumlah uang muka yang hanya dihitung berdasarkan
                  harga kendaraan atau OTR mobil pilihanmu.
                </p>
              </div>
              <b className={styles.kanyonSemiBold}>
                Apa bedanya DP dengan Total DP (TDP)?
              </b>
              <p className={styles.openSans} style={{ paddingTop: '16px' }}>
                Total DP (juga dikenal dengan Total Pembayaran Pertama) adalah
                total uang muka yang harus dibayar di awal pembelian mobil.
                Besarannya mencakup penjumlahan dari beberapa biaya, seperti DP,
                biaya administrasi, asuransi, dan cicilan pertama.
              </p>
            </div>
          </div>
          <div className={styles.wrapperButtonCta}>
            <div
              className={`${stylesButton.big} ${stylesButton.primaryDarkBlue} ${styles.buttonCta}`} // use div because always scroll to bottom
              onClick={onClickClose}
            >
              Oke, Saya Mengerti
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default EducationalContentPopupDp
