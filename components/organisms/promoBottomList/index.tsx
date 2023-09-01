import React, { useContext, useEffect, useState } from 'react'
import styles from 'styles/components/organisms/promoBottomList.module.scss'
import stylex from 'styles/components/organisms/promoBottomSheet.module.scss'
import clsx from 'clsx'
import {
  LoanCalculatorInsuranceAndPromoType,
  PromoItemType,
} from 'utils/types/utils'
import { useContextCalculator } from 'services/context/calculatorContext'
import { ShimmerPromoCard } from 'components/molecules/shimmerPromoCard'
import { SelectablePromo } from 'components/molecules/selectablePromo'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

interface Props {
  selectedTenure: number
  selectablePromoList: PromoItemType[]
  isLoadingApiPromoList: boolean
  promoInsuranceTemp: LoanCalculatorInsuranceAndPromoType[]
  setPromoInsuranceTemp: (value: LoanCalculatorInsuranceAndPromoType[]) => void
  pageOrigination?: string
}

export const PromoBottomList = ({
  selectedTenure,
  selectablePromoList,
  isLoadingApiPromoList,
  promoInsuranceTemp,
  setPromoInsuranceTemp,
  pageOrigination,
}: Props) => {
  const [groupPromo, setGroupPromo] = useState<
    'best-promo' | 'additional-promo' | ''
  >('')
  const indexForSelectedTenure = promoInsuranceTemp.findIndex(
    (obj: LoanCalculatorInsuranceAndPromoType) => {
      return obj.tenure === selectedTenure
    },
  )

  const checkAvailableByDate = (promoDate: string | null): boolean => {
    if (promoDate === null) return true
    const prmDate = new Date(promoDate)
    const currentDate = new Date()

    if (prmDate >= currentDate) return true
    return false
  }

  const availablePromoFilter = (x: PromoItemType) =>
    x.is_Available && checkAvailableByDate(x.promoFinishDate)

  const unavailablePromoFilter = (x: PromoItemType) => !x.is_Available

  const unavailablePromoList = selectablePromoList.filter(
    unavailablePromoFilter,
  )

  const dataForCountlyOnClick = (item: PromoItemType) => {
    return {
      TENOR_OPTION: `${selectedTenure} tahun`,
      PAGE_ORIGINATION: pageOrigination,
      PROMO_TITLE: item.promoTitle,
      PROMO_TERBAIK_BADGE: item.is_Best_Promo ? 'Yes' : 'No',
    }
  }

  const trackCountlySelectPromoItem = (item: PromoItemType) => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_PROMO_BOTTOMSHEET_PROMO_SELECT,
      dataForCountlyOnClick(item),
    )
  }

  const trackCountlyUnselectPromoItem = (item: PromoItemType) => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_PROMO_BOTTOMSHEET_PROMO_UNSELECT,
      dataForCountlyOnClick(item),
    )
  }

  const trackCountlyClickSnK = (item: PromoItemType) => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_PROMO_BOTTOMSHEET_PROMO_SNK_CLICK,
      dataForCountlyOnClick(item),
    )
  }

  const handleSelect = (item: PromoItemType) => {
    if (
      !promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
        (x: any) => x.promoId === item.promoId,
      )
    ) {
      setTimeout(() => {
        trackCountlySelectPromoItem(item)
      }, 500)
      const newState = promoInsuranceTemp.map(
        (obj: LoanCalculatorInsuranceAndPromoType) => {
          // 👇️ if tenure equals currently selected, update selectedPromo property
          if (obj.tenure === selectedTenure) {
            return { ...obj, selectedPromo: [...obj.selectedPromo, item] }
          }

          // 👇️ otherwise return the object as is
          return obj
        },
      )

      setPromoInsuranceTemp(newState)
    } else {
      setTimeout(() => {
        trackCountlyUnselectPromoItem(item)
      }, 500)
      const temp = promoInsuranceTemp[
        indexForSelectedTenure
      ].selectedPromo.filter((x: any) => x.promoId !== item.promoId)

      const newState = promoInsuranceTemp.map(
        (obj: LoanCalculatorInsuranceAndPromoType) => {
          // 👇️ if tenure equals currently selected, update selectedPromo property
          if (obj.tenure === selectedTenure) {
            return { ...obj, selectedPromo: temp }
          }

          // 👇️ otherwise return the object as is
          return obj
        },
      )

      setPromoInsuranceTemp(newState)
    }
  }

  useEffect(() => {
    if (
      promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
        (x: any) => x.is_Best_Promo,
      )
    ) {
      setGroupPromo('best-promo')
    } else if (
      promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
        (x: any) => !x.is_Best_Promo,
      )
    ) {
      setGroupPromo('additional-promo')
    } else {
      setGroupPromo('')
    }
  }, [promoInsuranceTemp[indexForSelectedTenure].selectedPromo])

  return (
    <>
      <div
        className={clsx({
          [styles.container]: true,
          [styles.noDisablePromo]: unavailablePromoList.length === 0,
        })}
      >
        <span className={stylex.textTitle}>Pilih Promo</span>
        <span className={stylex.textSubtitle}>
          Pilih promo terbaik untukmu (dapat pilih lebih dari satu)
        </span>
        <div className={styles.listPromo}>
          {isLoadingApiPromoList
            ? [...Array(3)].map((x: any, i: number) => (
                <ShimmerPromoCard type={'selectable'} key={i} />
              ))
            : selectablePromoList
                .filter(availablePromoFilter)
                .map((promo, index) => (
                  <SelectablePromo
                    key={index}
                    item={promo}
                    selected={promoInsuranceTemp[
                      indexForSelectedTenure
                    ].selectedPromo.some(
                      (x: any) => x.promoId === promo.promoId,
                    )}
                    groupPromo={groupPromo}
                    onSelect={handleSelect}
                    onClickSnK={() => {
                      trackCountlyClickSnK(promo)
                    }}
                  />
                ))}
        </div>
      </div>
      {unavailablePromoList.length > 0 && (
        <>
          <div className={stylex.lineDivider}></div>
          <div className={styles.containerUnavailablePromo}>
            <span className={stylex.textTitle}>
              Promo yang Belum Bisa Dipakai
            </span>
            <div className={styles.listPromo}>
              {isLoadingApiPromoList
                ? [...Array(3)].map((x: any, i: number) => (
                    <ShimmerPromoCard type={'unavailable'} key={i} />
                  ))
                : unavailablePromoList.map((item, index) => (
                    <SelectablePromo
                      key={index}
                      item={item}
                      selected={false}
                      groupPromo={''}
                      onClickSnK={() => {
                        trackCountlyClickSnK(item)
                      }}
                    />
                  ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
