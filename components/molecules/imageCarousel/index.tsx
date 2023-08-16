import React, { CSSProperties, ReactElement, useEffect, useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { useMediaQuery } from 'react-responsive'
import { BannerHomepageType } from 'utils/types/utils'
import {
  trackHomepageBannerClick,
  trackHomepageBannerPrevNextClick,
  trackHomepageBannerView,
} from 'helpers/amplitude/seva20Tracking'

interface ImageSwipeProps {
  data: BannerHomepageType[]
  padding?: string | number
  children: ReactElement
}
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { client } from 'utils/helpers/const'

export const ImageCarousel = ({ data, children }: ImageSwipeProps) => {
  const router = useRouter()
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1024px)' })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isActiveSending, setIsActiveSending] = useState<boolean>(false)
  const [dataSentIndex, setDataSentIndex] = useState<Array<number>>([])
  const [isUserOnBannerScreen, setIsUserOnBannerScreen] =
    useState<boolean>(true)

  useEffect(() => {
    const timestamp: string | null = getTimeStamp()
    if (timestamp === null) {
      setTimestamp()
      setIsActiveSending(true)
    } else {
      if (isInBorderTime(parseInt(timestamp))) setIsActiveSending(false)
      else {
        setTimestamp()
        setIsActiveSending(true)
      }
    }
  }, [])

  const getTimeStamp = (): string | null => {
    const timestamp: string | null = sessionStorage.getItem('timestamp')
    return timestamp
  }

  const setTimestamp = (): void => {
    const currentTime = new Date().getTime()
    sessionStorage.setItem('timestamp', currentTime.toString())
  }

  const isInBorderTime = (payload: number): boolean => {
    const currentTime = new Date().getTime()
    const constrainTime = 5 * 60 * 1000
    const diffTime = currentTime - payload
    return diffTime <= constrainTime
  }

  useEffect(() => {
    if (isActiveSending && data.length > 0 && isUserOnBannerScreen) {
      const isDataSlideExists = isDataExist(dataSentIndex, currentSlide)
      if (!isDataSlideExists) {
        const dataIndex = dataSentIndex
        dataIndex.push(currentSlide)
        setDataSentIndex(dataIndex)

        pushDataLayer(data)
        trackHomepageBannerView({
          Name: data[currentSlide].name,
          Page_direction_URL: data[currentSlide].url,
          Creative_context: data[currentSlide].creativeContext,
        })
      }
    }
  }, [isActiveSending, currentSlide, data])

  const isDataExist = (data: Array<number>, key: number) => {
    const filtered = data.filter((item: number) => item === key)
    return filtered.length > 0
  }

  const handleScroll = () => {
    const position: number = window.pageYOffset
    if (position > 470) setIsUserOnBannerScreen(false)
    else setIsUserOnBannerScreen(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const pushDataLayer = (payload: Array<BannerHomepageType>): void => {
    window.dataLayer.push({
      ecommerce: {
        promoView: {
          promotions: [
            {
              name: payload[currentSlide].name,
              creative: payload[currentSlide].creativeContext,
              position: payload[currentSlide].slot,
            },
          ],
        },
      },
      eventCategory: 'Ecommerce',
      eventAction: 'Promotion View - Control',
      eventLable: 'Homebanner',
    })
  }

  const clickHandler = (url: string) => {
    // prettier-ignore
    window.dataLayer.push({
      'ecommerce': {
        'promoClick': {
          'promotions': [
            {
              'name': data[currentSlide].name,
              'creative': data[currentSlide].creativeContext,
              'position': data[currentSlide].slot,
            }
          ]
        }
      },
      'eventCategory': "Ecommerce",
      'eventAction': "PromotionClick - Control",
      'eventLabel': "HomepagePromoClick"
    });

    trackHomepageBannerClick({
      Name: data[currentSlide].name,
      Page_direction_URL: data[currentSlide].url,
      Creative_context: data[currentSlide].creativeContext,
    })

    if (url.includes('www.') || url.includes('http') || url.includes('ext.')) {
      window.location.href = url
    } else {
      router.push(url)
    }
  }

  const trackBannerPrevNextWrapper = (index: number) => {
    trackHomepageBannerPrevNextClick({
      Name: data[index].name,
      Page_direction_URL: data[index].url,
      Creative_context: data[index].creativeContext,
    })
  }

  const indicatorCSSProperties = (isSelected: boolean): CSSProperties => {
    return {
      background: isSelected ? colors.primaryLight1 : colors.line,
      width: 8,
      height: 8,
      display: 'inline-block',
      marginRight: 8,
      marginLeft: 8,
      padding: 0,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 10,
    }
  }

  const indicatorMobileCSSProperties = (isSelected: boolean): CSSProperties => {
    return {
      background: colors.white,
      opacity: isSelected ? '1' : '0.5',
      width: isSelected ? 6 : 4,
      height: isSelected ? 6 : 4,
      display: 'inline-block',
      marginRight: 4,
      marginLeft: 4,
      padding: 0,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 10,
      transition: 'all 150ms linear',
    }
  }
  const indicatorStyle = (
    onClickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
    isSelected: boolean,
    index: number,
    label: string,
  ) => {
    return (
      <li
        style={
          isMobileScreen
            ? indicatorMobileCSSProperties(isSelected)
            : indicatorCSSProperties(isSelected)
        }
        onClick={(e) => {
          trackBannerPrevNextWrapper(index)
          onClickHandler(e)
        }}
        onKeyDown={(e) => {
          trackBannerPrevNextWrapper(index)
          onClickHandler(e)
        }}
        value={index}
        key={index}
        role="button"
        tabIndex={isSelected ? 0 : undefined}
        title={`${label} ${index + 1}`}
        aria-label={`${label} ${index + 1}`}
      />
    )
  }

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index)
    }
  }

  const getImageSrc = (item: BannerHomepageType) => {
    if (isMobileScreen) {
      return item.attribute.web_mobile
    } else {
      return item.attribute.web_desktop
    }
  }

  return (
    <CarouselWrapper>
      <Carousel
        className="carousel-container"
        emulateTouch={true}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        autoPlay={true}
        swipeable={true}
        infiniteLoop={true}
        interval={8000}
        renderIndicator={indicatorStyle}
        stopOnHover={false}
        // transitionTime={2000}
        selectedItem={currentSlide}
        onChange={updateCurrentSlide}
      >
        {data.map((item, index) => {
          return (
            <div
              style={{ cursor: 'pointer' }}
              key={index}
              onClick={() => clickHandler(item.url)}
              id={`homepage-banner-${item.slot}`}
            >
              <StyledHeaderImg
                alt="carousel-image-banner-homepage"
                src={getImageSrc(item)}
                data-testid={elementId.Homepage.HomePageBanner + item.slot}
              />
            </div>
          )
        })}
      </Carousel>
      <>{children}</>
    </CarouselWrapper>
  )
}

const CarouselWrapper = styled.div`
  position: relative;
`

const widthScreen = client ? window.innerWidth : 0

const heightRatioMobile = (widthScreen / 4) * 3

const StyledHeaderImg = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 5/2;
  border-radius: 16px;
  background: ${colors.white};
  @media (max-width: 1024px) {
    aspect-ratio: unset;
    max-height: ${heightRatioMobile}px;
    border-radius: 0;
  }
`
