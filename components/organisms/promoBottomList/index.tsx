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

interface Props {
  selectedTenure: number
  selectablePromoList: PromoItemType[]
  isLoadingApiPromoList: boolean
}

export const PromoBottomList = ({
  selectedTenure,
  selectablePromoList,
  isLoadingApiPromoList,
}: Props) => {
  const {
    insuranceAndPromo: promoInsurance,
    setInsuranceAndPromo: setPromoInsurance,
  } = useContextCalculator()

  const [groupPromo, setGroupPromo] = useState<
    'best-promo' | 'additional-promo' | ''
  >('')
  const indexForSelectedTenure = promoInsurance.findIndex(
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

  const handleSelect = (item: PromoItemType) => {
    if (
      !promoInsurance[indexForSelectedTenure]?.selectedPromo?.some(
        (x: any) => x.promoId === item.promoId,
      )
    ) {
      const temp = [...promoInsurance]
      temp[indexForSelectedTenure].selectedPromo = [
        ...temp[indexForSelectedTenure].selectedPromo,
        item,
      ]
      setPromoInsurance(temp)
    } else {
      const temp = promoInsurance[
        indexForSelectedTenure
      ]?.selectedPromo?.filter((x: any) => x.promoId !== item.promoId)
      const newList = [...promoInsurance]
      newList[indexForSelectedTenure].selectedPromo = temp
      setPromoInsurance(newList)
    }
  }

  useEffect(() => {
    if (
      promoInsurance[indexForSelectedTenure]?.selectedPromo?.some(
        (x: any) => x.is_Best_Promo,
      )
    ) {
      setGroupPromo('best-promo')
    } else if (
      promoInsurance[indexForSelectedTenure]?.selectedPromo?.some(
        (x: any) => !x.is_Best_Promo,
      )
    ) {
      setGroupPromo('additional-promo')
    } else {
      setGroupPromo('')
    }
  }, [promoInsurance[indexForSelectedTenure]?.selectedPromo])

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
                    selected={promoInsurance[
                      indexForSelectedTenure
                    ]?.selectedPromo?.some(
                      (x: any) => x.promoId === promo.promoId,
                    )}
                    groupPromo={groupPromo}
                    onSelect={handleSelect}
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
                    />
                  ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
