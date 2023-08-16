import React, { useContext, useEffect, useState } from 'react'
import { BottomSheetProps } from 'react-spring-bottom-sheet'
import clsx from 'clsx'
import {
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
} from 'utils/types/utils'
import { useContextCalculator } from 'services/context/calculatorContext'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { SessionStorageKey } from 'utils/enum'
import { BottomSheet, IconInfo } from 'components/atoms'
import FormSelectAssurance from 'components/molecules/form/formSelectAssurance'
import { PromoBottomList } from '../promoBottomList'
import PromoBottomCalculation from '../promoBottomCalculation'
import styles from 'styles/components/organisms/promoBottomSheet.module.scss'

interface PromoProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  selectedTenure: number
  selectablePromo: LoanCalculatorInsuranceAndPromoType
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
}

const PromoBottomSheet = ({
  onClose,
  selectedTenure,
  selectablePromo,
  calculationApiPayload,
  ...props
}: PromoProps) => {
  const {
    insuranceAndPromo: promoInsurance,
    setInsuranceAndPromo: setPromoInsurance,
  } = useContextCalculator()

  const indexForSelectedTenure = promoInsurance.findIndex(
    (obj: LoanCalculatorInsuranceAndPromoType) => {
      return obj.tenure === selectedTenure
    },
  )
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [isLoadingApiPromoList, setIsLoadingApiPromoList] = useState(false)
  const isCarDontHavePromo =
    promoInsurance[indexForSelectedTenure]?.allPromoListOnlyFullComprehensive
      ?.length === 0
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
    if (
      !promoInsurance[indexForSelectedTenure]?.selectedPromo.some((e: any) =>
        e.promoTitle.toLowerCase().includes('giias'),
      )
    ) {
      const temp = [...promoInsurance]
      if (
        promoInsurance[indexForSelectedTenure]?.selectedPromo.some(
          (a: any) => a.promoId === 'SDD01',
        )
      ) {
        if (temp[indexForSelectedTenure]) {
          temp[indexForSelectedTenure].tdpAfterPromo =
            temp[indexForSelectedTenure].tdpBeforePromo -
            temp[indexForSelectedTenure].subsidiDp
        }
      } else {
        if (
          promoInsurance[indexForSelectedTenure]?.applied
            .toLowerCase()
            .includes('spekta') &&
          promoInsurance[indexForSelectedTenure]?.selectedPromo.some(
            (a: any) => a.promoId === 'TS01',
          )
        ) {
          if (temp[indexForSelectedTenure]) {
            temp[indexForSelectedTenure].tdpAfterPromo =
              temp[indexForSelectedTenure].tdpWithPromo

            temp[indexForSelectedTenure].installmentAfterPromo =
              temp[indexForSelectedTenure].installmentWithPromo
            temp[indexForSelectedTenure].interestRateAfterPromo =
              temp[indexForSelectedTenure].interestRateWithPromo
          }
        } else {
          if (temp[indexForSelectedTenure]) {
            temp[indexForSelectedTenure].tdpAfterPromo = 0
            temp[indexForSelectedTenure].installmentAfterPromo = 0
            temp[indexForSelectedTenure].interestRateAfterPromo = 0
          }
        }
      }

      setPromoInsurance(temp)
    } else {
      const temp = [...promoInsurance]
      if (
        promoInsurance[indexForSelectedTenure]?.selectedPromo.some(
          (a: any) => a.promoId === 'SDD01',
        )
      ) {
        temp[indexForSelectedTenure].tdpAfterPromo =
          selectablePromo.tdpWithPromo
      } else {
        temp[indexForSelectedTenure].tdpAfterPromo =
          selectablePromo.tdpWithPromo + selectablePromo.subsidiDp
      }
      temp[indexForSelectedTenure].installmentAfterPromo =
        selectablePromo.installmentWithPromo
      temp[indexForSelectedTenure].interestRateAfterPromo =
        selectablePromo.interestRateWithPromo
      setPromoInsurance(temp)
    }
  }, [promoInsurance[indexForSelectedTenure]?.selectedPromo])

  return (
    <BottomSheet
      title={
        isCarDontHavePromo
          ? `Tenor ${selectedTenure} Tahun`
          : `Promo Tenor ${selectedTenure} Tahun`
      }
      onDismiss={() => {
        // setState(latestState)
        onClose()
      }}
      maxHeight={window.innerHeight * 0.93}
      additionalHeaderClassname={styles.bottomSheetHeader}
      {...props}
    >
      <FormSelectAssurance
        selectedTenure={selectedTenure}
        onChooseInsuranceItem={onChooseInsuranceItem}
        calculationApiPayload={calculationApiPayload}
        isLoadingApiPromoList={isLoadingApiPromoList}
        setIsLoadingApiPromoList={setIsLoadingApiPromoList}
      />
      {isCarDontHavePromo ? (
        <div className={styles.lineDividerWhenCarDontHavePromo} />
      ) : (
        <>
          <div className={styles.lineDivider} />
          <PromoBottomList
            selectedTenure={selectedTenure}
            selectablePromoList={selectablePromo.allPromoList}
            isLoadingApiPromoList={isLoadingApiPromoList}
          />
        </>
      )}
      <PromoBottomCalculation
        onClose={() => {
          // setLatestState(state)
          onClose()
        }}
        regularTDP={selectablePromo.tdpBeforePromo}
        finalTDP={selectablePromo.tdpAfterPromo}
        regularInstallment={selectablePromo.installmentBeforePromo}
        finalInstallment={selectablePromo.installmentAfterPromo}
        interestRate={selectablePromo.interestRateBeforePromo}
        finalInterestRate={selectablePromo.interestRateAfterPromo}
        promoAstraPay={promoInsurance[
          indexForSelectedTenure
        ]?.selectedPromo.some((e: any) => e.promoId === 'CDS02')}
        promoInsurance={promoInsurance[
          indexForSelectedTenure
        ]?.selectedPromo.some((e: any) => e.promoId === 'CDS04')}
        promoCashBack={promoInsurance[
          indexForSelectedTenure
        ]?.selectedPromo.some((e: any) => e.promoId === 'CDS01')}
        totalSelectedPromo={selectablePromo?.selectedPromo.length}
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
