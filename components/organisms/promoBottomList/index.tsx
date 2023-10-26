import React, { useContext, useEffect, useState } from 'react'
import styles from 'styles/components/organisms/promoBottomList.module.scss'
import stylex from 'styles/components/organisms/promoBottomSheet.module.scss'
import clsx from 'clsx'
import {
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  PromoItemType,
} from 'utils/types/utils'
import { useContextCalculator } from 'services/context/calculatorContext'
import { ShimmerPromoCard } from 'components/molecules/shimmerPromoCard'
import { SelectablePromo } from 'components/molecules/selectablePromo'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { api } from 'services/api'
import {
  getInstallmentAffectedByPromo,
  getInterestRateAffectedByPromo,
  getTdpAffectedByPromo,
} from 'utils/loanCalculatorUtils'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { SessionStorageKey } from 'utils/enum'

interface Props {
  selectedTenure: number
  selectablePromoList: PromoItemType[]
  isLoadingApiPromoList: boolean
  promoInsuranceTemp: LoanCalculatorInsuranceAndPromoType[]
  setPromoInsuranceTemp: (value: LoanCalculatorInsuranceAndPromoType[]) => void
  pageOrigination?: string
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
  isLoadingRecalculateSDD01: boolean
  setIsLoadingRecalculateSDD01: (value: boolean) => void
}

