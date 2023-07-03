import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Description } from '../../OldPdpSectionComponents/Description/Description'
import GallerySectionV2 from '../Gallery/GallerySection/GallerySectionV2'
import styled from 'styled-components'
import { PriceList } from '../Price/PriceList/PriceList'
import { PromoButton } from '../Price/PromoButton/PromoButton'
import RecentlyViewed from 'components/organism/OldPdpSectionComponents/RecentlyViewed/RecentlyViewed'
import { useModalContext } from 'context/modalContext/modalContext'
import { FAQ } from 'components/organism/OldPdpSectionComponents/FAQ/FAQ'
import { colors } from 'styles/colors'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { SEOSectionV2 } from 'components/organism/OldPdpSectionComponents/SEOSection/SEOSectionV2'
import { useContextSpecialRateResults } from 'context/specialRateResultsContext/specialRateResultsContext'
import { useMediaQuery } from 'react-responsive'
import { SpecificationDesktop } from 'components/organism/OldPdpSectionComponents/Specification/SpecificationDesktop'
import { useCarVariantPromoModal } from 'components/molecules/CarVariantPromoModal/CarVariantPromoModal'
import {
  trackCarVariantBannerPromoPopupClose,
  trackCarVariantLihatDetailSpesifikasiClick,
  trackNewVariantListPageView,
  WebVariantListPageParam,
} from 'helpers/amplitude/seva20Tracking'
import {
  formatSortPrice,
  replacePriceSeparatorByLocalization,
} from 'utils/numberUtils/numberUtils'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { CarVariantRecommendation, CityOtrOption } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LanguageCode, LocalStorageKey } from 'utils/enum'

