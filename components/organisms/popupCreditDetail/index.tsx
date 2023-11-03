import React, { useState } from 'react'

import styles from 'styles/components/organisms/popupCreditDetail.module.scss'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LoanCalculatorInsuranceAndPromoType } from 'utils/types/utils'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Currency } from 'utils/handler/calculation'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'

import Image from 'next/image'

type VariantsProps = {
  carVariant: any
  dataFinancial: any
  promoCode: any
  city: string
  simpleCarVariantDetails: any
  optionADDM: any
}
const PopupCreditDetail = ({
  carVariant,
  city,
  promoCode,
  simpleCarVariantDetails,
  optionADDM,
}: VariantsProps) => {
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const { BadgeList, promoList, selectedPromoList } = useBadgePromo()

  return (
    <div className={styles.container}>
      <div className={styles.wrapperCar}>
        <Image
          src={carVariant.variantDetail.images[0]}
          width="188"
          height="141"
          alt="car-image"
          style={{ height: 'auto' }}
        />
      </div>
      <div className={styles.wrapperWithBorderBottom}>
        <div className={styles.titleSelectCar}>Mobil yang kamu pilih:</div>
        <div className={styles.textCar}>
          {carVariant?.modelDetail.brand} {carVariant?.modelDetail.model}
        </div>
        <div className={styles.textType}>{carVariant?.variantDetail.name}</div>
        <div className={styles.textPrice}>
          Rp
          {replacePriceSeparatorByLocalization(
            Number(carVariant?.variantDetail.priceValue),
            LanguageCode.id,
          )}
        </div>
        <div className={styles.textCity}>
          <span className={styles.margin}>Harga OTR {city}</span>
        </div>
        <div className={styles.rowWithSpaceBottom}>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Tenor</p>
            <p className={styles.openSansSemiblack}>
              {simpleCarVariantDetails.loanTenure}
            </p>
          </div>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Bunga</p>
            <p className={styles.openSansSemiblack}>
              {simpleCarVariantDetails.flatRate}%
            </p>
          </div>
        </div>
        <div className={styles.rowWithSpaceBottom}>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Pembayaran Pertama</p>
            <p className={styles.openSansSemiblack}>
              Rp
              {replacePriceSeparatorByLocalization(
                Number(simpleCarVariantDetails?.totalFirstPayment),
                LanguageCode.id,
              )}
            </p>
            {selectablePromo && selectablePromo.tdpAfterPromo > 0 && (
              <p className={styles.priceStrike}>
                Rp
                {Currency(selectablePromo.tdpBeforePromo)}
              </p>
            )}
          </div>
          <div className={styles.column}>
            <p className={styles.openSansLigtGrey}>Cicilan Bulanan</p>
            <p className={styles.openSansSemiblack}>
              Rp
              {replacePriceSeparatorByLocalization(
                Number(simpleCarVariantDetails?.loanMonthlyInstallment),
                LanguageCode.id,
              )}
            </p>
            {selectablePromo &&
              typeof selectablePromo.installmentAfterPromo !== 'undefined' &&
              selectablePromo.installmentAfterPromo > 0 && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(selectablePromo.installmentBeforePromo)}
                </p>
              )}
          </div>
        </div>
        {(promoCode || (selectedPromoList && selectedPromoList.length > 0)) && (
          <div className={styles.borderFrame}>
            <div className={styles.promoWrapper}>
              <div className={styles.textPromo}>Promo yang kamu pilih:</div>
              <div className={styles.textPromoWrapper}>
                {promoList &&
                  promoList.map((item, index) => (
                    <div key={index} className={styles.textPromoBold}>
                      • {item.promoTitle}
                    </div>
                  ))}
                {promoCode && (
                  <div className={styles.textPromoBold}>• {promoCode}</div>
                )}
                <div className={styles.badgePromoWrapper}>
                  <BadgeList />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.rowWithSpaceBottom}>
          <div className={styles.columnFull}>
            <p className={styles.openSansLigtGrey}>
              Pembayaran Cicilan Pertama
            </p>
            <p className={styles.openSansSemiblack}>
              {optionADDM === 'ADDM' ? 'Bayar di Depan' : 'Bayar di Belakang'}
            </p>
          </div>
        </div>
        {selectablePromo && (
          <div
            className={styles.rowWithSpaceBottom}
            style={{ marginBottom: 0 }}
          >
            <div className={styles.columnFull}>
              <p className={styles.openSansLigtGrey}>Tipe Asuransi</p>
              <p className={styles.openSansSemiblack}>
                {selectablePromo.selectedInsurance.label}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PopupCreditDetail
