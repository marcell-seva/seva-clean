import { million, ten } from 'utils/helpers/const'
import { LanguageCode } from 'utils/models/models'
import React from 'react'
import { CarVariantRecommendation } from 'utils/types/utils'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/numberUtils/numberUtils'
import {
  IconEngine,
  IconFuel,
  IconSeat,
  IconTransmission,
} from 'components/atoms'
import { IconDimension, IconFuelTank } from 'components/atoms/icon'
import styles from 'styles/components/organisms/summary.module.scss'

type VariantsProps = {
  carVariant: CarVariantRecommendation
  dimension: string
  fuelRatio: string | undefined
  monthlyInstallment: number
}
const PopupVariantDetail = ({
  carVariant,
  dimension,
  fuelRatio,
  monthlyInstallment,
}: VariantsProps) => {
  const get20PercentDp = () => {
    return carVariant.priceValue * 0.2
  }
  // const getMonthlyInstallment = () => {
  //   return (carVariant.priceValue - get20PercentDp()) / 60
  // }
  return (
    <div className={styles.container}>
      <div className={styles.wrapperWithBorderBottom}>
        <div className={styles.rowWithSpaceBottom}>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Harga</p>
            <p className={styles.openSansSemiBoldBlack}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  carVariant.priceValue,
                  LanguageCode.id,
                )}
            </p>
          </div>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Minimum DP</p>
            <p className={styles.openSansSemiBoldBlack}>
              {'Rp' +
                formatNumberByLocalization(
                  get20PercentDp(),
                  LanguageCode.id,
                  million,
                  ten,
                ) +
                ' jt'}
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Cicilan mulai dari</p>
            <p className={styles.openSansSemiBoldBlack}>
              {'Rp' +
                formatNumberByLocalization(
                  monthlyInstallment,
                  LanguageCode.id,
                  million,
                  ten,
                ) +
                ' jt/bln'}
            </p>
          </div>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Tenor</p>
            <p className={styles.openSansSemiBoldBlack}>
              {carVariant.tenure + ' Tahun'}
            </p>
          </div>
        </div>
      </div>
      {/* <div className={styles.divider} /> */}
      <div className={styles.rowWithLargeMarginBottom}>
        <p className={styles.openSansSemiBoldBlack}>Overview</p>
      </div>
      <div className={styles.rowWithSmallGap}>
        <IconSeat width={24} height={24} color={'#246ED4'} />
        <p className={styles.openSans} style={{ color: '#13131B' }}>
          {carVariant.carSeats + ' Kursi'}
        </p>
      </div>
      {fuelRatio !== null && fuelRatio !== '-' && (
        <div className={styles.rowWithSmallGap}>
          <IconFuelTank width={24} height={24} color={'#246ED4'} />
          <p className={styles.openSans} style={{ color: '#13131B' }}>
            {'Rasio bahan bakar ' + fuelRatio}
          </p>
        </div>
      )}
      <div className={styles.rowWithSmallGap}>
        <IconFuel width={24} height={24} color={'#246ED4'} />
        <p className={styles.openSans} style={{ color: '#13131B' }}>
          {'Bahan bakar ' + carVariant.fuelType.toLowerCase()}
        </p>
      </div>
      <div className={styles.rowWithSmallGap}>
        <IconEngine width={24} height={24} color={'#246ED4'} />
        <p className={styles.openSans} style={{ color: '#13131B' }}>
          {'Kapasitas Mesin ' + carVariant.engineCapacity + ' cc'}
        </p>
      </div>{' '}
      <div className={styles.rowWithSmallGap}>
        <IconTransmission width={24} height={24} color={'#246ED4'} />
        <p className={styles.openSans} style={{ color: '#13131B' }}>
          {carVariant.transmission}
        </p>
      </div>
      <div className={styles.rowWithSmallGap}>
        <IconDimension width={24} height={24} color={'#246ED4'} />
        <p className={styles.openSans} style={{ color: '#13131B' }}>
          {dimension}
        </p>
      </div>
    </div>
  )
}

export default PopupVariantDetail
