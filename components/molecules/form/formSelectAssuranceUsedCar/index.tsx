import React from 'react'
import styles from 'styles/components/molecules/form/formSelectAssurance.module.scss'
import { IconInfo } from '../../../atoms'
import clsx from 'clsx'
import {
  CreditCarCalculation,
  InsuranceDataUsedCar,
  SelectedCalculateLoanUsedCar,
} from 'utils/types/utils'
import { IconRadioButtonActive } from 'components/atoms/icon/RadioButtonActive'
import { IconRadioButtonInactive } from 'components/atoms/icon/RadioButtonInactive'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getCarCreditsSk } from 'services/api'

interface Props {
  selectedTenure: number
  onChooseInsuranceItem: () => void
  calculationApiPayload?: CreditCarCalculation
  isLoadingApiPromoList: boolean
  setIsLoadingApiPromoList: (value: boolean) => void
  promoInsuranceTemp: InsuranceDataUsedCar[]
  setPromoInsuranceTemp: (value: InsuranceDataUsedCar[]) => void
  onOpenInsuranceTooltip: () => void
  pageOrigination?: string
  setTempFinal: any
  setChosenAssurance: any
}

const FormSelectAssuranceUsedCar = ({
  selectedTenure,
  calculationApiPayload,
  isLoadingApiPromoList,
  setIsLoadingApiPromoList,
  promoInsuranceTemp,
  setPromoInsuranceTemp,
  onOpenInsuranceTooltip,
  pageOrigination,
  setTempFinal,
  setChosenAssurance,
}: Props) => {
  const indexForSelectedTenure = promoInsuranceTemp.findIndex(
    (obj: InsuranceDataUsedCar) => {
      return obj.tenor === selectedTenure
    },
  )
  const isLoading = false

  const updateDataInsuranceAndPromo = (
    responseData: SelectedCalculateLoanUsedCar[],
    chosenInsuranceItem: any,
  ) => {
    const update = {
      tenor: responseData[indexForSelectedTenure].tenor,
      totalTDP: parseInt(responseData[indexForSelectedTenure].totalDP),
      totalInstallment: parseInt(
        responseData[indexForSelectedTenure].totalInstallment,
      ),
    }
    setTempFinal(update)
    const newState = promoInsuranceTemp.map((obj: InsuranceDataUsedCar) => {
      // 👇️ if tenure equals currently selected, update object property
      if (obj.tenor === selectedTenure) {
        return {
          ...obj,
          selectedInsurance: chosenInsuranceItem,
        }
      }
      // 👇️ otherwise return the object as is
      return obj
    })
    setPromoInsuranceTemp(newState)
  }

  const onClickItem = (item: any) => {
    if (isLoadingApiPromoList || !calculationApiPayload) {
      return
    }

    if (calculationApiPayload) {
      const tempData = calculationApiPayload
      const tenureARtemp = item.tenureAR
      const tenureTLOtemp = item.tenureTLO
      tempData.tenureAR = tenureARtemp
      tempData.tenureTLO = tenureTLOtemp
      setChosenAssurance({ tenureAR: tenureARtemp, tenureTLO: tenureTLOtemp })

      const queryParam = new URLSearchParams()
      queryParam.append('nik', calculationApiPayload.nik.toString())
      queryParam.append('DP', calculationApiPayload.DP.toString())
      queryParam.append(
        'priceValue',
        calculationApiPayload.priceValue.toString(),
      )
      queryParam.append('tenureAR', tempData.tenureAR.toString())
      queryParam.append('tenureTLO', tempData.tenureTLO.toString())
      queryParam.append(
        'presentaseDP',
        calculationApiPayload.presentaseDP.toString(),
      )
      setIsLoadingApiPromoList(true)
      getCarCreditsSk('', { params: queryParam })
        .then((response) => {
          const result = response.data.reverse()
          updateDataInsuranceAndPromo(result, item)
        })
        .finally(() => {
          setIsLoadingApiPromoList(false)
        })
    }
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
        <div className={styles.selectFormContainer}>
          {isLoading
            ? [...Array(4)].map((x, i) => renderShimmerItem(i))
            : promoInsuranceTemp[indexForSelectedTenure].allInsurenceList.map(
                (item: any, index: any) => {
                  return renderInsuranceItem(item, index)
                },
              )}
        </div>
      </div>
    </>
  )
}

export default FormSelectAssuranceUsedCar
