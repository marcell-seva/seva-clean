import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { Button, IconDownload } from 'components/atoms'
// import { useCarResultParameter } from 'hooks/useAmplitudePageView/useAmplitudePageView'
// import { trackSelectCarResultVariantDetailsViewBrochure } from 'helpers/amplitude/newFunnelEventTracking'
import { useContextSpecialRateResults } from 'context/specialRateResultsContext/specialRateResultsContext'
import { useMediaQuery } from 'react-responsive'
import {
  trackDownloadBrosurClick,
  trackSpesifikaiTabVariantClick,
  trackWebPDPSpecificationTab,
  WebVariantListPageParam,
} from 'helpers/amplitude/seva20Tracking'
import {
  formatSortPrice,
  replacePriceSeparatorByLocalization,
} from 'utils/numberUtils/numberUtils'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { Description } from 'components/organisms/OldPdpSectionComponents/Description/Description'
import { SpecificationSelect } from 'components/organisms/OldPdpSectionComponents/SpecificationSelect/SpecificationSelect'
import { SpecificationDetail } from 'components/organisms/OldPdpSectionComponents/SpecificationDetail/SpecificationDetail'
import {
  ButtonVersion,
  ButtonSize,
  LanguageCode,
  LocalStorageKey,
} from 'utils/enum'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { CarVariantRecommendation, CityOtrOption } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { trackVariantDetailsEvent } from 'components/organisms/OldPdpSectionComponents/variantDetailsUtils'
import { useCarResultParameter } from 'utils/hooks/useAmplitudePageView/useAmplitudePageView'
import { trackSelectCarResultVariantDetailsViewBrochure } from 'helpers/amplitude/newFunnelEventTracking'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'

