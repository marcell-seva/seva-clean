import React, { useContext, useEffect, useState } from 'react'
import { BottomSheetProps } from 'react-spring-bottom-sheet'
import clsx from 'clsx'
import {
  FinalLoan,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { useContextCalculator } from 'services/context/calculatorContext'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { BottomSheet, IconInfo } from 'components/atoms'
import FormSelectAssurance from 'components/molecules/form/formSelectAssurance'
import { PromoBottomList } from '../promoBottomList'
import PromoBottomCalculation from '../promoBottomCalculation'
import styles from 'styles/components/organisms/promoBottomSheet.module.scss'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

interface PromoProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  selectedTenure: number
  selectedCalculatePromoInsurance: LoanCalculatorInsuranceAndPromoType
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
  promoInsuranceReal: LoanCalculatorInsuranceAndPromoType[]
  setPromoInsuranceReal: (value: LoanCalculatorInsuranceAndPromoType[]) => void
  setFinalLoan: (value: FinalLoan) => void
  onOpenInsuranceTooltip: () => void
  pageOrigination?: string
}

const PromoBottomSheet = ({
  onClose,
  selectedTenure,
  selectedCalculatePromoInsurance,
  calculationApiPayload,
  promoInsuranceReal,
  setPromoInsuranceReal,
  setFinalLoan,
  onOpenInsuranceTooltip,
  pageOrigination,
  ...props
}: PromoProps) => {
  const [promoInsuranceTemp, setPromoInsuranceTemp] =
    useState(promoInsuranceReal)
  const indexForSelectedTenure = promoInsuranceTemp.findIndex(
    (obj: LoanCalculatorInsuranceAndPromoType) => {
      return obj.tenure === selectedTenure
    },
  )
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [isLoadingApiPromoList, setIsLoadingApiPromoList] = useState(false)
  const isCarDontHavePromo =
    promoInsuranceTemp[indexForSelectedTenure].allPromoListOnlyFullComprehensive
      .length === 0
  const [simpleCarVariantDetails, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  // const [latestState, setLatestState] = useState(state)
  // const [isAllBestPromo, setIsAllBestPromo] = useState(false)

  // useEffect(() => {
  //   if (contextValue.state[0].promoList.find((e: any) => e.is_Best_Promo)) {
  //     const isBestPromo = contextValue.state[0].promoList.filter(
  //       (data: any) => {
  //         return data.is_Best_Promo
  //       },
  //     )
  //     const isBestPromoDefault = selectablePromo.filter((data) => {
  //       return data.is_Best_Promo
  //     })
  //     if (isBestPromo.length < isBestPromoDefault.length) {
  //       setIsAllBestPromo(false)
  //       setPromoSelected('regular')
  //     } else {
  //       setIsAllBestPromo(true)
  //       setPromoSelected('best')
  //     }
  //   }

  //   // if (contextValue.state.promo.length === 0) {
  //   //   setPromoSelected('unused')
  //   // }
  // }, [contextValue, isAllBestPromo])

  const onChooseInsuranceItem = () => {
    const hasOpenedInsuranceToast: string =
      getSessionStorage(SessionStorageKey.HasOpenedInsuranceToast) ?? ''
    if (!hasOpenedInsuranceToast && !isCarDontHavePromo) {
      setIsOpenToast(true)
      saveSessionStorage(SessionStorageKey.HasOpenedInsuranceToast, 'true')
    }
  }

  useEffect(() => {
    if (isOpenToast) {
      setTimeout(() => {
        setIsOpenToast(false)
      }, 2000)
    }
  }, [isOpenToast])
  useEffect(() => {
    let newState
    if (
      !promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some((e: any) =>
        e.promoTitle.toLowerCase().includes('giias'),
      )
    ) {
      if (
        promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
          (a: any) => a.promoId === 'SDD01',
        )
      ) {
        newState = promoInsuranceTemp.map(
          (obj: LoanCalculatorInsuranceAndPromoType) => {
            // 👇️ if tenure equals currently selected, update object property
            if (obj.tenure === selectedTenure) {
              return {
                ...obj,
                tdpAfterPromo:
                  obj.tdpBeforePromo - obj.subsidiDp - obj.dpDiscount,
              }
            }

            // 👇️ otherwise return the object as is
            return obj
          },
        )
      } else {
        if (
          promoInsuranceTemp[indexForSelectedTenure].applied
            .toLowerCase()
            .includes('spekta') &&
          promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
            (a: any) => a.promoId === 'TS01',
          )
        ) {
          newState = promoInsuranceTemp.map(
            (obj: LoanCalculatorInsuranceAndPromoType) => {
              // 👇️ if tenure equals currently selected, update object property
              if (obj.tenure === selectedTenure) {
                return {
                  ...obj,
                  tdpAfterPromo: obj.tdpWithPromo,
                  installmentAfterPromo: obj.installmentWithPromo,
                  interestRateAfterPromo: obj.interestRateWithPromo,
                }
              }

              // 👇️ otherwise return the object as is
              return obj
            },
          )
        } else {
          newState = promoInsuranceTemp.map(
            (obj: LoanCalculatorInsuranceAndPromoType) => {
              // 👇️ if tenure equals currently selected, update object property
              if (obj.tenure === selectedTenure) {
                return {
                  ...obj,
                  tdpAfterPromo:
                    obj.dpDiscount !== 0
                      ? obj.tdpBeforePromo - obj.dpDiscount
                      : 0,
                  installmentAfterPromo: 0,
                  interestRateAfterPromo: 0,
                }
              }

              // 👇️ otherwise return the object as is
              return obj
            },
          )
        }
      }

      setPromoInsuranceTemp(newState)
    } else {
      if (
        promoInsuranceTemp[indexForSelectedTenure].selectedPromo.some(
          (a: any) => a.promoId === 'SDD01',
        )
      ) {
        newState = promoInsuranceTemp.map(
          (obj: LoanCalculatorInsuranceAndPromoType) => {
            // 👇️ if tenure equals currently selected, update object property
            if (obj.tenure === selectedTenure) {
              return {
                ...obj,
                tdpAfterPromo: selectedCalculatePromoInsurance.tdpWithPromo,
              }
            }

            // 👇️ otherwise return the object as is
            return obj
          },
        )
      } else {
        newState = promoInsuranceTemp.map(
          (obj: LoanCalculatorInsuranceAndPromoType) => {
            // 👇️ if tenure equals currently selected, update object property
            if (obj.tenure === selectedTenure) {
              return {
                ...obj,
                tdpAfterPromo:
                  selectedCalculatePromoInsurance.tdpWithPromo +
                  selectedCalculatePromoInsurance.subsidiDp,
              }
            }

            // 👇️ otherwise return the object as is
            return obj
          },
        )
      }

      newState = promoInsuranceTemp.map(
        (obj: LoanCalculatorInsuranceAndPromoType) => {
          // 👇️ if tenure equals currently selected, update object property
          if (obj.tenure === selectedTenure) {
            return {
              ...obj,
              tdpAfterPromo: obj.tdpWithPromo,
              installmentAfterPromo: obj.installmentWithPromo,
              interestRateAfterPromo: obj.interestRateWithPromo,
            }
          }

          // 👇️ otherwise return the object as is
          return obj
        },
      )

      setPromoInsuranceTemp(newState)
    }
  }, [promoInsuranceTemp[indexForSelectedTenure].selectedPromo])

  const trackCountlyClickSubmit = () => {
    const allSelectedPromoTitle = promoInsuranceTemp[
      indexForSelectedTenure
    ].selectedPromo.map((item) => item.promoTitle)

    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_PROMO_BOTTOMSHEET_APPLY_CLICK,
      {
        PAGE_ORIGINATION: pageOrigination,
        TENOR_OPTION: `${selectedTenure} tahun`,
        INSURANCE_TYPE:
          promoInsuranceTemp[indexForSelectedTenure].selectedInsurance.label,
        PROMO_AMOUNT:
          promoInsuranceTemp[indexForSelectedTenure].selectedPromo?.length,
        PROMO_TITLE: allSelectedPromoTitle.join(', '),
      },
    )
  }

  const onClickSubmit = () => {
    if (simpleCarVariantDetails) {
      const tmpData = {
        ...simpleCarVariantDetails,
        loanDownPayment:
          promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo !== 0
            ? promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo
            : promoInsuranceTemp[indexForSelectedTenure].tdpBeforePromo,
        totalFirstPayment:
          promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo !== 0
            ? promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo
            : promoInsuranceTemp[indexForSelectedTenure].tdpBeforePromo,
        loanMonthlyInstallment:
          promoInsuranceTemp[indexForSelectedTenure].installmentAfterPromo !== 0
            ? promoInsuranceTemp[indexForSelectedTenure].installmentAfterPromo
            : promoInsuranceTemp[indexForSelectedTenure].installmentBeforePromo,
        flatRate:
          promoInsuranceTemp[indexForSelectedTenure].interestRateAfterPromo !==
          0
            ? promoInsuranceTemp[indexForSelectedTenure].interestRateAfterPromo
            : promoInsuranceTemp[indexForSelectedTenure]
                .interestRateBeforePromo,
      }
      setFinalLoan({
        selectedInsurance:
          promoInsuranceTemp[indexForSelectedTenure].selectedInsurance,
        selectedPromoFinal:
          promoInsuranceTemp[indexForSelectedTenure].selectedPromo,
        tppFinal: promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo,
        installmentFinal:
          promoInsuranceTemp[indexForSelectedTenure].installmentAfterPromo,
        interestRateFinal:
          promoInsuranceTemp[indexForSelectedTenure].interestRateAfterPromo,
        installmentBeforePromo:
          promoInsuranceTemp[indexForSelectedTenure].installmentBeforePromo,
        interestRateBeforePromo:
          promoInsuranceTemp[indexForSelectedTenure].interestRateBeforePromo,
        tdpBeforePromo:
          promoInsuranceTemp[indexForSelectedTenure].tdpBeforePromo,
      })
      setSimpleCarVariantDetails(tmpData)
    }
    trackCountlyClickSubmit()
    saveLocalStorage(
      LocalStorageKey.SelectablePromo,
      JSON.stringify(promoInsuranceTemp[indexForSelectedTenure]),
    )
    setPromoInsuranceReal(promoInsuranceTemp)
    onClose()
  }

  return (
    <BottomSheet
      title={
        isCarDontHavePromo
          ? `Tenor ${selectedTenure} Tahun`
          : `Promo Tenor ${selectedTenure} Tahun`
      }
      onDismiss={() => {
        setPromoInsuranceTemp(promoInsuranceReal)
        onClose()
      }}
      maxHeight={window.innerHeight * 0.93}
      additionalHeaderClassname={styles.bottomSheetHeader}
      className={styles.bottomSheet}
      {...props}
    >
      <FormSelectAssurance
        selectedTenure={selectedTenure}
        onChooseInsuranceItem={onChooseInsuranceItem}
        calculationApiPayload={calculationApiPayload}
        isLoadingApiPromoList={isLoadingApiPromoList}
        setIsLoadingApiPromoList={setIsLoadingApiPromoList}
        promoInsuranceTemp={promoInsuranceTemp}
        setPromoInsuranceTemp={setPromoInsuranceTemp}
        onOpenInsuranceTooltip={onOpenInsuranceTooltip}
        pageOrigination={pageOrigination}
      />
      {isCarDontHavePromo ? (
        <div className={styles.lineDividerWhenCarDontHavePromo} />
      ) : (
        <>
          <div className={styles.lineDivider} />
          <PromoBottomList
            selectedTenure={selectedTenure}
            selectablePromoList={
              promoInsuranceTemp[indexForSelectedTenure].allPromoList
            }
            isLoadingApiPromoList={isLoadingApiPromoList}
            promoInsuranceTemp={promoInsuranceTemp}
            setPromoInsuranceTemp={setPromoInsuranceTemp}
            pageOrigination={pageOrigination}
          />
        </>
      )}
      <PromoBottomCalculation
        onClose={() => {
          onClickSubmit()
        }}
        regularTDP={promoInsuranceTemp[indexForSelectedTenure].tdpBeforePromo}
        finalTDP={promoInsuranceTemp[indexForSelectedTenure].tdpAfterPromo}
        regularInstallment={
          promoInsuranceTemp[indexForSelectedTenure].installmentBeforePromo
        }
        finalInstallment={
          promoInsuranceTemp[indexForSelectedTenure].installmentAfterPromo
        }
        interestRate={
          promoInsuranceTemp[indexForSelectedTenure].interestRateBeforePromo
        }
        finalInterestRate={
          promoInsuranceTemp[indexForSelectedTenure].interestRateAfterPromo
        }
        promoAstraPay={promoInsuranceTemp[
          indexForSelectedTenure
        ].selectedPromo.some((e: any) => e.promoId === 'CDS02')}
        promoInsurance={promoInsuranceTemp[
          indexForSelectedTenure
        ].selectedPromo.some((e: any) => e.promoId === 'CDS04')}
        promoCashBack={promoInsuranceTemp[
          indexForSelectedTenure
        ].selectedPromo.some((e: any) => e.promoId === 'CDS01')}
        totalSelectedPromo={
          promoInsuranceTemp[indexForSelectedTenure].selectedPromo.length
        }
        isLoadingApiPromoList={isLoadingApiPromoList}
      />

      <div
        // not using ant design modal, because this toast use different relative positioning
        className={clsx({
          [styles.toast]: true,
          [styles.hideComponent]: !isOpenToast,
        })}
      >
        <IconInfo width={16} height={16} color="#FFFFFF" />
        <span className={styles.toastMessage}>
          Rekomendasi promo diterapkan secara otomatis
        </span>
      </div>
    </BottomSheet>
  )
}

export default PromoBottomSheet
