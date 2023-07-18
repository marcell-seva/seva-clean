import { AxiosResponse } from 'axios'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import React, { useEffect, useState } from 'react'
import { carResultsUrl } from 'routes/routes'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel'
import { useMediaQuery } from 'react-responsive'
import { DesktopShimmerCarBrand } from './DesktopShimmerCarBrand'
import { CarBrandItemCreditTab } from './CarBrandItemCreditTab'
import { useContextSurveyFormData } from 'context/surveyFormContext/surveyFormContext'
import { million } from 'const/const'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { CarRecommendation } from 'utils/types'
import { CarRecommendationResponse } from 'utils/types/context'

const LogoToyota = 'assets/icon/logo-toyota.webp'
const LogoDaihatsu = '/assets/icon/logo-daihatsu.webp'
const Isuzu = '/assets/icon/logo-isuzu.webp'
const LogoBmw = '/assets/icon/logo-bmw.webp'
const Peugeot = '/assets/icon/logo-peugeot.webp'
const ImageCarNotExist = '/assets/illustration/CarNotExistImg.webp'

export interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
  isChecked?: boolean
  hide?: boolean
}

interface CarBranchRecommendationProps {
  onHomepage?: boolean
  onClickNewModel?: (value: boolean) => void
  onReset?: (value: boolean) => void
}

export const CarBrandRecommendationCreditTab = ({
  onHomepage = true,
  onClickNewModel,
  onReset,
}: CarBranchRecommendationProps) => {
  const { clearFunnelQuery } = useFunnelQueryData()
  const [isCheckedGroups, setIsCheckedBrand] = useState('Toyota')
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [load, setLoad] = useState(false)
  const surveyFormData = useContextSurveyFormData()

  const [recommendationLists, setRecommendationLists] = useState<
    CarRecommendation[]
  >([])

  const [allRecommendationLists, setAllRecommendationLists] = useState<
    CarRecommendation[]
  >([])

  const carList: CarButtonProps[] = [
    {
      key: 'Toyota',
      icon: (
        <img
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
        <img
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
      icon: <img src={Isuzu} width={70} />,
      value: 'Isuzu',
      isChecked: isCheckedGroups.includes('Isuzu'),
      hide: true,
    },
    {
      key: 'BMW',
      icon: (
        <img
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
      icon: <img src={Peugeot} width={40} height={44} />,
      value: 'Peugeot',
      isChecked: isCheckedGroups.includes('Peugeot'),
      hide: true,
    },
  ]

  // const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    let monthlyIncome = '0'
    const totalIncome = surveyFormData.totalIncome?.value as number
    if (totalIncome >= 200 * million) {
      monthlyIncome = '>200M'
    } else if (totalIncome >= 150 * million && totalIncome < 200 * million) {
      monthlyIncome = '150M-200M'
    } else if (totalIncome >= 100 * million && totalIncome < 150 * million) {
      monthlyIncome = '100M-150M'
    } else if (totalIncome >= 75 * million && totalIncome < 100 * million) {
      monthlyIncome = '75M-100M'
    } else if (totalIncome >= 50 * million && totalIncome < 75 * million) {
      monthlyIncome = '50M-75M'
    } else if (totalIncome >= 20 * million && totalIncome < 50 * million) {
      monthlyIncome = '20M-50M'
    } else if (totalIncome >= 10 * million && totalIncome < 20 * million) {
      monthlyIncome = '10M-20M'
    } else if (totalIncome >= 8 * million && totalIncome < 10 * million) {
      monthlyIncome = '8M-10M'
    } else if (totalIncome >= 6 * million && totalIncome < 8 * million) {
      monthlyIncome = '6M-8M'
    } else if (totalIncome >= 4 * million && totalIncome < 6 * million) {
      monthlyIncome = '4M-6M'
    } else if (totalIncome >= 2 * million && totalIncome < 4 * million) {
      monthlyIncome = '2M-4M'
    } else if (totalIncome < 2 * million) {
      monthlyIncome = '<2M'
    }
    getNewFunnelRecommendations(
      { brand: [isCheckedGroups], monthlyIncome: monthlyIncome },
      false,
      false,
    )
      .then((response: AxiosResponse<CarRecommendationResponse>) => {
        handleSuccess(response)
      })
      .catch((e) => {
        handleError(e.response.status)
      })
  }, [isCheckedGroups, load])

  const handleSuccess = (
    response: AxiosResponse<CarRecommendationResponse>,
  ) => {
    const tmpData = response.data.carRecommendations.slice(0, 6) || []
    if (tmpData.length > 0) {
      if (tmpData.length < 5) {
        const tmpData2 = tmpData
        tmpData2.unshift(tmpData[tmpData.length - 1])
        setAllRecommendationLists(tmpData2)
        const data = tmpData2
          .filter((car: any) => car.loanRank === 'Green')
          .map((o) => o.id)
        setRecommendationLists(
          tmpData2
            .filter((car: any) => car.loanRank === 'Green')
            .filter(({ id }, index) => !data.includes(id, index + 1)),
        )
      } else {
        setAllRecommendationLists(tmpData)
        setRecommendationLists(
          tmpData.filter((car: any) => car.loanRank === 'Green'),
        )
      }
    } else {
      setRecommendationLists([])
      setAllRecommendationLists([])
    }
  }

  const goToCarResultNoFilter = () => {
    clearFunnelQuery()
  }

  const handleError = (errorCode: number) => {
    if (errorCode === 500) {
      setRecommendationLists([])
    }
  }

  const onClickCarBrand = (key: string) => {
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
          key={key}
          onClick={() => onClickCarBrand(key)}
          isChecked={isCheckedGroups.includes(key)}
        >
          <StyledIcon>{icon}</StyledIcon>
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

  return (
    <Container>
      <HeaderWrapper>
        {onHomepage ? (
          <HeaderText>Mobil Baru Terpopuler</HeaderText>
        ) : (
          <HeaderText>
            Pilihan Kredit {!isMobile ? 'Mobil' : 'Mudah'} Lainnya
          </HeaderText>
        )}
        {onHomepage ? (
          <HeaderTextSmall href={carResultsUrl} onClick={goToCarResultNoFilter}>
            LIHAT SEMUA
          </HeaderTextSmall>
        ) : (
          <></>
        )}
      </HeaderWrapper>

      <Content>
        <StyledCarButtons>{renderCarButton()}</StyledCarButtons>
        {load ? (
          renderShimmer()
        ) : (
          <ContentSlider>
            <StyledWrapper>
              {recommendationLists.length === 0 ? (
                allRecommendationLists.length === 0 ? (
                  <StyledContainerCarNotAvailable>
                    <StyledTextCarNotAvailableTitle>
                      Merk yang kamu pilih belum tersedia di kotamu.
                    </StyledTextCarNotAvailableTitle>
                    <StyledTextCarNotAvailableSubtitle>
                      Silakan pilih merk lain.
                    </StyledTextCarNotAvailableSubtitle>
                  </StyledContainerCarNotAvailable>
                ) : (
                  <StyledContainerCarNotAvailable>
                    <img src={ImageCarNotExist} />
                    <StyledTextCarNotAvailableSubtitle>
                      Sesuaikan nilai DP dan tenormu untuk melihat mobil{' '}
                      {isCheckedGroups} dengan peluang kredit yang mudah
                    </StyledTextCarNotAvailableSubtitle>
                  </StyledContainerCarNotAvailable>
                )
              ) : recommendationLists.length !== 0 && !isMobile ? (
                <StyledCarouselWrapper>
                  {recommendationLists
                    .sort(function (a, b) {
                      return a.lowestAssetPrice - b.lowestAssetPrice
                    })
                    .map((item: CarRecommendation, index) => {
                      return (
                        <CarBrandItemCreditTab
                          key={index}
                          onClickNewModel={onClickNewModel}
                          onReset={onReset}
                          carModel={item}
                        />
                      )
                    })}
                </StyledCarouselWrapper>
              ) : (
                <CarouselProvider
                  naturalSlideWidth={60}
                  naturalSlideHeight={140}
                  totalSlides={recommendationLists.length + 1}
                  visibleSlides={2.5}
                >
                  <Slider>
                    {recommendationLists
                      .sort(function (a, b) {
                        return a.lowestAssetPrice - b.lowestAssetPrice
                      })
                      .map((item: CarRecommendation, index) => {
                        return (
                          <Slide
                            style={{
                              width: 145,
                            }}
                            index={index}
                            key={item.id}
                          >
                            <CarBrandItemCreditTab
                              onClickNewModel={onClickNewModel}
                              onReset={onReset}
                              carModel={item}
                            />
                          </Slide>
                        )
                      })}
                  </Slider>
                </CarouselProvider>
              )}
            </StyledWrapper>
          </ContentSlider>
        )}
      </Content>
    </Container>
  )
}

const Container = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    gap: 18px;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 41px;
    padding: 0px 16px;
  }
