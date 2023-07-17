import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { useModalContext } from 'context/modalContext/modalContext'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { useContextSpecialRateResults } from 'context/specialRateResultsContext/specialRateResultsContext'
import {
  trackCarVariantBannerPromoPopupClose,
  trackWebPDPPriceTab,
  WebVariantListPageParam,
} from 'helpers/amplitude/seva20Tracking'
import { setTrackEventMoEngage } from 'helpers/moengage'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import {
  formatSortPrice,
  replacePriceSeparatorByLocalization,
} from 'utils/numberUtils/numberUtils'
import { PriceList } from './PriceList/PriceList'
import { PromoButton } from './PromoButton/PromoButton'
import { useCarVariantPromoModal } from 'components/molecules/CarVariantPromoModal/CarVariantPromoModal'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { Description } from 'components/organism/OldPdpSectionComponents/Description/Description'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'

type tabProps = {
  tab: string | undefined
  isSticky?: boolean
}
const Price = memo(({ tab, isSticky }: tabProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
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
      : carRecommendationsResDefaultCity
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const [openPromo, setOpenPromo] = useState(false)
  const { modal, patchModal } = useModalContext()
  const { showModal: showPromoModal, CarVariantPromoModal } =
    useCarVariantPromoModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  useEffect(() => {
    if (isSticky) {
      const timeout = setTimeout(() => {
        scrollToSectionContent()
      }, 10)

      return () => clearTimeout(timeout)
    }
  }, [tab])
  const scrollToContent = useRef<null | HTMLDivElement>(null)
  const scrollToSectionContent = () => {
    scrollToContent.current?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    })
  }
  useEffect(() => {
    setSpecialRateResults([])
  }, [])

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
    setTrackEventMoEngage('view_variant_list_price_tab', objData)
  }
  useEffect(() => {
    if (modelDetailData && cityOtr) {
      const trackNewCarVariantList: WebVariantListPageParam = {
        Car_Brand: modelDetailData.brand as string,
        Car_Model: modelDetailData.model as string,
        OTR: `Rp${replacePriceSeparatorByLocalization(
          modelDetailData.variants[0].priceValue as number,
          LanguageCode.id,
        )}`,
        DP: `Rp${formatSortPrice(
          modelDetailData.variants[0].dpAmount as number,
        )} Juta`,
        Tenure: '5 Tahun',
        City: cityOtr.cityName || 'Jakarta Pusat',
      }

      trackWebPDPPriceTab(trackNewCarVariantList)
      trackEventMoengage(modelDetailData?.images)
    }
  }, [modelDetailData, cityOtr])

  const openPopupPromo = () => {
    if (isMobile) {
      patchModal({ isOpenPromoList: true })
      setOpenPromo(true)
    } else {
      showPromoModal()
    }
  }

  const closePopupPromo = () => {
    amplitudeTrackClosePromoModal()
    setOpenPromo(false)
    setTimeout(() => {
      patchModal({ isOpenPromoList: false })
    }, 500)
  }

  const descTitle = `Harga ${modelDetailData.brand} ${
    modelDetailData.model
  } di ${cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'}`

  const priceListTitle = `Harga Mobil ${modelDetailData.brand} ${
    modelDetailData.model
  } di ${cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'}`

  const getDataForAmplitude = () => {
    return {
      Car_Brand: modelDetailData?.brand ?? '',
      Car_Model: modelDetailData?.model ?? '',
      City: cityOtr?.cityName || 'null',
    }
  }

  const amplitudeTrackClosePromoModal = () => {
    trackCarVariantBannerPromoPopupClose({
      ...getDataForAmplitude(),
      OTR: `Rp${replacePriceSeparatorByLocalization(
        modelDetailData?.variants[0].priceValue || 0,
        LanguageCode.id,
      )}`,
      Page_Origination_URL: window.location.href,
    })
  }

  return (
    <>
      <div
        ref={scrollToContent}
        style={{ scrollMargin: isMobile ? '0px' : '30px' }}
      />
      <Container>
        <StyledDescription
          title={descTitle}
          description={variantDetailData.variantDetail.description.id}
          carModel={modelDetailData}
          carVariant={variantDetailData}
          tab="price"
        />
        <PriceListWrapperDesktop>
          {!isMobile && <Title>{priceListTitle}</Title>}
          <PriceList />
        </PriceListWrapperDesktop>
        <Title style={!isMobile ? { marginBottom: 16 } : {}}>
          Promo {!isMobile && 'Mobil'} Terbaik
        </Title>
        <PromoButton onClick={openPopupPromo} />
      </Container>
      {/* <StyledSlideUpModal showPopup={modal.isOpenPromoList}>
        <PromoListMobile openPromo={openPromo} onClose={closePopupPromo} />
      </StyledSlideUpModal> */}
      <CarVariantPromoModal onCloseModal={amplitudeTrackClosePromoModal} />
    </>
  )
})

export default Price

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px 15px;

  @media (min-width: 1025px) {
    max-width: 1040px;
    width: 100%;
    margin: 0 auto 100px;
    padding: 48px 0 0;
  }
`

const StyledDescription = styled(Description)`
  margin-bottom: 28px;

  @media (min-width: 1025px) {
    margin-bottom: 29px;
  }
`

const Title = styled.h2`
  font-family: 'KanyonBold';
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 8px;

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 28px;
    width: 1040px;
    margin: 0 auto 8px;
  }
`

const PriceListWrapperDesktop = styled.div`
  @media (min-width: 1025px) {
    //force wider than parent
    width: 100vw;
    position: relative;
    left: calc(-50vw + 50%);
    //

    display: flex;
    flex-direction: column;
    background-color: ${colors.primarySkyBlue10};
    gap: 16px;
    padding-top: 41px;
    padding-bottom: 42px;
    margin-bottom: 47px;
  }
`
