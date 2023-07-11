import { AxiosResponse } from 'axios'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from 'pure-react-carousel'
import React, { useEffect, useState } from 'react'
import { carResultsUrl } from 'routes/routes'

import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'

import {
  trackCarBodyTypeRecomItemSeeAllClick,
  trackCarBodyTypeRecomLogoClick,
  trackCarBodyTypeRecomSeeAllClick,
} from 'helpers/amplitude/seva20Tracking'

import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { CarRecommendation } from 'utils/types'
import {
  getCarBodyTypes,
  getNewFunnelRecommendations,
} from 'services/newFunnel'
import { CarRecommendationResponse } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import { convertObjectQuery } from 'utils/handler/convertObjectQuery'
import { ArrowRightNew } from 'components/atoms/icon/ArrowRightNew'
import { CarTypeItem } from './carTypeItem'
import { CarButtonProps } from 'utils/types/context'
import { newBodyTypes } from './carBodyTypes'

const leftArrow = '/v3/assets/icon/arrowLeftSmall.svg'
const rightArrow = '/v3/assets/icon/arrowRightSmall.svg'

interface BodyTypes {
  body_type: string
  data_count: number
}

export const CarBodyTypesDesktop = () => {
  const [bodyTypesList, setBodyTypes] = useState<BodyTypes[]>([])
  const router = useRouter()
  const [bodyTypeSelected, setBodyTypeSelected] = useState('MPV')
  const [recommendationLists, setRecommendationLists] = useState<
    CarRecommendation[]
  >([])
  const { patchFunnelQuery, clearFunnelQuery } = useFunnelQueryData()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (bodyTypesList.length === 0) {
      getCarBodyTypes().then((res) => {
        setBodyTypes(res.data)
      })
    }
    getNewFunnelRecommendations({ bodyType: [bodyTypeSelected] }).then(
      (response: AxiosResponse<CarRecommendationResponse>) => {
        const tmpData = response.data.carRecommendations.slice(0, 6) || []
        if (tmpData.length !== 0) {
          if (tmpData.length < 5) {
            const tmpData2 = tmpData
            tmpData2.unshift(tmpData[tmpData.length - 1])
            setRecommendationLists(tmpData2)
          } else {
            setRecommendationLists(tmpData)
          }
        }
      },
    )
  }, [bodyTypeSelected])
  const onSelect = (bodyType: string) => {
    setLoading(true)
    setBodyTypeSelected(bodyType)
    setRecommendationLists([])
    getNewFunnelRecommendations({ bodyType: [bodyType] })
      .then((response: AxiosResponse<CarRecommendationResponse>) => {
        const tmpData = response.data.carRecommendations.slice(0, 6) || []
        if (tmpData.length !== 0) {
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
        setLoading(false)
      })
      .catch((error: any) => {
        setLoading(false)
        setRecommendationLists([])
      })
  }

  const removeUnnecessaryDataFilter = (): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      brand: [],
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
    trackCarBodyTypeRecomSeeAllClick({ Car_Body_Type: bodyTypeSelected })
    clearFunnelQuery()
    // history.push(carResultsUrl)
  }
  const goToCarResult = () => {
    removeUnnecessaryDataFilter()
    trackCarBodyTypeRecomItemSeeAllClick({ Car_Body_Type: bodyTypeSelected })
    patchFunnelQuery({ bodyType: [bodyTypeSelected] })
    const funnelQueryTemp = {
      bodyType: [bodyTypeSelected],
    }
    router.push({
      pathname: carResultsUrl,
      search: convertObjectQuery(funnelQueryTemp),
    })
  }
  const renderCarBodyTypes = () => {
    return bodyTypesList.map((body: BodyTypes, index) => {
      //value
      return (
        <BodyTypesItem
          data-testid={elementId.Homepage.TypeNewCar + body.body_type}
          key={index}
          isChecked={body.body_type === bodyTypeSelected}
          onClick={() => {
            onSelect(body.body_type)
            trackCarBodyTypeRecomLogoClick({ Car_Body_Type: body.body_type })
          }}
        >
          {
            newBodyTypes.filter((type: CarButtonProps) =>
              type.value.includes(body.body_type),
            )[0].icon
          }
          <span className="text-car-type-cbtd">
            {body.body_type} ({body.data_count})
          </span>
        </BodyTypesItem>
      )
    })
  }
  return (
    <>
      <div className="container-content-cbtd">
        <div className="container-cbtd">
          <div className="header-container-cbtd">
            <div className="car-types-option-cbtd">
              <h2 className="text-header-cbtd">Tipe Mobil Baru</h2>
              <a
                className="header-text-small-cbtd"
                href={router.basePath + carResultsUrl}
                onClick={goToCarResultNoFilter}
              >
                LIHAT SEMUA
              </a>
            </div>
            <div className="body-types-wrapper-cbtd">
              {renderCarBodyTypes()}
            </div>
          </div>
        </div>
        <div className="container-slider-cbt">
          <div className="car-types-wrapper-cbtd">
            {recommendationLists.length !== 0 ? (
              <CarouselProvider
                naturalSlideWidth={60}
                naturalSlideHeight={105}
                totalSlides={recommendationLists.length}
                visibleSlides={3.6}
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
                            style={{ width: '181px', marginRight: '16px' }}
                            index={index}
                            key={item.model}
                          >
                            <div
                              className="car-last-card-cbtd"
                              onClick={goToCarResult}
                            >
                              <ArrowRightNew />
                              <div className="space-arrow-right-new-cbtd">
                                <span className="text-car-last-card-cbtd">
                                  Lihat semua
                                </span>
                                <span className="text-car-last-card-cbtd">
                                  mobil {bodyTypeSelected}
                                </span>
                              </div>
                            </div>
                          </Slide>
                        )
                      }
                      return (
                        <Slide
                          style={{ width: '264px', marginRight: '16px' }}
                          index={index}
                          key={item.model}
                        >
                          <CarTypeItem
                            carModel={item}
                            bodyTypeSelected={bodyTypeSelected}
                          />
                        </Slide>
                      )
                    })}
                </Slider>
                {Array.isArray(recommendationLists) &&
                  recommendationLists.length > 3 && (
                    <>
                      <ButtonBack className="button-back-cbtd">
                        <img
                          className="left-button-cbtd"
                          src={leftArrow}
                          alt="seva-left-arrow"
                          width="80"
                          height="80"
                        />
                      </ButtonBack>
                      <ButtonNext className="button-next-cbtd">
                        <img
                          className="right-button-cbtd"
                          src={rightArrow}
                          alt="seva-right-arrow"
                          width="80"
                          height="80"
                        />
                      </ButtonNext>
                    </>
                  )}
              </CarouselProvider>
            ) : (
              recommendationLists.length === 0 &&
              !loading && (
                <div className="container-no-car-available-cbtd">
                  <div className="container-car-not-available-cbtd">
                    <span className="text-car-not-available-title-cbtd">
                      Tipe mobil yang kamu pilih belum tersedia di kotamu.
                    </span>
                    <span className="text-car-not-available-subtitle-cbtd">
                      Silakan pilih tipe mobil lain.
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const BodyTypesItem = styled.div<{ isChecked: boolean }>`
  display: flex;
  height: 32px;
  align-items: center;
  justify-content: center;
  width: auto;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 4px;
  margin-right: 16px;
  padding: 0px 19px;
  ${({ isChecked }) =>
    isChecked
      ? css`
          border: 1px solid #246ed4;
        `
      : css`
          background: ${colors.white};
          border: 1px solid ${colors.line};
        `}
`
