import { AxiosResponse } from 'axios'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { carResultsUrl } from 'utils/helpers/routes'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel'
import { useMediaQuery } from 'react-responsive'

import {
  trackCarBrandRecomItemSeeAllClick,
  trackCarBrandRecomLogoClick,
  trackCarBrandRecomSeeAllClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { CarRecommendation } from 'utils/types'
import { Isuzu } from 'components/atoms/icon/Isuzu'
import { Peugeot } from 'components/atoms/icon/Peugeot'
import { CarRecommendationResponse } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import { convertObjectQuery } from 'utils/handler/convertObjectQuery'
import { DesktopShimmerCarBrand } from 'components/organisms/ContentPage/Credit/Section/DesktopShimmerCarBrand'
import { ArrowRightNew } from 'components/atoms/icon/ArrowRightNew'
import { CarBrandItem } from './CarBrandItem'
import { client } from 'utils/helpers/const'
import { HomePageDataLocalContext } from 'pages'
import { useCar } from 'services/context/carContext'
import Image from 'next/image'

const LogoToyota = '/revamp/icon/logo-toyota-min.png'
const LogoDaihatsu = '/revamp/icon/logo-daihatsu-min.png'
const LogoBmw = '/revamp/icon/logo-bmw-min.png'
const leftArrow = '/revamp/illustration/buttonLeft.svg'
const rightArrow = '/revamp/illustration/buttonRight.svg'

export interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
  isChecked?: boolean
  hide?: boolean
}
interface CarBranchRecommendationProps {
  onHomepage?: boolean
}

