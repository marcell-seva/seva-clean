import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import React, { useEffect } from 'react'
import styles from 'styles/components/organisms/educationalPopup.module.scss'
import { Button } from 'components/atoms'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { CityOtrOption, trackDataCarType } from 'utils/types/utils'
import { useCar } from 'services/context/carContext'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getLocalStorage } from 'utils/handler/localStorage'
import { useRouter } from 'next/router'
import { LoanRank } from 'utils/types/models'
import Image from 'next/image'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { isIphone } from 'utils/window'
import { ButtonVersion } from 'components/atoms/button'
import { IconIdea } from 'components/atoms/icon/IconIdea'

type FilterMobileProps = {
  onButtonClick?: (value: boolean) => void
  isOpenBottomSheet?: boolean
  educationalName: string
}
const EducationalContentPopup = ({
  onButtonClick,
  isOpenBottomSheet,
  educationalName = 'Down Payment (DP)',
}: FilterMobileProps) => {
  const { carModelDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const router = useRouter()
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const IsShowBadgeCreditOpportunity = getSessionStorage(
    SessionStorageKey.IsShowBadgeCreditOpportunity,
  )
  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const loanRankcr = router.query.loanRankCVL ?? ''

  const onClickClose = () => {
    onButtonClick && onButtonClick(false)
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
          <p className={styles.openSans} style={{ paddingtop: '16px' }}>
            Total DP (juga dikenal dengan Total Pembayaran Pertama) adalah total
            uang muka yang harus dibayar di awal pembelian mobil. Besarannya
            mencakup penjumlahan dari beberapa biaya, seperti DP, biaya
            administrasi, asuransi, dan cicilan pertama.
            <br />
            <br />
          </p>
          <Button version={ButtonVersion.PrimaryDarkBlue}>
            Oke, Saya Mengerti
          </Button>
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
              sehingga Total DP menjadi lebih tinggi, namun
              <span>jumlah tenor</span>
              pinjamanmu akan <span>berkurang satu kali.</span>
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
                  Cicilan untuk Bayar di Muka (ADDM) lebih rendah, lho!
                </p>
              </div>
            </div>
          </div>
          <div className={styles.line} />
          <div className={styles.wrapper} style={{ marginBottom: '32px' }}>
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
                  Cicilan untuk Bayar di Muka (ADDM) lebih rendah, lho!
                </p>
              </div>
            </div>
          </div>
        </p>
        <div className={styles.wrapper}>
          <Button version={ButtonVersion.PrimaryDarkBlue}>
            Oke, Saya Mengerti
          </Button>
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

  useEffect(() => {
    window.addEventListener('popstate', () => {
      onButtonClick && onButtonClick(false)
    })

    return () => {
      window.removeEventListener('popstate', () => {
        onButtonClick && onButtonClick(false)
      })
    }
  }, [])
  return (
    <div>
      <BottomSheet
        open={isOpenBottomSheet || false}
        onDismiss={() => onClickClose()}
        className={styles.bottomSheet}
        scrollLocking={!isIphone}
      >
        {renderEducationalSection(educationalName)}
      </BottomSheet>
    </div>
  )
}

export default EducationalContentPopup
