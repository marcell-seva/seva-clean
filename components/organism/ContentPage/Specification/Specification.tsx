import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import React, { memo, useEffect, useRef, useState } from 'react'
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
import { Description } from 'components/organism/OldPdpSectionComponents/Description/Description'
import { SpecificationSelect } from 'components/organism/OldPdpSectionComponents/SpecificationSelect/SpecificationSelect'
import { SpecificationDetail } from 'components/organism/OldPdpSectionComponents/SpecificationDetail/SpecificationDetail'
import { ButtonVersion, LanguageCode, LocalStorageKey } from 'utils/enum'
import { ButtonSize } from 'components/atoms/button'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { CarVariantRecommendation, CityOtrOption } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { trackVariantDetailsEvent } from 'components/organism/OldPdpSectionComponents/variantDetailsUtils'

type tabProps = {
  tab: string | undefined
  isSticky?: boolean
}
const Specification = memo(({ tab, isSticky }: tabProps) => {
  const { carModelDetails } = useContextCarModelDetails()
  // TODO @toni : old amplitude tracker
  // const carResultParameter = useCarResultParameter()
  const { carVariantDetails } = useContextCarVariantDetails()
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [selected, setSelected] = useState<CarVariantRecommendation | null>(
    null,
  )
  const { recommendations } = useContextRecommendations()
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
    Car_Brand: carModelDetails?.brand as string,
    Car_Model: carModelDetails?.model as string,
    OTR: `Rp${replacePriceSeparatorByLocalization(
      carModelDetails?.variants[0].priceValue as number,
      LanguageCode.id,
    )}`,
    City: cityOtr?.cityName || 'null',
  }

  const trackNewCarVariantList: WebVariantListPageParam = {
    ...trackBrosur,
    DP: `Rp${formatSortPrice(
      carModelDetails?.variants[0].dpAmount as number,
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
      brand: carModelDetails?.brand,
      model: carModelDetails?.model,
      price:
        carModelDetails?.variants && carModelDetails?.variants.length > 0
          ? carModelDetails.variants[0].priceValue
          : '-',
      monthly_installment:
        carModelDetails?.variants && carModelDetails?.variants.length > 0
          ? carModelDetails.variants[0].monthlyInstallment
          : '-',
      down_payment:
        carModelDetails?.variants && carModelDetails?.variants.length > 0
          ? carModelDetails.variants[0].dpAmount
          : '-',
      loan_tenure:
        carModelDetails?.variants && carModelDetails.variants.length > 0
          ? carModelDetails.variants[0].tenure
          : '-',
      car_seat: carVariantDetails?.variantDetail.carSeats,
      fuel: carVariantDetails?.variantDetail.fuelType,
      transmition: carVariantDetails?.variantDetail.transmission,
      dimension:
        recommendations?.filter(
          (car) => car.id === carVariantDetails?.modelDetail.id,
        ).length > 0
          ? recommendations?.filter(
              (car) => car.id === carVariantDetails?.modelDetail.id,
            )[0].height
          : '',
      body_type: carVariantDetails?.variantDetail.bodyType
        ? carVariantDetails?.variantDetail.bodyType
        : '-',
      Image_URL: carImages[0],
      Brand_Model: `${carModelDetails?.brand} ${carModelDetails?.model}`,
    }
    // setTrackEventMoEngage('view_variant_list_specification_tab', objData)
  }

  useEffect(() => {
    if (carModelDetails && cityOtr) {
      trackWebPDPSpecificationTab(trackNewCarVariantList)

      trackEventMoengage(carModelDetails?.images)
    }
  }, [carModelDetails, cityOtr])

  const onBrochureClick = () => {
    if (carVariantDetails?.loanDetail) {
      // TODO @toni : old amplitude tracker
      // trackVariantDetailsEvent({
      //   carVariantDetails,
      //   carResultParameter,
      //   trackFunction: trackSelectCarResultVariantDetailsViewBrochure,
      // })
    }

    if (carModelDetails && cityOtr) {
      trackDownloadBrosurClick(trackBrosur)
    }
  }

  if (!carModelDetails || !carVariantDetails) return <></>

  return (
    <>
      <div
        ref={scrollToContent}
        style={{ scrollMargin: isMobile ? '90px' : '30px' }}
      />
      <Container>
        <DescriptionWrapper>
          <Description
            title={`Spesifikasi ${carModelDetails.brand} ${
              carModelDetails.model
            } di ${
              cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'
            }`}
            description={carVariantDetails.variantDetail.description.id}
            carModel={carModelDetails}
            carVariant={carVariantDetails}
            tab="spesification"
          />
        </DescriptionWrapper>
        <SpecsAndBrochureWrapper>
          <SpecificationSelectWrapper>
            <SpecificationSelect
              options={carModelDetails.variants.sort(
                (a, b) => a.priceValue - b.priceValue,
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
              href={carVariantDetails?.variantDetail.pdfUrl}
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
