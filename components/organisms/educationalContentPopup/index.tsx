import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import React from 'react'
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
  educationalName: string
}
const EducationalContentPopup = ({
  onButtonClick,
  isOpenBottomSheet,
  educationalName = 'Down Payment (DP)',
}: FilterMobileProps) => {
  const onClickClose = () => {
    onButtonClick && onButtonClick()
  }
  const EducationalDP = (): JSX.Element => (
    <div className={styles.containerDP}>
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
  )

  const EducationalSchemeType = (): JSX.Element => (
    <div className={styles.container}>
      <div className={`${styles.popupSubHeader} ${styles.wrapper}`}>
        <p className={styles.kanyonMedium}>
          Pilihan Pembayaran Cicilan Pertama
        </p>
      </div>
      <div className={styles.content}>
        <p className={styles.openSans}>
          <div className={styles.wrapper}>
            <b className={styles.kanyonSemiBold}>Bayar di Muka (ADDM)</b>
            <br />
            <div className={styles.wrapperText}>
              Dalam skema pembayaran ini, cicilan pertama dibayarkan bersama DP
              sehingga Total DP menjadi lebih tinggi, namun{' '}
              <span>jumlah tenor </span> pinjamanmu akan{' '}
              <span>berkurang satu kali.</span>
              <br />
              <br />
              Contoh: Kamu memilih <span> Bayar di Muka </span>dengan tenor 36
              bulan, maka kamu akan membayar cicilan sebanyak 35 kali saja.
              <br />
              <br />
            </div>
            <div className={styles.informationWrapper}>
              <IconIdea />
              <div>
                <p className={styles.informationTitleText}>Tahukah Kamu?</p>
                <p className={styles.informationTitleDesciption}>
                  Cicilan untuk Bayar di Muka (ADDM) <span>lebih rendah</span> ,
                  lho!
                </p>
              </div>
            </div>
          </div>
          <div className={styles.line} />
          <div className={styles.wrapper}>
            <b className={styles.kanyonSemiBold}>Bayar di Belakang (ADDB)</b>
            <br />
            <div className={styles.wrapperText}>
              Dalam skema pembayaran ini, cicilan pertama baru akan dibayarkan
              di bulan berikutnya, sehingga Total DP menjadi lebih ringan dengan
              <span> jumlah tenor</span> pinjaman <span> tetap.</span>
              <br />
              <br />
              Contoh: Kamu memilih Bayar di Belakang dengan tenor 36 bulan, maka
              kamu akan membayar cicilan sebanyak 36 kali.
              <br />
              <br />
            </div>
            <div className={styles.informationWrapper}>
              <IconIdea />
              <div>
                <p className={styles.informationTitleText}>Tahukah Kamu?</p>
                <p className={styles.informationTitleDesciption}>
                  Total DP untuk Bayar di Belakang (ADDB){' '}
                  <span> lebih rendah</span>, lho!
                </p>
              </div>
            </div>
          </div>
        </p>
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
  )

  const renderEducationalSection = (key: string) => {
    switch (key) {
      case 'Down Payment (DP)':
        return <EducationalDP />
      case 'Pilihan Pembayaran Cicilan Pertama':
        return <EducationalSchemeType />
      default:
        return <EducationalDP />
    }
  }

  return (
    <div>
      <BottomSheet
        open={isOpenBottomSheet || false}
        onDismiss={() => onClickClose()}
        className={clsx({
          [styles.bottomSheet]: educationalName !== 'Down Payment (DP)',
          [styles.bottomSheetSmall]: educationalName === 'Down Payment (DP)',
          [styles.bottomSheetContainer]: true,
        })}
        // scrollLocking={!isIphone}
      >
        {renderEducationalSection(educationalName)}
      </BottomSheet>
    </div>
  )
}

export default EducationalContentPopup
