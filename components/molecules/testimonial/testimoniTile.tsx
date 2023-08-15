import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { CarouselContext } from 'pure-react-carousel'
import { TestimonialData } from 'utils/types/utils'
import { Star } from 'components/atoms/icon/Star'
import { differentDateStatus } from 'utils/handler/date'

interface TestimoniTileProps {
  item: TestimonialData
  onCurrentSlide: (slide: number, maxSlide: number) => void
}

export const TestimoniTile = ({ item, onCurrentSlide }: TestimoniTileProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const carouselContext = useContext(CarouselContext)

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
    <div className="wrapper-tmt">
      {/* <StyledCardBg /> */}
      <StyledCardHeader background={item.pictureUrl}>
        <div className="linear-gradient-mobile-tmt">
          <div className="header-text-wrapper-tmt">
            <span className="text-name-tmt">{`${item.name}${
              item.age ? ` ${item.age} Tahun` : ''
            }`}</span>
            <div className="header-text-bottom-wrapper-tmt">
              <span className="text-city-tmt">{`${differentDateStatus(
                new Date(item.purchaseDate),
              )} | ${item.cityName}`}</span>
              <div className="star-wrapper-tmt">
                {Array.from(Array(item.rating), (_val, index) => (
                  <Star
                    key={index}
                    width={isMobile ? 12 : 14}
                    height={isMobile ? 11 : 14}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </StyledCardHeader>
      <div className="content-tmt">
        <div className="content-text-wrapper-tmt">
          <span className="text-detail-tmt">{item.detail}</span>
        </div>
      </div>
    </div>
  )
}

const StyledCardHeader = styled.div<{ background: string }>`
  background: url(${({ background }) => background});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 16px;
  width: 360px;
  height: 231px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: start;
  position: relative;

  @media (max-width: 1024px) {
    border-radius: 4px;
    width: 296px;
    height: 181px;
  }

  @media (max-width: 380px) {
    background-size: cover;
    width: 270px;
    // height: 181px;
  }
`
