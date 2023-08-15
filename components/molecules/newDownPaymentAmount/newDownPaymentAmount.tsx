import { DownOutlined } from 'components/atoms'
import { NewSelect } from 'components/atoms/SelectOld/NewSelect'
import { downPaymentConfig } from 'config/downPaymentAmount.config'
import { trackFilterCarResults } from 'helpers/amplitude/newFunnelEventTracking'
import elementId from 'helpers/elementIds'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCar } from 'services/context/carContext'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import { DownPaymentType } from 'utils/enum'
import { getConvertDP } from 'utils/filterUtils'
import { useCarResultParameter } from 'utils/hooks/useAmplitudePageView'
import { toNumber } from 'utils/stringUtils'
import { FormControlValue } from 'utils/types'
import { FunnelQueryKey } from 'utils/types/models'

interface DownPaymentAmountProps {
  isSideMenuFilter?: boolean
  isError?: boolean
  onHomepage?: boolean
  placeholder?: string
  setDownPaymentAmount?: (value: string) => void
}

export const NewDownPaymentAmount = ({
  isSideMenuFilter,
  isError = false,
  onHomepage = true,
  placeholder,
  setDownPaymentAmount,
}: DownPaymentAmountProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const { patchFinancialQuery } = useFinancialQueryData()
  const [dataDP, setDataDP] = useState(funnelQuery.downPaymentAmount)
  const { t } = useTranslation()
  const { saveRecommendation } = useCar()
  const carResultParameters = useCarResultParameter()
  const [errorMsg] = useState<string>(t('common.errorMessage'))
  const paramQuery = funnelQuery

  const handleOnChange = (optionValue: FormControlValue) => {
    if (onHomepage) {
      patchFunnelQuery({
        [FunnelQueryKey.DownPaymentAmount]: optionValue as string,
        [FunnelQueryKey.DownPaymentType]: DownPaymentType.DownPaymentAmount,
      })
      patchFinancialQuery({
        [FunnelQueryKey.DownPaymentAmount]: optionValue,
        [FunnelQueryKey.DownPaymentType]: DownPaymentType.DownPaymentAmount,
      })
      paramQuery.downPaymentAmount = optionValue as string
      paramQuery.downPaymentType = DownPaymentType.DownPaymentAmount
      if (isSideMenuFilter) {
        immediateFilter()
      }
    } else {
      if (optionValue)
        setDownPaymentAmount && setDownPaymentAmount(optionValue?.toString())
    }
  }

  const handleSuccess = (response: any) => {
    saveRecommendation(response.carRecommendations || [])
  }

  const handleError = () => {
    console.log(errorMsg)
  }

  const immediateFilter = () => {
    // === AMPLITUDE TRACKING ===
    const filterCarResult = {
      maxMonthlyInstallments: toNumber(
        funnelQuery.monthlyInstallment as string,
      ),
      downPayment: toNumber(funnelQuery.downPaymentAmount as string),
      downPaymentPercentage: funnelQuery.downPaymentPercentage
        ? Number(funnelQuery.downPaymentPercentage) / 100
        : null,
      brands: funnelQuery.brand ? funnelQuery.brand : [],
      ...carResultParameters,
    }

    trackFilterCarResults(filterCarResult)

    getNewFunnelRecommendations(paramQuery)
      .then((response) => {
        handleSuccess(response)
      })
      .catch(() => {
        handleError()
      })
  }

  useEffect(() => {
    setDataDP(getConvertDP(funnelQuery.downPaymentAmount))
  }, [funnelQuery])

  return (
    <div
      className={`downpayment-amount-select-element ${
        isError ? 'shake-animation-X' : ''
      }`}
    >
      <NewSelect
        value={dataDP}
        options={downPaymentConfig.options}
        name={'downPaymentAmount'}
        idDropdown={elementId.Homepage.CarSearchWidget.DropdownDp}
        onChoose={handleOnChange}
        suffixIcon={DownOutlined}
        floatDropdown={true}
        placeholder={
          placeholder
            ? placeholder
            : onHomepage
            ? 'Pilih maksimal DP yang kamu inginkan*'
            : 'Pilih maksimal down payment'
        }
        isError={isError}
      />
    </div>
  )
}
