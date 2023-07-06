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
import React, { memo, useEffect, useRef, useState } from 'react'
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

type tabProps = {
  tab: string | undefined
  isSticky?: boolean
}
const Price = memo(({ tab, isSticky }: tabProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { carModelDetails } = useContextCarModelDetails()
  const { carVariantDetails } = useContextCarVariantDetails()
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const [openPromo, setOpenPromo] = useState(false)
  const { modal, patchModal } = useModalContext()
  const { showModal: showPromoModal, CarVariantPromoModal } =
    useCarVariantPromoModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { recommendations } = useContextRecommendations()
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
    // setTrackEventMoEngage('view_variant_list_price_tab', objData)
  }
  useEffect(() => {
    if (carModelDetails && cityOtr) {
      const trackNewCarVariantList: WebVariantListPageParam = {
        Car_Brand: carModelDetails.brand as string,
        Car_Model: carModelDetails.model as string,
        OTR: `Rp${replacePriceSeparatorByLocalization(
          carModelDetails.variants[0].priceValue as number,
          LanguageCode.id,
        )}`,
        DP: `Rp${formatSortPrice(
          carModelDetails.variants[0].dpAmount as number,
        )} Juta`,
        Tenure: '5 Tahun',
        City: cityOtr.cityName || 'Jakarta Pusat',
      }

      trackWebPDPPriceTab(trackNewCarVariantList)
      trackEventMoengage(carModelDetails?.images)
    }
  }, [carModelDetails, cityOtr])

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

  if (!carModelDetails || !carVariantDetails) return <></>

  const descTitle = `Harga ${carModelDetails.brand} ${
    carModelDetails.model
  } di ${cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'}`

  const priceListTitle = `Harga Mobil ${carModelDetails.brand} ${
    carModelDetails.model
  } di ${cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'}`

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand ?? '',
      Car_Model: carModelDetails?.model ?? '',
      City: cityOtr?.cityName || 'null',
    }
  }

  const amplitudeTrackClosePromoModal = () => {
    trackCarVariantBannerPromoPopupClose({
      ...getDataForAmplitude(),
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carModelDetails?.variants[0].priceValue || 0,
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
          description={carVariantDetails.variantDetail.description.id}
          carModel={carModelDetails}
          carVariant={carVariantDetails}
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
