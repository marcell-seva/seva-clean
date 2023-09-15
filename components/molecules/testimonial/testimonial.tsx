import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel'

import { useMediaQuery } from 'react-responsive'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { encryptValue } from 'utils/encryptionUtils'
import { trackLPTestimonyNextPrevClick } from 'helpers/amplitude/seva20Tracking'
import debounce from 'lodash.debounce'
import { TestimonialData } from 'utils/types/utils'
import { getTestimonials } from 'services/testimonials'
import { LinkLabelLargeSemiBold } from 'components/atoms/typography/LinkLabelLargeSemiBold'
import { TestimoniTile } from './testimoniTile'
import { HomePageDataLocalContext } from 'pages'
import { LocalStorageKey } from 'utils/enum'
import Image from 'next/image'

const leftArrow = '/revamp/icon/arrowLeftSmall.webp'
const rightArrow = '/revamp/icon/arrowRightSmall.webp'

const Testimonial = () => {
  const { dataTestimony } = useContext(HomePageDataLocalContext)
  const isMobileSmall = useMediaQuery({ query: '(max-width: 390px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [toggle, setToggle] = useState(true)
  const [data, setData] = useState<Array<TestimonialData>>(dataTestimony)
  const [trackTotalViewed, setTrackTotalViewed] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)
  const constantDesktopSlideTrack = 3

  useEffect(() => {
    getTestimonials().then((res) => setData(res.data))
    getDataBaseConfig()

    if (!isMobile) setTrackTotalViewed(3)
  }, [])

  useEffect(() => {
    onChangeSlide(currentSlide)
  }, [currentSlide])

  const debounceFn = useCallback(
    debounce((viewed: number) => {
      trackLPTestimonyNextPrevClick({
        Numbers_of_Card_Viewed: viewed + '',
      })
      setTrackTotalViewed(viewed)
    }, 1000),
    [],
  )

  const onChangeSlide = (slide: number) => {
    if (Array.isArray(data)) {
      if (trackTotalViewed <= data.length) {
        const floorSlide = Math.floor(slide)

        const totalViewed = isMobile
          ? trackTotalViewed + 1
          : constantDesktopSlideTrack + floorSlide

        if (totalViewed > trackTotalViewed && totalViewed <= data.length) {
          debounceFn(totalViewed)
        }
      }
    }
  }

  const checkToogleData = (payload: any) => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
      setToggle(payload.attributes.enable_testimonial_dev)
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
      setToggle(payload.attributes.enable_testimonial_stg)
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
      setToggle(payload.attributes.enable_testimonial_prod)
    } else {
      setToggle(true)
    }
  }

  const getDataBaseConfig = async () => {
    await fetch('https://api.sslpots.com/api/base-conf', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((response: any) => {
        const dataBaseConf = response.data
        checkToogleData(dataBaseConf)
        saveLocalStorage(
          LocalStorageKey.baseConf,
          encryptValue(JSON.stringify(dataBaseConf)),
        )
      })
  }

  const getNaturalHeight = () => {
    if (isMobile || isMobileSmall) return 49
    else return 44
  }

  const getVisibleSlides = () => {
    if (isMobileSmall) return 1.2
    else if (isMobile) return 1.5
    else return 2.8
  }

  return (
    <div className="container-tm">
      {toggle && data && data.length > 0 && (
        <>
          <div className="wrapper-tm">
            {/* <StyledBgMask /> */}
            <div className="title-wrapper-tm">
              <LinkLabelLargeSemiBold className="h3medium-tmt">
                {'Cerita Pengguna SEVA'}
              </LinkLabelLargeSemiBold>
            </div>
          </div>

          <div className="content-wrapper-tm">
            <CarouselProvider
              naturalSlideWidth={40}
              naturalSlideHeight={getNaturalHeight()}
              totalSlides={Array.isArray(data) ? data.length : 0}
              visibleSlides={getVisibleSlides()}
              currentSlide={0}
            >
              <Slider>
                {Array.isArray(data) &&
                  data.map((item, index) => (
                    <Slide index={index} key={index}>
                      <TestimoniTile
                        item={item}
                        onCurrentSlide={(slide) => setCurrentSlide(slide)}
                      />
                    </Slide>
                  ))}
              </Slider>
              {Array.isArray(data) && data.length > 2 && (
                <>
                  <ButtonBack className="button-back-tm">
                    <Image
                      src={leftArrow}
                      className="left-button-tm"
                      alt="seva-right-arrow"
                      width="80"
                      height="80"
                    />
                  </ButtonBack>
                  <ButtonNext className="button-next-tm">
                    <Image
                      src={rightArrow}
                      className="right-button-tm"
                      alt="seva-right-arrow"
                      width="80"
                      height="80"
                    />
                  </ButtonNext>
                </>
              )}
            </CarouselProvider>
          </div>
        </>
      )}
    </div>
  )
}

export default Testimonial
