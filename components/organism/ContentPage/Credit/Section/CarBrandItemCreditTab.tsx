import { ToastType, useToast } from 'components/atoms/OldToast/Toast'
import { useContextCarModel } from 'context/carModelContext/carModelContext'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { useContextSpecialRateResults } from 'context/specialRateResultsContext/specialRateResultsContext'
import { useContextSurveyFormData } from 'context/surveyFormContext/surveyFormContext'
import {
  CarVariantCreditTabParam,
  trackCreditPeluangLainnyaClick,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
// import { LoanRankStatus } from 'pages/CarVariantListPage/CreditV2/LoanRankStatus/BadgeLoanStatus'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { variantListUrl } from 'routes/routes'
import { getNewFunnelAllRecommendations } from 'services/newFunnel'
import {
  getCarModelDetailsById,
  getCarVariantDetailsById,
  handleCarModelDetailsUpdate,
  handleRecommendationsAndCarModelDetailsUpdate,
} from 'services/recommendations'
import styled from 'styled-components'
import {
  getDpRange,
  getModelName,
  getModelPriceRange,
  getMonthlyInstallmentRange,
} from 'utils/carModelUtils/carModelUtils'
import { useCarResultParameter } from 'utils/hooks/useAmplitudePageView/useAmplitudePageView'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LanguageCode, LoanRank, LocalStorageKey } from 'utils/models/models'
import {
  replacePriceSeparatorByLocalization,
  transformToJtWithTargetTwoDecimal,
} from 'utils/numberUtils/numberUtils'
import { CarRecommendation } from 'utils/types'
import {
  CarVariantLoan,
  CityOtrOption,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { isIphone } from 'utils/window'
import { LoanRankStatus } from '../LoanRankStatus/BadgeLoanStatus'

const ShimmerLoader = '/v3/assets/illustration/placeholder.gif'

interface CarTileProps {
  carModel: CarRecommendation
  onClickNewModel?: (value: boolean) => void
  onReset?: (value: boolean) => void
}

export const CarBrandItemCreditTab = ({
  carModel,
  onClickNewModel,
  onReset,
}: CarTileProps) => {
  const router = useRouter()
  const { recommendations, setRecommendations } = useContextRecommendations()
  const { setCarModelDetails } = useContextCarModelDetails()
  const { setCarVariantDetails } = useContextCarVariantDetails()
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const { currentLanguage } = useCurrentLanguageFromContext()
  const carResultParameters = useCarResultParameter()
  const contextSurveyFormData = useContextSurveyFormData()
  const { setCarModel } = useContextCarModel()
  const { showToast, RenderToast } = useToast()
  const { t } = useTranslation()
  const [, setLoanDetails] = useLocalStorage<CarVariantLoan | null>(
    LocalStorageKey.SelectedLoan,
    null,
  )
  const [, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const onTrackCarPeluangKredit = () => {
    const trackProperties: CarVariantCreditTabParam = {
      Car_Brand: carModel.brand,
      Car_Model: carModel.model,
      Peluang_Kredit: carModel.loanRank === LoanRank.Green ? 'Mudah' : 'Sulit',
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carModel.lowestAssetPrice,
        LanguageCode.id,
      )}`,
      City: cityOtr?.cityName || 'null',
      DP: `Rp${replacePriceSeparatorByLocalization(
        carModel.variants[carModel.variants.length - 1].dpAmount,
        LanguageCode.id,
      )}`,
      Cicilan: `Rp${replacePriceSeparatorByLocalization(
        carModel.variants[carModel.variants.length - 1].monthlyInstallment,
        LanguageCode.id,
      )}`,
      Income: `Rp${replacePriceSeparatorByLocalization(
        contextSurveyFormData.totalIncome?.value as string,
        LanguageCode.id,
      )}`,
      Age: contextSurveyFormData.age?.value as string,
    }
    trackCreditPeluangLainnyaClick(trackProperties)
  }

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
        const variantId = carModel.variants.reduce((p: any, c: any) =>
          p.priceValue > c.priceValue ? p : c,
        ).id
        getCarVariantDetailsById(variantId).then((result3) => {
          if (result3.data.variantDetail.priceValue != null) {
            setCarVariantDetails(result3.data)
            onClickNewModel && onClickNewModel(false)
            onReset && onReset(false)
            setSpecialRateResults([])
            router.push(
              variantListUrl
                .replace(
                  ':brand/:model',
                  (carModel.brand + '/' + carModel.model.replace(/ +/g, '-'))
                    .replace(/ +/g, '')
                    .toLowerCase(),
                )
                .replace(':tab', 'kredit'),
            )
            window.location.reload()
          }
        })
      })
    onTrackCarPeluangKredit()
  }

  const handleCarTileClick = (carModel: CarRecommendation) => {
    setLoanDetails({
      modelId: carModel.id,
    })
    // pick the first variants
    // to fix issue on cars with only one variant
    if (carModel.variants[0]) {
      const variant = carModel.variants[0]
      const simpleCarVariantDetails: SimpleCarVariantDetail = {
        modelId: carModel.id,
        variantId: variant.id,
        loanTenure: variant.tenure,
        loanDownPayment: variant.dpAmount,
        loanMonthlyInstallment: variant.monthlyInstallment,
        loanRank: variant.loanRank,
      }
      setSimpleCarVariantDetails(simpleCarVariantDetails)
    }
    const selectCarResult = {
      carID: carModel.id,
      carName: getModelName(carModel),
      price: `${getModelPriceRange(carModel)} jt`,
      monthlyInstallments: `${getMonthlyInstallmentRange(
        carModel.variants,
        currentLanguage,
      )} jt`,
      downPayment: `${getDpRange(carModel.variants, currentLanguage)} jt`,
      ...carResultParameters,
    }
    localStorage.setItem('carDetail', selectCarResult.price)
    setCarModel(carModel || undefined)
    getCarModelDetailsById(carModel.id)
      .then(handleCarModelDetailsUpdate(recommendations, setCarModelDetails))
      .then(() => {
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
      .catch((error) => {
        console.error(error)
        showToast()
      })

    onTrackCarPeluangKredit()
  }
  const getSmallestInstallment = () => {
    return Math.min(...carModel.variants.map((item) => item.monthlyInstallment))
  }

  return (
    <div role="button" onClick={onWrapperClick}>
      <StyledCarCard>
        <ImageSection>
          <CarImage
            src={carModel.image}
            alt="car image"
            useIntersectionObserver={true}
            threshold={100}
            placeholder={<ShimmerBox height={132} />}
            width={'100%'}
          />

          <BadgeLoanStatusWrapper
            onClick={(e) => {
              // prevent navigate to variant list page
              e.stopPropagation()
            }}
          >
            <LoanRankStatus
              loanRank={carModel.loanRank}
              carName={carModel.brand + ' ' + carModel.model}
              onModelClick={() => handleCarTileClick(carModel)}
            />
          </BadgeLoanStatusWrapper>
        </ImageSection>
        {isIphone && window.innerWidth <= 480 ? (
          <StyledContentIos>
            <>
              <TextCarBrandAndName>
                {carModel.brand + ' ' + carModel.model}
              </TextCarBrandAndName>
            </>
            <StyledPriceWrapper
              style={{
                marginTop: 31,
              }}
            >
              <TextInstallmentText>Cicilan mulai dari</TextInstallmentText>
              <TextInstallmentPrice>
                {transformToJtWithTargetTwoDecimal(
                  carModel.variants[carModel.variants.length - 1]
                    .monthlyInstallment,
                  LanguageCode.en,
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
            <StyledPriceWrapper style={{ marginTop: 31 }}>
              <TextInstallmentText>Cicilan mulai dari</TextInstallmentText>
              <TextInstallmentPrice>
                {transformToJtWithTargetTwoDecimal(
                  getSmallestInstallment(),
                  LanguageCode.en,
                )}
              </TextInstallmentPrice>
            </StyledPriceWrapper>
          </StyledContent>
        )}
      </StyledCarCard>

      <RenderToast type={ToastType.Error} message={t('common.errorMessage')} />
    </div>
  )
}

const Shimmer = styled.div<{ radius?: number }>`
  background-image: url(${ShimmerLoader});
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

const StyledCarCard = styled.div`
  width: 137px;
  height: 231px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  cursor: pointer;

  @media (min-width: 1025px) {
    width: 264px;
    height: 355px;
  }
`
const StyledContent = styled.div`
  margin: 24px 24px 33px;

  @media (max-width: 1024px) {
    margin: 15px 13px 33px;
  }
`
const StyledContentIos = styled.div`
  margin: 24px 24px 33px;

  @media (max-width: 1024px) {
    margin: 15px 13px 33px;
  }
`
const CarImage = styled(LazyLoadImage)`
  object-fit: cover;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  aspect-ratio: 4 / 3;
`
const TextCarBrandAndName = styled.span`
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #404040;
  height: 35px;
  display: flex;

  @media (min-width: 1025px) {
    font-family: 'KanyonBold';
    font-size: 20px;
    line-height: 24px;
    height: auto;
  }
`
const TextInstallmentText = styled.span`
  letter-spacing: 0px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 10px;
  color: #404040;

  @media (min-width: 1025px) {
    font-size: 16px;
  }
`

const TextInstallmentPrice = styled.span`
  letter-spacing: 0px;
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin-top: 5px;
  color: #404040;

  @media (min-width: 1025px) {
    margin-top: 8px;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
  }
`

const StyledPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    display: flex;
    flex-direction: column;
    position: unset;
    padding-top: 15px;
  }
`

const BadgeLoanStatusWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
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
