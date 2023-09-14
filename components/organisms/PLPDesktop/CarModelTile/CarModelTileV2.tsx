import React, {
  HTMLAttributes,
  MouseEventHandler,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { useTranslation } from 'react-i18next'
// import { trackWhatsappButtonClickFromCarResults } from 'helpers/trackingEvents'
// import { EventFromType } from 'helpers/amplitude/newHomePageEventTracking'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import { getCustomerAssistantWhatsAppNumber } from 'services/lead'
import { useMediaQuery } from 'react-responsive'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
// import { Shimmer } from 'pages/component/Shimmer/Shimmer'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { hundred, million, ten } from 'utils/helpers/const'
import {
  CarSearchPageMintaPenawaranParam,
  trackCarResultPageWaChatbot,
  trackWhatsappButtonClickFromCarResults,
} from 'helpers/amplitude/seva20Tracking'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import elementId from 'helpers/elementIds'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CarRecommendation, CityOtrOption } from 'utils/types'
import { CarInfo } from './CarInfo'
import Image from 'next/image'
import { WhatsAppIcon } from 'components/atoms/icon/WhatsAppIcon'
import { BadgeLoanStatus } from './BadgeLoanStatus'
import { EventFromType } from 'helpers/amplitude/newHomePageEventTracking'
import { LoanRank, PageFrom } from 'utils/types/models'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface CarTileProps extends HTMLAttributes<HTMLDivElement> {
  carModel: CarRecommendation
  onModelClick: MouseEventHandler<HTMLDivElement | HTMLButtonElement>
  loanRankNavigationHandler?: () => void
}
export const CarModelTileV2 = ({
  carModel,
  onModelClick,
  ...restProps
}: CarTileProps) => {
  const { t } = useTranslation()
  const carTileRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const minimumDp = getMinimumDp(
    carModel.variants,
    LanguageCode.en,
    million,
    ten,
  )
  const minimumMonthlyInstallment = getMinimumMonthlyInstallment(
    carModel.variants,
    LanguageCode.en,
    million,
    hundred,
  )
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const isMobile = useMediaQuery({ query: 'max-width: 1024px' })
  const [currentSlide, setCurrentSlide] = useState(0)
  const { funnelQuery } = useFunnelQueryData()

  const getBadgeStatus = () => {
    if (funnelQuery.monthlyIncome && funnelQuery.age) {
      return carModel.loanRank
    } else {
      return ''
    }
  }

  const goToWhatsApp = async () => {
    if (!carModel) return
    const { brand, model } = carModel
    const carName = `${brand} ${model}`
    const message = t('carResultsPage.whatsappMessage', {
      carName,
      dpRange: minimumDp,
      monthlyRange: minimumMonthlyInstallment,
      tenure: funnelQuery.tenure || 5,
    })
    trackWhatsappButtonClickFromCarResults(
      EventFromType.carResults,
      carName,
      `${minimumDp} jt`,
      `${minimumMonthlyInstallment} jt`,
      PageFrom.CarResult,
    )
    const trackerProperty: CarSearchPageMintaPenawaranParam = {
      Car_Brand: brand,
      Car_Model: model,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carModel.lowestAssetPrice,
        LanguageCode.id,
      )}`,
      DP: `Rp${minimumDp} Juta`,
      Cicilan: `Rp${minimumMonthlyInstallment} jt/bln`,
      Tenure: `${funnelQuery.tenure || 5} Tahun`, // convert string
      City: cityOtr.cityName || 'Jakarta Pusat',
      Peluang_Kredit:
        funnelQuery.monthlyIncome && funnelQuery.age
          ? carModel.loanRank === LoanRank.Green
            ? 'Mudah'
            : carModel.loanRank === LoanRank.Red
            ? 'Sulit'
            : 'Null'
          : 'Null',
    }
    trackCarResultPageWaChatbot(trackerProperty)
    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    window.open(`${whatsAppUrl}?text=${encodeURI(message)}`, '_blank')
  }

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index)
    }
  }

  const carouselIndicator = () => {
    return (
      <IndicatorContainer>
        <Bullet isSelected={currentSlide === 0}></Bullet>
        <Bullet
          isSelected={
            currentSlide !== 0 && currentSlide !== carModel.images.length - 1
          }
        ></Bullet>
        <Bullet
          isSelected={currentSlide === carModel.images.length - 1}
        ></Bullet>
      </IndicatorContainer>
    )
  }

  return (
    <StyledCarTileWrapper {...restProps} ref={carTileRef}>
      <CarTile onClick={onModelClick}>
        <ImageSection>
          <StyledCarousel
            emulateTouch={true}
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            autoPlay={false}
            swipeable={true}
            infiniteLoop={false}
            showIndicators={false}
            stopOnHover={false}
            selectedItem={currentSlide}
            onChange={updateCurrentSlide}
            isMobile={isMobile}
          >
            {carModel.images.map((item: any, index: number) => {
              return (
                <CarImage key={index}>
                  <LazyLoadImage
                    data-testid={
                      elementId.CarResultPage.CarImage +
                      carModel.brand +
                      ' ' +
                      carModel.model
                    }
                    src={item}
                    alt={
                      carModel.brandAndModel ||
                      `${carModel.brand} ${carModel.model}`
                    }
                    style={{ objectFit: 'contain' }}
                    width={360}
                    height={270}
                  />
                </CarImage>
              )
            })}
          </StyledCarousel>
          {carouselIndicator()}
          <BadgeLoanStatusWrapper
            onClick={(e) => {
              // prevent navigate to variant list page
              e.stopPropagation()
            }}
          >
            <BadgeLoanStatus
              loanRank={getBadgeStatus()}
              onModelClick={onModelClick}
              carModel={carModel}
            />
          </BadgeLoanStatusWrapper>
        </ImageSection>
        <CarInfo carModel={carModel} />
      </CarTile>
      <StyledButtonContainer>
        <StyledButtonContactUs
          data-testid={elementId.CarResultPage.ButtonOffer}
          onClick={goToWhatsApp}
        >
          <WhatsAppIcon color={colors.white} width={17} height={17} />
          <StyledButtonTextContactUs>Minta Penawaran</StyledButtonTextContactUs>
        </StyledButtonContactUs>
      </StyledButtonContainer>
    </StyledCarTileWrapper>
  )
}

const StyledCarTileWrapper = styled.div`
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);

  @media (min-width: 1025px) {
    border-radius: 8px;
  }
