import React, { useState, useEffect } from 'react'
import styles from 'styles/components/molecules/form/formSelectAssurance.module.scss'
import { IconInfo } from '../../../atoms'
import clsx from 'clsx'
import { getLocalStorage } from 'utils/handler/localStorage'
import { getToken } from 'utils/handler/auth'
import {
  getInstallmentAffectedByPromo,
  getInterestRateAffectedByPromo,
  getTdpAffectedByPromo,
} from 'utils/loanCalculatorUtils'
import {
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  PromoItemType,
  SpecialRateListWithPromoType,
} from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import { IconRadioButtonActive } from 'components/atoms/icon/RadioButtonActive'
import { IconRadioButtonInactive } from 'components/atoms/icon/RadioButtonInactive'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { api } from 'services/api'
import { getCustomerInfoSeva } from 'utils/handler/customer'

interface Props {
  selectedTenure: number
  onChooseInsuranceItem: () => void
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
  isLoadingApiPromoList: boolean
  setIsLoadingApiPromoList: (value: boolean) => void
  promoInsuranceTemp: LoanCalculatorInsuranceAndPromoType[]
  setPromoInsuranceTemp: (value: LoanCalculatorInsuranceAndPromoType[]) => void
  onOpenInsuranceTooltip: () => void
  pageOrigination?: string
}

