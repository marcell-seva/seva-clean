import React, { useState, useEffect } from 'react'
import styles from 'styles/components/molecules/form/formSelectAssurance.module.scss'
import { IconInfo } from '../../../atoms'
import clsx from 'clsx'
import { getLocalStorage } from 'utils/handler/localStorage'
import { getCustomerInfoSeva } from 'services/customer'
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
import { useContextCalculator } from 'services/context/calculatorContext'
import { LocalStorageKey } from 'utils/enum'
import {
  postLoanPermutationAsuransiKombinasi,
  postLoanPermutationIncludePromo,
} from 'services/newFunnel'
import { IconRadioButtonActive } from 'components/atoms/icon/RadioButtonActive'
import { IconRadioButtonInactive } from 'components/atoms/icon/RadioButtonInactive'

interface Props {
  selectedTenure: number
  onChooseInsuranceItem: () => void
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
  isLoadingApiPromoList: boolean
  setIsLoadingApiPromoList: (value: boolean) => void
}

const FormSelectAssurance = ({
  selectedTenure,
  onChooseInsuranceItem,
  calculationApiPayload,
  isLoadingApiPromoList,
  setIsLoadingApiPromoList,
}: Props) => {
  const {
    insuranceAndPromo: promoInsurance,
    setInsuranceAndPromo: setPromoInsurance,
  } = useContextCalculator()

  const indexForSelectedTenure = promoInsurance.findIndex(
    (obj: LoanCalculatorInsuranceAndPromoType) => {
      return obj.tenure === selectedTenure
    },
  )
  const isLoading = false
  const isCarDontHavePromo =
    promoInsurance[indexForSelectedTenure]?.allPromoListOnlyFullComprehensive
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
  ) => {
    const isAppliedSDD01Promo = responseData.promoArr.some(
      (a) => a.promoId === 'SDD01',
    )

    const newList = [...promoInsurance]
    newList[indexForSelectedTenure].allPromoList = generateAllBestPromoList(
      isUserHasReffcode
        ? responseData.promoArr.filter(
            (a: PromoItemType) =>
              a.promoId !== 'CDS01' && a.promoId !== 'CDS02',
          )
        : responseData.promoArr.filter(
            (a: PromoItemType) => a.promoId !== 'CDS01',
          ),
    )
    // apply all "best" promo everytime insurance change
    newList[indexForSelectedTenure].selectedPromo = generateAllBestPromoList(
      isUserHasReffcode
        ? responseData.promoArr.filter(
            (a: PromoItemType) => a.promoId !== 'CDS02',
          )
        : responseData.promoArr,
    )
    newList[indexForSelectedTenure].applied = responseData.applied
    newList[indexForSelectedTenure].tdpBeforePromo =
      responseData.totalFirstPayment
    newList[indexForSelectedTenure].tdpAfterPromo =
      getTdpAffectedByPromo(responseData)
    newList[indexForSelectedTenure].tdpWithPromo =
      getTdpAffectedByPromo(responseData)
    newList[indexForSelectedTenure].installmentBeforePromo =
      responseData.installment
    newList[indexForSelectedTenure].installmentAfterPromo =
      getInstallmentAffectedByPromo(responseData)
    newList[indexForSelectedTenure].installmentWithPromo =
      getInstallmentAffectedByPromo(responseData)
    newList[indexForSelectedTenure].interestRateBeforePromo =
      responseData.interestRate
    newList[indexForSelectedTenure].interestRateWithPromo =
      getInterestRateAffectedByPromo(responseData)
    newList[indexForSelectedTenure].interestRateAfterPromo =
      getInterestRateAffectedByPromo(responseData)
    newList[indexForSelectedTenure].subsidiDp = isAppliedSDD01Promo
      ? responseData.subsidiDp
      : 0
    setPromoInsurance(newList)
  }

  const onClickItem = (item: any) => {
    if (isLoadingApiPromoList || !calculationApiPayload) {
      return
    }

    if (item.value === 'FC') {
      setIsLoadingApiPromoList(true)
      postLoanPermutationIncludePromo(calculationApiPayload)
        .then((response) => {
          const resultForCurrentTenure = response.data.filter(
            (item: SpecialRateListWithPromoType) =>
              item.tenure == selectedTenure,
          )

          if (resultForCurrentTenure.length > 0) {
            updateDataInsuranceAndPromo(resultForCurrentTenure[0])
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
        postLoanPermutationAsuransiKombinasi({
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
        })
          .then((response) => {
            updateDataInsuranceAndPromo(response.data[0])
          })
          .finally(() => {
            setIsLoadingApiPromoList(false)
          })
      }
    }

    setPromoInsurance((prev) => [
      ...prev,
      (promoInsurance[indexForSelectedTenure].selectedInsurance = item),
    ])
    onChooseInsuranceItem()
  }

  const renderInsuranceItem = (item: any, index: number) => {
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
            [styles.textFormBold]: item.value === 'FC',
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
          {promoInsurance[indexForSelectedTenure]?.selectedInsurance?.value ===
          item.value ? (
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>
            Pilih Asuransi <IconInfo width={16} height={16} color="#AFB3BA" />
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
            : promoInsurance[indexForSelectedTenure]?.allInsuranceList?.map(
                (item, index) => {
                  return renderInsuranceItem(item, index)
                },
              )}
        </div>
      </div>
    </>
  )
}

export default FormSelectAssurance