`

const CarTile = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  color: ${colors.body};
  background: ${colors.white};
  overflow: hidden;

  @media (min-width: 1025px) {
    border-radius: 8px 8px 0 0;
  }
`

const ImageSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  height: auto;
`

const StyledCarousel = styled(Carousel)<{
  isMobile: boolean
}>`
  && .slide {
    background: none;
    align-items: center;
    justify-content: center;
    display: flex;

  }
  && .control-dots {
    bottom: 12px;
    padding: 0 16px 0 16px;
    margin: 0;

    @media (max-width: 1024px){
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 31.5%;
    }
  }
  && .carousel * {
    box-sizing: border-box;
    && .carousel-slider{
      && .control-arrow {
        padding: 50px;
      }
    }
  }
  && .carousel-indicator {
    text-align: right;
    float: right;
    right: 2% !important;
    left: inherit;
  }
  && .carousel-arrow {
    padding: 50;
  }

  @media (min-width: 1025px) {
    border-radius: 8px 8px 0 0;
  }
}
`

const CarImage = styled.div`
  width: 360px;
  height: 270px;
`

// const ShimmerBox = styled(Shimmer)<{
//   width?: string
//   height: number
//   marginBottom?: number
// }>`
//   height: ${({ height }) => height}px;
//   width: ${({ width }) => width};
//   margin-bottom: ${({ marginBottom }) => marginBottom}px;
// `

const IndicatorContainer = styled.ul`
  position: absolute;
  bottom: 7px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
`

const Bullet = styled.li<{
  isSelected: boolean
}>`
  background: ${colors.white};
  opacity: ${({ isSelected }) => (isSelected ? '0.8' : '0.5')};
  width: ${({ isSelected }) => (isSelected ? '8px' : '6px')};
  height: ${({ isSelected }) => (isSelected ? '8px' : '6px')};
  display: inline-block;
  border-radius: 50%;
  border: 0.75px solid ${colors.placeholder};
`

const BadgeLoanStatusWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

const StyledButtonContainer = styled.div`
  width: 100%;
  background: ${colors.white};
  display: flex;
  padding: 10px 20px;

  @media (min-width: 1025px) {
    padding: 16px 20px;
    border-radius: 0 0 8px 8px;
  }
`

const StyledButtonContactUs = styled.div`
  background: ${colors.primaryBlue};
  width: 100%;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  cursor: pointer;
`

const StyledButtonTextContactUs = styled.div`
  font-family: var(--open-sans-semi-bold);
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${colors.inputBg};
`