const FormSelectAssurance = ({
  selectedTenure,
  onChooseInsuranceItem,
  calculationApiPayload,
  isLoadingApiPromoList,
  setIsLoadingApiPromoList,
  promoInsuranceTemp,
  setPromoInsuranceTemp,
  onOpenInsuranceTooltip,
  pageOrigination,
}: Props) => {
  const indexForSelectedTenure = promoInsuranceTemp.findIndex(
    (obj: LoanCalculatorInsuranceAndPromoType) => {
      return obj.tenure === selectedTenure
    },
  )
  const isLoading = false
  const isCarDontHavePromo =
    promoInsuranceTemp[indexForSelectedTenure].allPromoListOnlyFullComprehensive
      .length === 0

  const referralCodeLocalStorage = getLocalStorage<string>(
    LocalStorageKey.referralTemanSeva,
  )
  const [isUserHasReffcode, setIsUserHasReffcode] = useState(false)
  const checkReffcode = () => {
    if (referralCodeLocalStorage) {
      setIsUserHasReffcode(true)
    } else if (!!getToken()) {
      getCustomerInfoSeva().then((response: any) => {
        if (response[0].temanSevaTrxCode) {
          setIsUserHasReffcode(true)
        }
      })
    }
  }
  const generateAllBestPromoList = (list: PromoItemType[]) => {
    return list.map((item) => {
      // all promos from this new api, will return best promo
      return {
        ...item,
        is_Best_Promo: true,
        is_Available: true,
      }
    })
  }
  useEffect(() => {
    checkReffcode()
  }, [])

  const updateDataInsuranceAndPromo = (
    responseData: SpecialRateListWithPromoType,
    chosenInsuranceItem: any,
  ) => {
    const isAppliedSDD01Promo = responseData.promoArr.some(
      (a) => a.promoId === 'SDD01',
    )

    const newState = promoInsuranceTemp.map(
      (obj: LoanCalculatorInsuranceAndPromoType) => {
        // 👇️ if tenure equals currently selected, update object property
        if (obj.tenure === selectedTenure) {
          return {
            ...obj,
            selectedInsurance: chosenInsuranceItem,
            allPromoList: generateAllBestPromoList(
              isUserHasReffcode
                ? responseData.promoArr.filter(
                    (a: PromoItemType) =>
                      a.promoId !== 'CDS01' && a.promoId !== 'CDS02',
                  )
                : responseData.promoArr.filter(
                    (a: PromoItemType) => a.promoId !== 'CDS01',
                  ),
            ),
            selectedPromo: generateAllBestPromoList(
              isUserHasReffcode
                ? responseData.promoArr.filter(
                    (a: PromoItemType) => a.promoId !== 'CDS02',
                  )
                : responseData.promoArr,
            ),
            applied: responseData.applied,
            tdpBeforePromo: responseData.totalFirstPayment,
            tdpAfterPromo: getTdpAffectedByPromo(responseData),
            tdpWithPromo: getTdpAffectedByPromo(responseData),
            installmentBeforePromo: responseData.installment,
            installmentAfterPromo: getInstallmentAffectedByPromo(responseData),
            installmentWithPromo: getInstallmentAffectedByPromo(responseData),
            interestRateBeforePromo: responseData.interestRate,
            interestRateWithPromo: getInterestRateAffectedByPromo(responseData),
            interestRateAfterPromo:
              getInterestRateAffectedByPromo(responseData),
            subsidiDp: isAppliedSDD01Promo ? responseData.subsidiDp : 0,
            dpDiscount: responseData.dpDiscount,
          }
        }

        // 👇️ otherwise return the object as is
        return obj
      },
    )

    setPromoInsuranceTemp(newState)
  }

  const onClickItem = (item: any) => {
    if (isLoadingApiPromoList || !calculationApiPayload) {
      return
    }

    trackCountlyOptionClick(item)

    if (item.value === 'FC') {
      setIsLoadingApiPromoList(true)
      api
        .postLoanPermutationIncludePromo(calculationApiPayload)
        .then((response) => {
          const resultForCurrentTenure = response.data.filter(
            (item: SpecialRateListWithPromoType) =>
              item.tenure == selectedTenure,
          )

          if (resultForCurrentTenure.length > 0) {
            updateDataInsuranceAndPromo(resultForCurrentTenure[0], item)
          } else {
            return
          }
        })
        .finally(() => {
          setIsLoadingApiPromoList(false)
        })
    } else {
      if (calculationApiPayload) {
        setIsLoadingApiPromoList(true)
        api
          .postLoanPermutationAsuransiKombinasi({
            brand: calculationApiPayload.brand,
            model: calculationApiPayload.model,
            age: calculationApiPayload.age,
            angsuranType: calculationApiPayload.angsuranType,
            city: calculationApiPayload.city,
            discount: calculationApiPayload.discount,
            dp: calculationApiPayload.dp,
            dpAmount: calculationApiPayload.dpAmount,
            monthlyIncome: calculationApiPayload.monthlyIncome,
            otr: calculationApiPayload.otr,
            tenure: selectedTenure,
            asuransiKombinasi: item.value,
            variantId: calculationApiPayload.variantId,
          })
          .then((response) => {
            updateDataInsuranceAndPromo(response.data[0], item)
          })
          .finally(() => {
            setIsLoadingApiPromoList(false)
          })
      }
    }

    onChooseInsuranceItem()
  }

  const renderInsuranceItem = (item: any, index: number) => {
    const selected =
      promoInsuranceTemp[indexForSelectedTenure].selectedInsurance.value
    return (
      <div
        className={styles.selectFormWrapper}
        key={index}
        role="button"
        onClick={() => onClickItem(item)}
      >
        <span
          className={clsx({
            [styles.textForm]: true,
            [styles.textFormBold]: item.value === selected,
          })}
        >
          {item.label}{' '}
          {item.value === 'FC' && !isCarDontHavePromo ? (
            <span className={styles.textBestAssurance}>
              Tersedia Promo Terbaik!
            </span>
          ) : (
            <></>
          )}
        </span>
        <div>
          {promoInsuranceTemp[indexForSelectedTenure].selectedInsurance
            .value === item.value ? (
            <IconRadioButtonActive width={24} height={24} />
          ) : (
            <IconRadioButtonInactive width={24} height={24} />
          )}
        </div>
      </div>
    )
  }

  const renderShimmerItem = (index: number) => {
    return (
      <div className={styles.selectFormWrapper} key={index}>
        <div className={styles.shimmer}></div>
        <div>
          <IconRadioButtonInactive width={24} height={24} />
        </div>
      </div>
    )
  }

  const trackCountlyTooltipClick = () => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_PROMO_BOTTOMSHEET_INSURANCE_TOOLTIP_CLICK,
      {
        TENOR_OPTION: `${selectedTenure} tahun`,
        PAGE_ORIGINATION: pageOrigination,
      },
    )
  }

  const trackCountlyOptionClick = (item: any) => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_PROMO_BOTTOMSHEET_INSURANCE_OPTION_CLICK,
      {
        TENOR_OPTION: `${selectedTenure} tahun`,
        PAGE_ORIGINATION: pageOrigination,
        INSURANCE: item.label,
      },
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>
            Pilih Asuransi{' '}
            <IconInfo
              width={16}
              height={16}
              color="#AFB3BA"
              onClick={() => {
                trackCountlyTooltipClick()
                onOpenInsuranceTooltip()
              }}
            />
          </div>
        </div>
        {isCarDontHavePromo ? (
          <></>
        ) : (
          <div className={styles.wrapperHeader}>
            <div className={styles.textSubtitle}>
              Pilih salah satu asuransi untuk melihat promo yang tersedia
            </div>
          </div>
        )}
        <div className={styles.selectFormContainer}>
          {isLoading
            ? [...Array(4)].map((x, i) => renderShimmerItem(i))
            : promoInsuranceTemp[indexForSelectedTenure].allInsuranceList.map(
                (item: any, index: any) => {
                  return renderInsuranceItem(item, index)
                },
              )}
        </div>
      </div>
    </>
  )
}

export default FormSelectAssurance