`

const ContentSlider = styled.div`
  margin-bottom: 50px;
  flex: 1;

  @media (min-width: 1025px) {
    padding: 0;
    margin-bottom: 0;
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 16px;
`
const HeaderText = styled.span`
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #252525;

  @media (min-width: 1025px) {
    font-family: 'KanyonBold';
    font-style: normal;
    font-size: 20px;
    line-height: 28px;
  }
`
const HeaderTextSmall = styled.a`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0px;
  color: #246ed4;

  @media (min-width: 1025px) {
    font-family: 'KanyonBold';
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
  }
`

const StyledCarButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 8px;
  margin-right: 0;
  gap: 8px;
  margin-top: 5px;
  @media (max-width: 1024px) {
    margin-top: 0px;
    margin-top: 8px;
    padding: 0 16px;
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`

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
const StyledIcon = styled.div`
  /* margin: 20px 16px; */
`

const StyledWrapper = styled.div`
  height: 235px;
  margin-top: 8px;
  .horizontalSlider___281Ls {
    position: relative;
    overflow: hidden;
    background: transparent;
  }
  .carousel__inner-slide {
    width: 148px;
    height: 231px;
    left: 10px;
    top: 10px;
  }
  .carousel__slider-tray {
    margin-left: 8px;
  }

  @media (min-width: 1025px) {
    height: auto;
    margin-top: 0;
    .carousel__inner-slide {
      width: 288px;
      height: 352px;
      left: 5px;
      top: 0;
    }
  }
`

const StyledContainerCarNotAvailable = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  height: 100%;

  @media (min-width: 1025px) {
    height: 100vh;
    max-height: 366px;
  }
`
const StyledTextCarNotAvailableSubtitle = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${colors.greyscale};
  width: 30%;
  text-align: center;

  @media (max-width: 1024px) {
    width: 50%;
  }
`

const StyledTextCarNotAvailableTitle = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: ${colors.greyscale};

  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 28px;
  }
`
const StyledCarouselWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 2px 16px;
  gap: 16px;
  max-width: 900px;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    margin-top: 8px;
  }
`
