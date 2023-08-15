import React, { useMemo } from 'react'

import { IconWhatsapp } from 'components/atoms'
import { colors } from 'styles/colors'
import styled from 'styled-components'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { defaultCSANumber, hundred, million, ten } from 'utils/helpers/const'
// import { trackWhatsappButtonClickFromCarResults } from 'helpers/trackingEvents'
import {
  CarSearchPageMintaPenawaranParam,
  trackCarVariantPageWaChatbot,
} from 'helpers/amplitude/seva20Tracking'
// import { getCustomerAssistantWhatsAppNumber } from 'services/lead'
// import { EventFromType } from 'helpers/amplitude/newHomePageEventTracking'
// import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { t } from 'config/localization/locales/id'
import { useRouter } from 'next/router'
import { trackWhatsappButtonClickFromCarResults } from 'helpers/amplitude/trackingEvents'
import { EventFromType } from 'helpers/amplitude/newHomePageEventTracking'
import { getCustomerAssistantWhatsAppNumber } from 'services/lead'
import { useCar } from 'services/context/carContext'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { LoanRank, PageFrom } from 'utils/types/models'

export const TanyaSeva = () => {
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  // const { t } = useTranslation()
  const { carModelDetails } = useCar()
  const { funnelQuery } = useFunnelQueryData()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const minimumDp = useMemo(() => {
    if (!carModelDetails) return ''
    return getMinimumDp(carModelDetails.variants, LanguageCode.en, million, ten)
  }, [carModelDetails])

  const minimumMonthlyInstallment = useMemo(() => {
    if (!carModelDetails) return ''
    return getMinimumMonthlyInstallment(
      carModelDetails.variants,
      LanguageCode.en,
      million,
      hundred,
    )
  }, [carModelDetails])

  const goToWhatsApp = async () => {
    if (!carModelDetails) return

    const { brand, model } = carModelDetails
    const carName = `${brand} ${model}`
    const message = t.CarResultPage.whatsappMessage({
      carName,
      dpRange: minimumDp,
      monthlyRange: minimumMonthlyInstallment,
      tenure: funnelQuery?.tenure || 5,
    })
    trackWhatsappButtonClickFromCarResults(
      EventFromType.carResults,
      carName,
      `${minimumDp} jt`,
      `${minimumMonthlyInstallment} jt`,
      PageFrom?.CarResultVariant,
    )
    const loanRankcr = router.query.loanRankCVL ?? ''
    const trackerProperty: CarSearchPageMintaPenawaranParam = {
      Car_Brand: brand,
      Car_Model: model,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carModelDetails?.variants[0].priceValue,
        LanguageCode?.id,
      )}`,
      DP: `Rp${minimumDp} Juta`,
      Cicilan: `Rp${minimumMonthlyInstallment} jt/bln`,
      Tenure: `${funnelQuery?.tenure || 5} Tahun`, // convert string
      City: cityOtr?.cityName || 'Jakarta Pusat',
      Peluang_Kredit:
        funnelQuery?.monthlyIncome && funnelQuery?.age && loanRankcr
          ? loanRankcr === LoanRank.Green
            ? 'Mudah'
            : loanRankcr === LoanRank.Red
            ? 'Sulit'
            : 'Null'
          : 'Null',
    }
    trackCarVariantPageWaChatbot(trackerProperty)
    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    const windowReference: any = window.open()
    windowReference.location = `${whatsAppUrl}?text=${encodeURI(message)}`
  }
  return (
    <>
      {isMobile ? (
        <TanyaSevaMobileWrapper role="button" onClick={goToWhatsApp}>
          <IconWhatsapp color={colors.white} width={20} height={20} />
          <TanyaSevaMobileText>TANYA SEVA</TanyaSevaMobileText>
        </TanyaSevaMobileWrapper>
      ) : (
        <TanyaSevaWrapper role="button" onClick={goToWhatsApp}>
          <IconWhatsapp color={colors.white} width={19.6} height={20.39} />
          <TanyaSevaText>TANYA SEVA</TanyaSevaText>
        </TanyaSevaWrapper>
      )}
    </>
  )
}

const TanyaSevaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 7.44px;
  height: 48px;
  background-color: #26c649;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  border-radius: 8px;
  width: 85px;
  cursor: pointer;
`

const TanyaSevaText = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;

  color: ${colors.white};
  line-height: 14px;
  font-size: 12px;
  width: 42.5px;
  cursor: pointer;
`

const TanyaSevaMobileWrapper = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  height: 42px;
  cursor: pointer;
  background-color: #26c649;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  width: 86px;
`

const TanyaSevaMobileText = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;

  color: ${colors.white};
  line-height: 12px;
  font-size: 10px;
  width: 44px;
  cursor: pointer;
`
