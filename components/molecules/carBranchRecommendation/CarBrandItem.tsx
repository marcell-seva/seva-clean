import { Shimmer } from 'components/atoms/shimmerOld'
import { WebpPicture } from 'components/atoms/webpPicture'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import {
  trackCarBodyTypeRecomItemClick,
  trackCarBrandRecomItemClick,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { variantListUrl } from 'const/routes'
import { getNewFunnelAllRecommendations } from 'services/newFunnel'
import {
  getCarModelDetailsById,
  handleRecommendationsAndCarModelDetailsUpdate,
} from 'services/recommendations'
import styled from 'styled-components'
import { transformToJtWithTargetTwoDecimal } from 'utils/numberUtils/numberUtils'
import { CarRecommendation } from 'utils/types'
import { isIphone } from 'utils/window'

interface CarTileProps {
  carModel: CarRecommendation
  bodyTypeSelected?: string
}

export const CarBrandItem = ({
  carModel,
  bodyTypeSelected = '',
}: CarTileProps) => {
  const router = useRouter()
  const { setRecommendations } = useContextRecommendations()
  const { setCarModelDetails } = useContextCarModelDetails()
  const { currentLanguage } = useCurrentLanguageFromContext()
  const onWrapperClick = () => {
    Promise.all([
      getNewFunnelAllRecommendations(),
      getCarModelDetailsById(carModel.id),
    ])
      .then(
        handleRecommendationsAndCarModelDetailsUpdate(
          setRecommendations,
          setCarModelDetails,
        ),
      )
      .then(() => {
        if (bodyTypeSelected.length > 0) {
          trackCarBodyTypeRecomItemClick({
            Car_Brand: carModel.brand,
            Car_Model: carModel.model,
            Car_Body_Type: bodyTypeSelected,
          })
        } else {
          trackCarBrandRecomItemClick({
            Car_Brand: carModel.brand,
            Car_Model: carModel.model,
          })
        }
        router.push(
          variantListUrl
            .replace(
              ':brand/:model',
              (carModel.brand + '/' + carModel.model.replace(/ +/g, '-'))
                .replace(/ +/g, '')
                .toLowerCase(),
            )
            .replace(':tab', ''),
        )
      })
  }

  const getSmallestInstallment = () => {
    return Math.min(
      ...carModel.variants.map((item: any) => item.monthlyInstallment),
    )
  }

  return (
    <div
      role="button"
      className="card-wrapper-cbi"
      onClick={() => onWrapperClick()}
    >
      <div className="car-card-cbi">
        <WebpPicture
          src={carModel.image}
          fallbackImage={
            <CarImage
              src={carModel.image}
              alt="seva-car-image"
              useIntersectionObserver={true}
              threshold={100}
              placeholder={<ShimmerBox height={132} />}
              width={'100%'}
            />
          }
        />
        {isIphone && window.innerWidth <= 480 ? (
          <div className="content-ios-cbi">
            <div className="text-brand-and-name-cbi">
              {carModel.brand + ' ' + carModel.model}
            </div>
            <div className="price-wrapper-cbi">
              <span className="text-installment-text-cbi">
                Cicilan mulai dari
              </span>
              <div className="text-installment-price-cbi">
                {transformToJtWithTargetTwoDecimal(
                  carModel.variants[carModel.variants.length - 1]
                    .monthlyInstallment,
                  currentLanguage,
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="content-cbi">
            <div className="text-brand-and-name-cbi">
              {carModel.brand + ' ' + carModel.model}
            </div>
            <div className="price-wrapper-cbi">
              <span className="text-installment-text-cbi">
                Cicilan mulai dari
              </span>
              <div className="text-installment-price-cbi">
                {transformToJtWithTargetTwoDecimal(
                  getSmallestInstallment(),
                  currentLanguage,
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ShimmerBox = styled(Shimmer)<{
  width?: string
  height: number
  marginBottom?: number
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width};
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
const CarImage = styled(LazyLoadImage)`
  object-fit: cover;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  aspect-ratio: 4 / 3;
`