export const CarBranchRecommendation = ({
  onHomepage = true,
}: CarBranchRecommendationProps) => {
  const router = useRouter()
  const { recommendationToyota } = useCar()
  const { patchFunnelQuery, clearQueryFilter: clearFunnelQuery } =
    useFunnelQueryData()
  const [isCheckedGroups, setIsCheckedBrand] = useState('Toyota')
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const isSmallMobile = useMediaQuery({ query: '(max-width: 380px)' })
  const [load, setLoad] = useState(false)

  const [recommendationLists, setRecommendationLists] =
    useState<CarRecommendation[]>(recommendationToyota)

  const carList: CarButtonProps[] = [
    {
      key: 'Toyota',
      icon: (
        <Image
          src={LogoToyota}
          alt="Toyota"
          style={{ width: isMobile ? 48 : 51, height: isMobile ? 41 : 44 }}
        />
      ),
      value: 'Toyota',
      isChecked: isCheckedGroups.includes('Toyota'),
    },
    {
      key: 'Daihatsu',
      icon: (
        <Image
          src={LogoDaihatsu}
          alt="Daihatsu"
          style={{ width: isMobile ? 48 : 64, height: isMobile ? 32.45 : 44 }}
        />
      ),
      value: 'Daihatsu',
      isChecked: isCheckedGroups.includes('Daihatsu'),
    },
    {
      key: 'Isuzu',
      icon: <Isuzu width={70} />,
      value: 'Isuzu',
      isChecked: isCheckedGroups.includes('Isuzu'),
      hide: true,
    },
    {
      key: 'BMW',
      icon: (
        <Image
          src={LogoBmw}
          alt="BMW"
          style={{ width: isMobile ? 40 : 44, height: isMobile ? 40 : 44 }}
        />
      ),
      value: 'BMW',
      isChecked: isCheckedGroups.includes('BMW'),
    },
    {
      key: 'Peugeot',
      icon: <Peugeot width={40} height={44} />,
      value: 'Peugeot',
      isChecked: isCheckedGroups.includes('Peugeot'),
      hide: true,
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    getNewFunnelRecommendations({ brand: [isCheckedGroups] }, false, false)
      .then((response) => {
        handleSuccess(response)
      })
      .catch((e) => {
        handleError(e.response.status)
      })
  }, [isCheckedGroups, load])

  const handleSuccess = (response: any) => {
    const tmpData = response.carRecommendations.slice(0, 6) || []
    if (tmpData.length > 0) {
      if (tmpData.length < 5) {
        const tmpData2 = tmpData
        tmpData2.unshift(tmpData[tmpData.length - 1])
        setRecommendationLists(tmpData2)
      } else {
        setRecommendationLists(tmpData)
      }
    } else {
      setRecommendationLists([])
    }
  }

  const removeUnnecessaryDataFilter = (): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      bodyType: [],
      carModel: '',
      tenure: 5,
      downPaymentAmount: '',
      sortBy: 'highToLow',
    }

    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const goToCarResultNoFilter = () => {
    trackCarBrandRecomSeeAllClick({ Car_Brand: isCheckedGroups })
    clearFunnelQuery()
  }

  const goToCarResult = () => {
    trackCarBrandRecomItemSeeAllClick({
      Car_Brand: isCheckedGroups,
    })
    removeUnnecessaryDataFilter()
    patchFunnelQuery({ brand: [isCheckedGroups] })
    const funnelQueryTemp = {
      brand: isCheckedGroups,
    }
    router.push({
      pathname: carResultsUrl,
      search: convertObjectQuery(funnelQueryTemp),
    })
  }

  const handleError = (errorCode: number) => {
    if (errorCode === 500) {
      setRecommendationLists([])
    }
  }

  const onClickCarBrand = (key: string) => {
    setCurrentSlide(0)
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
    }, 500)
    setIsCheckedBrand(key)
  }

  const renderCarButton = () => {
    return carList.map(({ key, icon }) => {
      //value
      return (
        <StyledCarButton
          data-testid={elementId.Homepage.TopNewCar + key}
          key={key}
          onClick={() => {
            onClickCarBrand(key)
            trackCarBrandRecomLogoClick({ Car_Brand: key })
          }}
          isChecked={isCheckedGroups.includes(key)}
        >
          <div>{icon}</div>
        </StyledCarButton>
      )
    })
  }

  const renderShimmer = () => {
    // if (isMobile) {
    //   return <MobileShimmerCarBrand />
    // } else {
    return <DesktopShimmerCarBrand />
    // }
  }

  const naturalSlideWidth = useMemo(() => {
    const innerWidth = client ? window.innerWidth : 0
    if (innerWidth <= 1024 && innerWidth >= 744) {
      return 100
    }
    return 60
  }, [client && window.innerWidth])

  const naturalSlideHeight = useMemo(() => {
    const innerWidth = client ? window.innerWidth : 0
    if (innerWidth <= 1024 && innerWidth >= 744) {
      return 130
    } else if (
      client &&
      window.innerWidth > 400 &&
      client &&
      window.innerHeight < 743
    ) {
      return 115
    } else if (
      client &&
      window.innerWidth == 414 &&
      client &&
      window.innerHeight == 896
    ) {
      return 110
    } else if (
      client &&
      window.innerWidth > 350 &&
      client &&
      window.innerWidth <= 400
    ) {
      return 105
    }

    return 140
  }, [client && window.innerWidth])

  const lastSlideStyle = useMemo(() => {
    const innerWidth = client ? window.innerWidth : 0
    if (innerWidth <= 400) {
      return {
        width: isSmallMobile ? '75px' : '140px',
        marginRight: '8px',
      }
    }

    return { width: '140px', marginRight: '8px' }
  }, [client && window.innerWidth, isSmallMobile])

  const slideStyle = useMemo(() => {
    const innerWidth = client ? window.innerWidth : 0
    if (innerWidth <= 400) {
      return { width: isSmallMobile ? '130px' : '140px', marginRight: '8px' }
    }

    return { width: '140px', marginRight: '8px' }
  }, [client && window.innerWidth, isSmallMobile])

  return (
    <div className="container-cbr">
      <div className="header-wrapper-cbr">
        {onHomepage ? (
          <h1 className="header-text-cbr">Mobil Baru Terpopuler</h1>
        ) : (
          <h1 className="header-text-cbr">Pilihan Kredit Mudah Lainnya</h1>
        )}
        {onHomepage ? (
          <a
            className="header-text-small-cbr"
            href={router.basePath + carResultsUrl}
            onClick={goToCarResultNoFilter}
          >
            LIHAT SEMUA
          </a>
        ) : (
          <></>
        )}
      </div>

      <div className="content-cbr">
        <div role="button" className="car-buttons-cbr">
          {renderCarButton()}
        </div>
        {load ? (
          renderShimmer()
        ) : (
          <div className="content-slider-cbr">
            <div className="wrapper-cbr">
              {recommendationLists.length === 0 ? (
                <div className="container-car-not-available-cbr">
                  <span className="text-car-not-available-title-cbr">
                    Merk yang kamu pilih belum tersedia di kotamu.
                  </span>
                  <span className="text-car-not-available-subtitle-cbr">
                    Silakan pilih merk lain.
                  </span>
                </div>
              ) : client &&
                window.innerWidth > 1024 &&
                recommendationLists.length !== 0 ? (
                <CarouselProvider
                  naturalSlideWidth={12}
                  naturalSlideHeight={14.5} //ratio of 288x264
                  totalSlides={recommendationLists.length}
                  visibleSlides={3}
                >
                  <Slider>
                    {recommendationLists
                      .sort(function (a, b) {
                        return a.lowestAssetPrice - b.lowestAssetPrice
                      })
                      .map((item: CarRecommendation, index) => {
                        if (index === recommendationLists.length - 1) {
                          return (
                            <Slide
                              style={{ width: '288px' }}
                              index={index}
                              key={item.id}
                            >
                              <div className="car-last-card-cbr">
                                <div
                                  className="last-card-content-cbr"
                                  onClick={goToCarResult}
                                >
                                  <ArrowRightNew />
                                  <div className="space-arrow-right-new-cbr">
                                    <div className="text-last-card-cbr">
                                      Lihat semua
                                    </div>
                                    <div className="text-last-card-cbr">
                                      mobil {isCheckedGroups}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Slide>
                          )
                        }
                        return (
                          <Slide
                            style={{ width: '264px', marginRight: '16px' }}
                            index={index}
                            key={item.id}
                          >
                            <CarBrandItem carModel={item} />
                          </Slide>
                        )
                      })}
                  </Slider>
                  {recommendationLists.length > 3 && (
                    <>
                      <StyledButtonBack>
                        <Image
                          src={leftArrow}
                          className="left-button-arrow-cbr"
                          alt="seva-left-arrow-icon"
                          width="80"
                          height="80"
                        />
                      </StyledButtonBack>
                      <StyledButtonNext>
                        <Image
                          src={rightArrow}
                          className="right-button-arrow-cbr"
                          alt="seva-right-arrow-icon"
                          width="80"
                          height="80"
                        />
                      </StyledButtonNext>
                    </>
                  )}
                </CarouselProvider>
              ) : (
                <CarouselProvider
                  naturalSlideWidth={naturalSlideWidth}
                  naturalSlideHeight={naturalSlideHeight}
                  totalSlides={recommendationLists.length}
                  visibleSlides={2.5}
                  currentSlide={currentSlide || undefined}
                >
                  <Slider>
                    {recommendationLists
                      .sort(function (a, b) {
                        return a.lowestAssetPrice - b.lowestAssetPrice
                      })
                      .map((item: CarRecommendation, index) => {
                        if (index === recommendationLists.length - 1) {
                          return (
                            <Slide
                              style={lastSlideStyle}
                              index={index}
                              key={item.id}
                            >
                              <div
                                className="car-last-card-cbr"
                                onClick={goToCarResult}
                              >
                                <ArrowRightNew />
                                <div className="space-arrow-right-new-cbr">
                                  <div className="text-last-card-cbr">
                                    Lihat semua
                                  </div>
                                  <div className="text-last-card-cbr">
                                    mobil {isCheckedGroups}
                                  </div>
                                </div>
                              </div>
                            </Slide>
                          )
                        }
                        return (
                          <Slide style={slideStyle} index={index} key={item.id}>
                            <CarBrandItem carModel={item} />
                          </Slide>
                        )
                      })}
                  </Slider>
                </CarouselProvider>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StyledCarButton = styled.div<{ isChecked: boolean }>`
  @media (min-width: 1025px) {
    width: 90px;
    margin-right: 0px;
  }

  min-width: 90px;
  height: 64px;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ isChecked }) =>
    isChecked
      ? css`
          border: 1px solid ${colors.primary1};
        `
      : css`
          background: ${colors.white};
          border: 1px solid ${colors.line};
        `}
`

const StyledButtonNext = styled(ButtonNext)`
  position: absolute;
  top: 80px;
  right: -45px;
  z-index: 2;
  border: none;

  @media (max-width: 1024px) {
    display: none;
  }
`
const StyledButtonBack = styled(ButtonBack)`
  position: absolute;
  top: 80px;
  left: -35px;
  z-index: 2;
  border: none;
  @media (max-width: 1024px) {
    display: none;
  }
`
