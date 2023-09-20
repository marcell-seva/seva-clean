import { Shimmer } from 'components/atoms/shimmerOld'
import { WebpPicture } from 'components/atoms/webpPicture'
import { useUtils } from 'services/context/utilsContext'
import { trackCarBodyTypeRecomItemClick } from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useCar } from 'services/context/carContext'
import { getNewFunnelAllRecommendations } from 'services/newFunnel'
import {
  getCarModelDetailsById,
  handleRecommendationsAndCarModelDetailsUpdate,
} from 'services/recommendations'
import styled from 'styled-components'
import { variantListUrl } from 'utils/helpers/routes'
import { transformToJtWithTargetTwoDecimal } from 'utils/numberUtils/numberUtils'
import { CarRecommendation } from 'utils/types'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'
import { isIphone } from 'utils/window'

interface CarTileProps {
  carModel: CarRecommendation
  bodyTypeSelected: string
}

export const CarTypeItem = ({ carModel, bodyTypeSelected }: CarTileProps) => {
  const router = useRouter()
  const { saveCarModelDetails, saveRecommendation } = useCar()
  const { currentLanguage } = useUtils()
  const onWrapperClick = () => {
    Promise.all([
      getNewFunnelAllRecommendations(),
      getCarModelDetailsById(carModel.id),
    ])
      .then(
        handleRecommendationsAndCarModelDetailsUpdate(
          saveRecommendation,
          saveCarModelDetails,
        ),
      )
      .then(() => {
        trackCarBodyTypeRecomItemClick({
          Car_Brand: carModel.brand,
          Car_Model: carModel.model,
          Car_Body_Type: bodyTypeSelected,
        })
        window.location.href = variantListUrl
          .replace(
            ':brand/:model',
            (carModel.brand + '/' + carModel.model.replace(/ +/g, '-'))
              .replace(/ +/g, '')
              .toLowerCase(),
          )
          .replace(':tab', '')
      })
  }

  const getSmallestInstallment = () => {
    return Math.min(...carModel.variants.map((item) => item.monthlyInstallment))
  }

  return (
    <a onClick={onWrapperClick}>
      <StyledCarCard>
        <WebpPicture
          src={carModel.image}
          fallbackImage={
            <CarImage
              src={carModel.image}
              alt={carModel.modelAndBrand}
              useIntersectionObserver={true}
              threshold={100}
              placeholder={<ShimmerBox height={132} />}
              width={'100%'}
            />
          }
        />
        {isIphone && window.innerWidth <= 480 ? (
          <StyledContentIos>
            <div>
              <TextCarBrandAndName>
                {carModel.brand + ' ' + carModel.model}
              </TextCarBrandAndName>
            </div>
            <StyledPriceWrapper>
              <TextInstallmentText>Cicilan mulai dari</TextInstallmentText>
              <TextInstallmentPrice>
                {transformToJtWithTargetTwoDecimal(
                  carModel.variants[carModel.variants.length - 1]
                    .monthlyInstallment,
                  currentLanguage,
                )}
              </TextInstallmentPrice>
            </StyledPriceWrapper>
          </StyledContentIos>
        ) : (
          <StyledContent>
            <>
              <TextCarBrandAndName>
                {carModel.brand + ' ' + carModel.model}
              </TextCarBrandAndName>
            </>
            <StyledPriceWrapper>
              <TextInstallmentText>Cicilan mulai dari</TextInstallmentText>
              <TextInstallmentPrice>
                {transformToJtWithTargetTwoDecimal(
                  getSmallestInstallment(),
                  currentLanguage,
                )}
              </TextInstallmentPrice>
            </StyledPriceWrapper>
          </StyledContent>
        )}
      </StyledCarCard>
    </a>
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

const StyledCarCard = styled.div`
  width: 140px;
  height: 210px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  cursor: pointer;

  @media (min-width: 1025px) {
    width: 264px;
    height: 352px;
  }
`
const StyledContent = styled.div`
  padding: 24px;
`
const StyledContentIos = styled.div`
  padding-left: 12px;
  padding-right: 12px;
`
const CarImage = styled(LazyLoadImage)`
  object-fit: cover;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  @media (min-width: 1025px) {
    aspect-ratio: 4 / 3;
  }
`
const TextCarBrandAndName = styled(TextLegalMedium)`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #404040;

  @media (min-width: 1025px) {
    font-family: var(--kanyon-bold);
    font-size: 20px;
    line-height: 24px;
  }
`
const TextInstallmentText = styled(TextLegalMedium)`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 10px;
  color: #404040;

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 20px;
  }
`

const TextInstallmentPrice = styled(TextLegalMedium)`
  font-family: var(--open-sans-semi-bold);
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin-top: 5px;
  color: #404040;

  @media (min-width: 1025px) {
    margin-top: 8px;
    font-weight: 600;
    font-size: 18px;
  }
`

const StyledPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;

  @media (min-width: 1025px) {
    bottom: 24px;
  }
`