type tabProps = {
  tab: string | undefined
  isSticky?: boolean
}
const Specification = memo(({ tab, isSticky }: tabProps) => {
  const { carModelDetails } = useContextCarModelDetails()
  const { carVariantDetails } = useContextCarVariantDetails()
  const { recommendations } = useContextRecommendations()
  const {
    carModelDetailsResDefaultCity,
    carVariantDetailsResDefaultCity,
    carRecommendationsResDefaultCity,
  } = useContext(PdpDataLocalContext)
  const modelDetailData = carModelDetails || carModelDetailsResDefaultCity
  const variantDetailData = carVariantDetails || carVariantDetailsResDefaultCity
  const recommendationsDetailData =
    recommendations.length !== 0
      ? recommendations
      : carRecommendationsResDefaultCity.carRecommendations
  const carResultParameter = useCarResultParameter()
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [selected, setSelected] = useState<CarVariantRecommendation | null>(
    null,
  )
  const scrollToContent = useRef<null | HTMLDivElement>(null)
  const scrollToSectionContent = () => {
    scrollToContent.current?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    })
  }
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const trackBrosur = {
    Car_Brand: modelDetailData?.brand as string,
    Car_Model: modelDetailData?.model as string,
    OTR: `Rp${replacePriceSeparatorByLocalization(
      modelDetailData?.variants[0].priceValue as number,
      LanguageCode.id,
    )}`,
    City: cityOtr?.cityName || 'null',
  }

  const trackNewCarVariantList: WebVariantListPageParam = {
    ...trackBrosur,
    DP: `Rp${formatSortPrice(
      modelDetailData?.variants[0].dpAmount as number,
    )} Juta`,
    Tenure: '5 Tahun',
  }

  useEffect(() => {
    setSpecialRateResults([])
  }, [])

  useEffect(() => {
    if (isSticky) {
      const timeout = setTimeout(() => {
        scrollToSectionContent()
      }, 10)

      return () => clearTimeout(timeout)
    }
  }, [tab])

  const trackEventMoengage = (carImages: string[]) => {
    const objData = {
      brand: modelDetailData?.brand,
      model: modelDetailData?.model,
      price:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].priceValue
          : '-',
      monthly_installment:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].monthlyInstallment
          : '-',
      down_payment:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].dpAmount
          : '-',
      loan_tenure:
        modelDetailData?.variants && modelDetailData.variants.length > 0
          ? modelDetailData.variants[0].tenure
          : '-',
      car_seat: variantDetailData?.variantDetail.carSeats,
      fuel: variantDetailData?.variantDetail.fuelType,
      transmition: variantDetailData?.variantDetail.transmission,
      dimension:
        recommendationsDetailData?.filter(
          (car: any) => car.id === variantDetailData?.modelDetail.id,
        ).length > 0
          ? recommendationsDetailData?.filter(
              (car: any) => car.id === variantDetailData?.modelDetail.id,
            )[0].height
          : '',
      body_type: variantDetailData?.variantDetail.bodyType
        ? variantDetailData?.variantDetail.bodyType
        : '-',
      Image_URL: carImages[0],
      Brand_Model: `${modelDetailData?.brand} ${modelDetailData?.model}`,
    }
    setTrackEventMoEngage('view_variant_list_specification_tab', objData)
  }

  useEffect(() => {
    if (modelDetailData && cityOtr) {
      trackWebPDPSpecificationTab(trackNewCarVariantList)

      trackEventMoengage(modelDetailData?.images)
    }
  }, [modelDetailData, cityOtr])

  const onBrochureClick = () => {
    if (variantDetailData?.loanDetail) {
      trackVariantDetailsEvent({
        carVariantDetails,
        carResultParameter,
        trackFunction: trackSelectCarResultVariantDetailsViewBrochure,
      })
    }

    if (modelDetailData && cityOtr) {
      trackDownloadBrosurClick(trackBrosur)
    }
  }

  return (
    <>
      <div
        ref={scrollToContent}
        style={{ scrollMargin: isMobile ? '90px' : '30px' }}
      />
      <Container>
        <DescriptionWrapper>
          <Description
            title={`Spesifikasi ${modelDetailData.brand} ${
              modelDetailData.model
            } di ${
              cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'
            }`}
            description={variantDetailData.variantDetail.description.id}
            carModel={modelDetailData}
            carVariant={variantDetailData}
            tab="spesification"
          />
        </DescriptionWrapper>
        <SpecsAndBrochureWrapper>
          <SpecificationSelectWrapper>
            <SpecificationSelect
              options={modelDetailData.variants.sort(
                (a: any, b: any) => a.priceValue - b.priceValue,
              )}
              onChooseOption={(item) => {
                setSelected(item)
                const trackProperties = {
                  ...trackNewCarVariantList,
                  Car_Variant: item.name,
                  OTR: `Rp${replacePriceSeparatorByLocalization(
                    item.priceValue,
                    LanguageCode.id,
                  )}`,
                  DP: `Rp${formatSortPrice(item.dpAmount)} Juta`,
                  Tenure: String(item.tenure),
                  Cicilan: `Rp${formatSortPrice(
                    item.monthlyInstallment,
                  )} jt/bln`,
                }
                trackSpesifikaiTabVariantClick(trackProperties)
              }}
            />
          </SpecificationSelectWrapper>
          <SpecificationDetail selected={selected} />
          <DownloadBrochureWrapper>
            <DownloadUpperText>
              Butuh Informasi Lebih Lengkap?
            </DownloadUpperText>
            <a
              href={variantDetailData?.variantDetail.pdfUrl}
              style={{ width: '100%', display: 'flex' }}
              target="_blank"
              rel="noreferrer"
            >
              <StyledDownloadButton
                type="button"
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                onClick={onBrochureClick}
              >
                <IconDownload width={25} height={25} color={'#FFFFFF'} />
                Download Brosur
              </StyledDownloadButton>
            </a>
          </DownloadBrochureWrapper>
        </SpecsAndBrochureWrapper>
      </Container>
    </>
  )
})

export default Specification

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px 15px;

  @media (min-width: 1025px) {
    padding: 0;
  }
`

const DescriptionWrapper = styled.div`
  @media (min-width: 1025px) {
    padding: 48px 0 36px;
  }
`

const SpecsAndBrochureWrapper = styled.div`
  @media (min-width: 1025px) {
    background: ${colors.primarySkyBlue10};
    padding: 41px 0 83px;
  }
`

const SpecificationSelectWrapper = styled.div`
  @media (min-width: 1025px) {
    width: 1040px;
    margin: 0 auto;
  }
`

const DownloadBrochureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const DownloadUpperText = styled.span`
  font-family: 'Kanyon';
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;

  color: ${colors.label};
  padding: 12px 0;

  @media (min-width: 1025px) {
    font-family: 'KanyonMedium';
    padding: 40px 0 12px;
  }
`

const StyledDownloadButton = styled(Button)`
  width: 100%;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;

  @media (min-width: 1025px) {
    display: flex;
    align-items: center;
    width: 1040px;
    margin: 0 auto;
    gap: 30px;
    font-size: 16px;
    font-family: 'KanyonBold';
    border-radius: 8px;
    height: 48px;
    background: #05256e;
    color: #ffffff;
  }
`
