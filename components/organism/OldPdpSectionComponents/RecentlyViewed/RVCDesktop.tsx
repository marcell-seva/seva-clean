import React, { HTMLAttributes, useRef, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { CarModelDetail } from './RecentlyViewed'
import { CarouselContext } from 'pure-react-carousel'
import { RVCCarInfo } from './RVCCarInfo'
import { CarRecommendation } from 'utils/types'
const ShimmerLoader = '/revamp/illustration/placeholder.gif'

interface CarTileProps extends HTMLAttributes<HTMLDivElement> {
  carModel: CarModelDetail
  onModelClick?: () => void
  loanRankNavigationHandler?: () => void
  onCurrentSlide: (slide: number, maxSlide: number) => void
}
export const RVCDesktop = ({
  carModel,
  onModelClick,
  onCurrentSlide,
  ...restProps
}: CarTileProps) => {
  const carTileRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const carouselContext = useContext(CarouselContext)

  const carModelRecommendations: CarRecommendation = {
    ...carModel,
  }

  useEffect(() => {
    function onChange() {
      const currentSlide = carouselContext.state.currentSlide
      const maxSlide = carouselContext.state.totalSlides
      onCurrentSlide(currentSlide, maxSlide)
    }
    carouselContext.subscribe(onChange)
    return () => carouselContext.unsubscribe(onChange)
  }, [carouselContext])

  return (
    <StyledCarTileWrapper {...restProps} ref={carTileRef}>
      <CarTile onClick={onModelClick}>
        <ImageSection>
          <CarImage
            src={carModel.images[0]}
            alt={carModel.brandAndModel}
            placeholder={<ShimmerBox height={170} />}
            visibleByDefault={false}
          />
        </ImageSection>
        <RVCCarInfo carModel={carModelRecommendations} />
      </CarTile>
    </StyledCarTileWrapper>
  )
}

const StyledCarTileWrapper = styled.div`
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);

  @media (min-width: 1025px) {
    border-radius: 8px;
    width: 360px;
  }
`

const CarTile = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 360px;
  color: ${colors.body};
  background: ${colors.white};
  overflow: hidden;

  @media (min-width: 1025px) {
    border-radius: 8px;
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

const CarImage = styled(LazyLoadImage)`
  object-fit: contain;
  width: 100%;

  aspect-ratio: 4 / 3;
`

const Shimmer = styled.div<{ radius?: number }>`
  background-image: url(${ShimmerLoader as any});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: ${({ radius }) => radius || 10}px;
`

const ShimmerBox = styled(Shimmer)<{
  width?: string
  height: number
  marginBottom?: number
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width};
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