export const PromoBottomList = ({
  selectedTenure,
  selectablePromoList,
  isLoadingApiPromoList,
  promoInsuranceTemp,
  setPromoInsuranceTemp,
  pageOrigination,
  calculationApiPayload,
  isLoadingRecalculateSDD01,
  setIsLoadingRecalculateSDD01,
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

  const handleWhenClickPromoSDD01 = async (
    type: 'select' | 'unselect',
    promoItem: PromoItemType,
  ) => {
    if (type === 'select') {
      const dataFromSessionStorageWhenIncludeSDD01 = getSessionStorage(
        SessionStorageKey.BackupDataLoanPermutationWhenIncludeSDD01,
      )
      if (
        !!dataFromSessionStorageWhenIncludeSDD01 &&
        Array.isArray(dataFromSessionStorageWhenIncludeSDD01)
      ) {
        const dataMatchWithCurrentTenure =
          dataFromSessionStorageWhenIncludeSDD01.filter((item: any) => {
            return item.tenure === selectedTenure
          })[0]

        if (!dataMatchWithCurrentTenure) return

        const newState = promoInsuranceTemp.map(
          (obj: LoanCalculatorInsuranceAndPromoType) => {
            // 👇️ if tenure equals currently selected, update selectedPromo property
            if (obj.tenure === selectedTenure) {
              return {
                ...obj,
                selectedPromo: [...obj.selectedPromo, promoItem],
                tdpBeforePromo: dataMatchWithCurrentTenure.tdpBeforePromo,
                tdpWithPromo: dataMatchWithCurrentTenure.tdpWithPromo,
                tdpAfterPromo: dataMatchWithCurrentTenure.tdpAfterPromo,
                installmentBeforePromo:
                  dataMatchWithCurrentTenure.installmentBeforePromo,
                installmentWithPromo:
                  dataMatchWithCurrentTenure.installmentWithPromo,
                installmentAfterPromo:
                  dataMatchWithCurrentTenure.installmentAfterPromo,
                interestRateBeforePromo:
                  dataMatchWithCurrentTenure.interestRateBeforePromo,
                interestRateWithPromo:
                  dataMatchWithCurrentTenure.interestRateWithPromo,
                interestRateAfterPromo:
                  dataMatchWithCurrentTenure.interestRateAfterPromo,
              }
            }

            // 👇️ otherwise return the object as is
            return obj
          },
        )

        setPromoInsuranceTemp(newState)
      }
    } else {
      if (calculationApiPayload) {
        saveSessionStorage(
          SessionStorageKey.BackupDataLoanPermutationWhenIncludeSDD01,
          JSON.stringify(promoInsuranceTemp),
        )

        let tempTdpBeforePromo =
          promoInsuranceTemp[indexForSelectedTenure].tdpBeforePromo
        let tempTdpWithPromo =
          promoInsuranceTemp[indexForSelectedTenure].tdpWithPromo
        let tempTdpAfterPromo =
          promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo
        let tempInstallmentBeforePromo =
          promoInsuranceTemp[indexForSelectedTenure].installmentBeforePromo
        let tempInstallmentWithPromo =
          promoInsuranceTemp[indexForSelectedTenure].installmentWithPromo
        let tempInstallmentAfterPromo =
          promoInsuranceTemp[indexForSelectedTenure].installmentAfterPromo
        let tempInterestBeforePromo =
          promoInsuranceTemp[indexForSelectedTenure].interestRateBeforePromo
        let tempInterestWithPromo =
          promoInsuranceTemp[indexForSelectedTenure].interestRateWithPromo
        let tempInterestAfterPromo =
          promoInsuranceTemp[indexForSelectedTenure].interestRateAfterPromo

        setIsLoadingRecalculateSDD01(true)
        api
          .postLoanPermutationIncludePromo({
            ...calculationApiPayload,
            calculateIncludeSubsidi: false,
          })
          .then((response) => {
            const result = response.data.reverse()
            const permutationMatchingCurrentTenure = result.filter(
              (item: any) => {
                return item.tenure === selectedTenure
              },
            )[0]

            if (!permutationMatchingCurrentTenure) return

            tempTdpBeforePromo =
              permutationMatchingCurrentTenure.totalFirstPayment
            tempTdpWithPromo = getTdpAffectedByPromo(
              permutationMatchingCurrentTenure,
            )
            tempTdpAfterPromo = getTdpAffectedByPromo(
              permutationMatchingCurrentTenure,
            )
            tempInstallmentBeforePromo =
              permutationMatchingCurrentTenure.installment
            tempInstallmentWithPromo = getInstallmentAffectedByPromo(
              permutationMatchingCurrentTenure,
            )
            tempInstallmentAfterPromo = getInstallmentAffectedByPromo(
              permutationMatchingCurrentTenure,
            )
            tempInterestBeforePromo =
              permutationMatchingCurrentTenure.interestRate
            tempInterestWithPromo = getInterestRateAffectedByPromo(
              permutationMatchingCurrentTenure,
            )
            tempInterestAfterPromo = getInterestRateAffectedByPromo(
              permutationMatchingCurrentTenure,
            )
          })
          .catch((e) => {
            console.error(e)
          })
          .finally(() => {
            setIsLoadingRecalculateSDD01(false)
            const temp = promoInsuranceTemp[
              indexForSelectedTenure
            ].selectedPromo.filter((x: any) => x.promoId !== promoItem.promoId)

            const newState = promoInsuranceTemp.map(
              (obj: LoanCalculatorInsuranceAndPromoType) => {
                // 👇️ if tenure equals currently selected, update selectedPromo property
                if (obj.tenure === selectedTenure) {
                  return {
                    ...obj,
                    selectedPromo: temp,
                    tdpBeforePromo: tempTdpBeforePromo,
                    tdpWithPromo: tempTdpWithPromo,
                    tdpAfterPromo: tempTdpAfterPromo,
                    installmentBeforePromo: tempInstallmentBeforePromo,
                    installmentWithPromo: tempInstallmentWithPromo,
                    installmentAfterPromo: tempInstallmentAfterPromo,
                    interestRateBeforePromo: tempInterestBeforePromo,
                    interestRateWithPromo: tempInterestWithPromo,
                    interestRateAfterPromo: tempInterestAfterPromo,
                  }
                }

                // 👇️ otherwise return the object as is
                return obj
              },
            )

            setPromoInsuranceTemp(newState)
          })
      }
    }
  }

  const handleSelect = (item: PromoItemType) => {
    if (isLoadingRecalculateSDD01) return

    if (
      !promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
        (x: any) => x.promoId === item.promoId,
      )
    ) {
      setTimeout(() => {
        trackCountlySelectPromoItem(item)
      }, 500)

      if (item.promoId === 'SDD01') {
        handleWhenClickPromoSDD01('select', item)
      } else {
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
      }
    } else {
      setTimeout(() => {
        trackCountlyUnselectPromoItem(item)
      }, 500)

      if (item.promoId === 'SDD01') {
        handleWhenClickPromoSDD01('unselect', item)
      } else {
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
                    isLoading={isLoadingRecalculateSDD01}
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
