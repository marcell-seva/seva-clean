import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { getSessionStorage } from 'utils/sessionstorageUtils'
import { variantListUrl } from 'routes/routes'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonNext,
  ButtonBack,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { useMediaQuery } from 'react-responsive'
import { RVCDesktop } from './RVCDesktop'
import {
  CarVariantSummaryTabPriceSectionParam,
  trackRecentlyViewedClick,
} from 'helpers/amplitude/seva20Tracking'
import {
  formatSortPrice,
  replacePriceSeparatorByLocalization,
} from 'utils/numberUtils/numberUtils'
import { CarVariantLoan, CityOtrOption } from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { useRouter } from 'next/router'

const leftArrow = '/revamp/icon/arrowLeftSmall.webp'
const rightArrow = '/revamp/icon/arrowRightSmall.webp'

export interface CarModelDetail {
  brand: string
  brandAndModel: string
  highestAssetPrice: number
  id: string
  image: string
  images: string[]
  loanRank: string
  lowestAssetPrice: number
  model: string
  modelAndBrand: string
  numberOfPopulation: number
  height: number
  width: number
  length: number
  variants: CarVariantLoan[]
}
export default function RecentlyViewed() {
  const router = useRouter()
  const modelDetail = getSessionStorage<CarModelDetail[] | null>(
    SessionStorageKey.PreviouslyViewed,
  )
  const [currentSlide, setCurrentSlide] = useState({ current: 0, max: 0 })
  const isDesktop3 = useMediaQuery({ query: '(min-width: 1025px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const goToVariant = (variant: CarModelDetail) => () => {
    const trackProperties: CarVariantSummaryTabPriceSectionParam = {
      Car_Brand: variant.brand,
      Car_Model: variant.model,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        variant.lowestAssetPrice,
        LanguageCode.id,
      )}`,
      City: cityOtr?.cityName || 'null',
      DP: `Rp${formatSortPrice(variant.variants[0].dpAmount)} jt/bln`,
      Cicilan: `Rp${formatSortPrice(
        variant.variants[0].monthlyInstallment,
      )} jt/bln`,
      Tenure: String(variant.variants[0].tenure),
    }
    trackRecentlyViewedClick(trackProperties)
    const destinationUrl = variantListUrl
      .replace(
        ':brand/:model',
        (variant.brand + '/' + variant.model.replace(/ +/g, '-'))
          .replace(/ +/g, '')
          .toLowerCase(),
      )
      .replace(':tab', '')
    // router.push(destinationUrl)
    // window.location.reload()
    window.location.href = destinationUrl
  }

  const getVisibleSlides = () => {
    if (isDesktop3) return 2.75
    else return 1.8
  }

  const getHeight = () => {
    if (isDesktop3) return 120
    return 80
  }

  const getWidth = () => {
    if (isDesktop3) return 90
    return 50
  }

  const showRightArrow = useMemo(() => {
    if (currentSlide.current === 0) return true
    if (currentSlide.current < currentSlide.max - 2.85) return true

    return false
  }, [currentSlide.current])

  return (
    <Container>
      <Content>
        {modelDetail && (
          <StyledContentCard>
            <StyledCarousel
              naturalSlideWidth={getWidth()}
              naturalSlideHeight={getHeight()}
              totalSlides={modelDetail.length}
              visibleSlides={getVisibleSlides()}
              currentSlide={0}
            >
              <Slider>
                {modelDetail.map((variant: CarModelDetail, index) => (
                  <Slide index={index} key={variant.id}>
                    <RVCDesktop
                      key={variant.id}
                      carModel={variant}
                      onModelClick={goToVariant(variant)}
                      onCurrentSlide={(slide, max) =>
                        setCurrentSlide({ current: slide, max })
                      }
                    />
                  </Slide>
                ))}
              </Slider>
              {isDesktop3 &&
                Array.isArray(modelDetail) &&
                modelDetail.length > 2 && (
                  <>
                    {currentSlide.current > 0 && (
                      <StyledButtonBack>
                        <StyledLeftButton />
                      </StyledButtonBack>
                    )}
                    {showRightArrow && (
                      <StyledButtonNext>
                        <StyledRightButton />
                      </StyledButtonNext>
                    )}
                  </>
                )}
            </StyledCarousel>
          </StyledContentCard>
        )}
      </Content>
    </Container>
  )
}

const Container = styled.div`
  margin-bottom: 54px;

  @media (min-width: 1025px) {
    height: 433px;
    max-width: 1040px;
    margin: 0 auto 56px;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledContentCard = styled.div`
  position: relative;
  height: 295px;

  @media (min-height: 1025px) {
    height: 433px;
  }
`

const StyledCarousel = styled(CarouselProvider)`
  .carousel__slider-tray-wrapper {
    @media (max-width: 1024px) {
      padding: 0 16px;
    }
  }
`

const StyledButtonNext = styled(ButtonNext)`
  position: absolute;
  top: 184px;
  right: -40px;
  z-index: 2;
  border: none;
  @media (max-width: 1024px) {
    display: none;
  }
`
const StyledButtonBack = styled(ButtonBack)`
  position: absolute;
  top: 184px;
  left: -40px;
  z-index: 2;
  border: none;
  @media (max-width: 1024px) {
    display: none;
  }
`
const StyledLeftButton = styled.img.attrs({
  src: leftArrow,
})`
  width: 80px;
  height: 80px;
  background: none;
  display: flex;
  @media (max-width: 1024px) {
    display: none;
  }
`
const StyledRightButton = styled.img.attrs({
  src: rightArrow,
})`
  width: 80px;
  height: 80px;
  background: none;
  @media (max-width: 1024px) {
    display: none;
  }
`