type tabProps = {
  tab: string | undefined
  isSticky?: boolean
}
const Summary = memo(({ tab, isSticky }: tabProps) => {
  const { carModelDetails } = useContextCarModelDetails()
  const { carVariantDetails } = useContextCarVariantDetails()
  const { recommendations } = useContextRecommendations()
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const [openPromo, setOpenPromo] = useState(false)
  const { showModal: showPromoModal, CarVariantPromoModal } =
    useCarVariantPromoModal()
  const { modal, patchModal } = useModalContext()
  const [carVariantHighestPrice, setCarVariantHighestPrice] =
    useState<CarVariantRecommendation>()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

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
      body_type: carVariantDetails?.variantDetail.bodyType
        ? carVariantDetails?.variantDetail.bodyType
        : '-',
      Image_URL: carImages[0],
      Brand_Model: `${carModelDetails?.brand} ${carModelDetails?.model}`,
    }
    // setTrackEventMoEngage('view_variant_list', objData)
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

      trackNewVariantListPageView(trackNewCarVariantList)
      trackEventMoengage(carModelDetails?.images)
    }
  }, [carModelDetails, cityOtr])

  useEffect(() => {
    if (isSticky) {
      const timeout = setTimeout(() => {
        scrollToSectionContent()
      }, 10)

      return () => clearTimeout(timeout)
    }
  }, [tab])

  useEffect(() => {
    const carVariantHighest = carModelDetails?.variants.reduce(
      (p: CarVariantRecommendation, c: CarVariantRecommendation) =>
        p.priceValue > c.priceValue ? p : c,
    )

    setSpecialRateResults([])
    setCarVariantHighestPrice(carVariantHighest)
  }, [carModelDetails])

  const openPopupPromo = () => {
    showPromoModal()
  }

  const scrollToContent = useRef<null | HTMLDivElement>(null)
  const scrollToSectionContent = () => {
    scrollToContent.current?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    })
  }

  const closePopupPromo = () => {
    amplitudeTrackClosePromoModal()
    setOpenPromo(false)
    setTimeout(() => {
      patchModal({ isOpenPromoList: false })
    }, 500)
  }
  if (!carModelDetails || !carVariantDetails || !recommendations) return <></>

  const faqTitle =
    'Punya pertanyaan seputar pengajuan kredit mobil? Cek di sini!'
  const faqTitleMobile = `Punya pertanyaan seputar ${
    carModelDetails.brand + ' ' + carModelDetails.model
  }? Cek di sini!`

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand ?? '',
      Car_Model: carModelDetails?.model ?? '',
      City: cityOtr?.cityName || 'null',
    }
  }

  const amplitudeSpecificationHandler = () => {
    trackCarVariantLihatDetailSpesifikasiClick(getDataForAmplitude())
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
        style={{ scrollMargin: isMobile ? '90px' : '30px' }}
      />
      <DescriptionWrapper>
        <Description
          title={`Tentang ${carModelDetails.brand} ${
            carModelDetails.model
          } di ${
            cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'
          }`}
          description={carVariantDetails.variantDetail.description.id}
          carModel={carModelDetails}
          carVariant={carVariantDetails}
          tab="summary"
        />
      </DescriptionWrapper>
      {/* {isMobile ? (
        <ProductSpecification
          fuelType={carVariantHighestPrice?.fuelType || ''}
          carSeats={carVariantHighestPrice?.carSeats || 0}
          transmission={carVariantHighestPrice?.transmission || ''}
          BrandAndModel={carModelDetails.brand + ' ' + carModelDetails.model}
          contentPadding={'26px 16px;'}
          onClickDetail={amplitudeSpecificationHandler}
        />
      ) : ( */}
      <SpecificationDesktop
        fuelType={carVariantHighestPrice?.fuelType || ''}
        carSeats={carVariantHighestPrice?.carSeats || 0}
        transmission={carVariantHighestPrice?.transmission || ''}
        BrandAndModel={carModelDetails.brand + ' ' + carModelDetails.model}
        onClickDetail={amplitudeSpecificationHandler}
      />
      {/* )} */}
      <Container>
        {/* {isMobile && <VariantColor />} */}
        <PriceListWrapper>
          <TitlePrice>
            Harga Mobil {carModelDetails.brand + ' ' + carModelDetails.model} di{' '}
            {cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'}
          </TitlePrice>
          <PriceList />
          <Title style={!isMobile ? { marginLeft: 0, marginTop: 46 } : {}}>
            Promo Terbaik
          </Title>
          <PromoButton onClick={openPopupPromo} />
        </PriceListWrapper>
        <GalleryWrapper>
          <GallerySectionV2
            title={`Foto ${carModelDetails.brand} ${carModelDetails.model}`}
          />
        </GalleryWrapper>
      </Container>
      <Title
        style={isMobile ? { marginLeft: 16 } : { margin: '35px auto 22px' }}
      >
        Terakhir Dilihat
      </Title>
      <RecentlyViewed />
      <TitleFaq
        style={
          isMobile
            ? {
                margin: '0 16px',
                color: colors.body,
                fontSize: 14,
                lineHeight: '20px',
              }
            : {}
        }
      >
        {isMobile ? faqTitleMobile : faqTitle}
      </TitleFaq>
      {recommendations.length > 0 && (
        <FAQ
          carModel={carModelDetails}
          recommendationsModel={
            recommendations.filter((item) => item.id === carModelDetails.id)[0]
          }
        />
      )}
      <SEOSectionV2 carModel={carModelDetails} />
      {/* <StyledSlideUpModal showPopup={modal.isOpenPromoList}>
        <PromoListMobile openPromo={openPromo} onClose={closePopupPromo} />
      </StyledSlideUpModal> */}
      <CarVariantPromoModal onCloseModal={amplitudeTrackClosePromoModal} />
    </>
  )
})

export default Summary

export const sideSpacing = '16px'

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px ${sideSpacing};

  @media (min-width: 1025px) {
    padding: 48px 0 36px;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px ${sideSpacing};
`

const Title = styled.h2`
  font-family: 'KanyonBold';
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 8px;

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 28px;
    max-width: 1040px;
    margin: 0 auto 16px;
  }
`

const TitlePrice = styled.h2`
  font-family: 'KanyonBold';
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 12px;

  @media (min-width: 1025px) {
    margin-bottom: 24px;
    font-size: 20px;
    line-height: 28px;
  }
`

const TitleFaq = styled.h3`
  font-family: 'KanyonBold';
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  margin-bottom: 8px;

  @media (min-width: 1025px) {
    font-size: 20px;
    max-width: 1040px;
    margin: 0 auto;
  }
`

const PriceListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    max-width: 1040px;
    width: 100%;
    margin: 28px auto 0;
  }
`

const GalleryWrapper = styled.div`
  margin: 0 -${sideSpacing};
`
