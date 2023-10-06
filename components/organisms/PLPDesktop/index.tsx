import React, { useEffect, useRef, useState } from 'react'
import {
  CarRecommendation,
  CarRecommendationResponse,
  CarVariantLoan,
  CarResultIndexPage,
  SimpleCarVariantDetail,
  CityOtrOption,
  FooterSEOAttributes,
} from 'utils/types/utils'
import { hundred, itemLimit, million, ten } from 'utils/helpers/const'
import { AxiosResponse } from 'axios'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { CarModelTileV2 } from './CarModelTile/CarModelTileV2'
import { variantListUrl } from 'utils/helpers/routes'
import {
  getNewFunnelAllRecommendations,
  getNewFunnelRecommendations,
  getNewFunnelRecommendationsByQueries,
} from 'services/newFunnel'
import {
  getCarBrand,
  getDpRange,
  getMinimumDp,
  getMinimumMonthlyInstallment,
  getModelName,
  getModelPriceRange,
  getMonthlyInstallmentRange,
} from 'utils/carModelUtils/carModelUtils'
import { FreeInstallment } from './FreeInstallment/FreeInstallment'
import { Pagination } from './Pagination/Pagination'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { useMediaQuery } from 'react-responsive'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { trackPLPCarClick } from 'helpers/amplitude/seva20Tracking'
// import { useNewCitySelectoreModal } from 'pages/CitySelector/NewCitySelectorModal'
// import { PageHeaderSevaCarResults } from 'pages/component/PageHeaderSeva/PageHeaderSevaCarResults'
import { useModalContext } from 'services/context/modalContext'
import { CityDisclaimer } from './CityDisclaimer/CityDisclaimer'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { FilterParam } from 'utils/types/context'
import { DownPaymentType, LanguageCode, LocalStorageKey } from 'utils/enum'
import {
  useAmplitudePageView,
  useCarResultParameter,
} from 'utils/hooks/useAmplitudePageView'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { TextSmallRegular } from 'utils/typography/TextSmallRegular'

import { FooterSeva } from '../FooterSeva'
import { useToast } from '../Toast'
import FloatingIcon from 'components/molecules/FloatingIcon/FloatingIcon'
import { SeoParagraphSection } from '../SeoParagraphSection/SeoParagraphSection'
import { NewFilterSideMenu } from './Filter/FilterSideMenu/NewFilterSideMenu'
import { t } from 'config/localization/locales/id'
import {
  defaultCity,
  getCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import HeaderCarResult from 'components/molecules/header/headerCarResult'
import { PageHeaderSevaCarResults } from '../PageHeaderSeva/PageHeaderSevaCarResults'
import { setTrackEventMoEngage } from 'helpers/moengage'
import {
  trackSelectCarResult,
  trackViewCarResult,
} from 'helpers/amplitude/newFunnelEventTracking'
import { useCitySelectorModal } from 'components/molecules/citySelector/citySelectorModal'
import { useCar } from 'services/context/carContext'
import {
  getCarModelDetailsById,
  handleCarModelDetailsUpdate,
} from 'services/recommendations'
import { LoanRank, QueryKeys, ToastType } from 'utils/types/models'

interface CarResultPageProps {
  carRecommendation: CarRecommendationResponse
  footer: FooterSEOAttributes
}

export default function PLPDesktop({
  carRecommendation,
  footer,
}: CarResultPageProps) {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  if (isMobile) return <></>
  const router = useRouter()
  const { bodyType, brand, downPaymentAmount, monthlyInstallment } =
    router.query as FilterParam
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  let queryTemp = funnelQuery
  if (downPaymentAmount || monthlyInstallment) {
    queryTemp.downPaymentAmount = downPaymentAmount
    queryTemp.monthlyInstallment = monthlyInstallment
    queryTemp.downPaymentType = DownPaymentType.DownPaymentAmount
  }

  const [isShowLoading, setShowLoading] = useState(true)
  const { recommendation, saveRecommendation, saveCarModelDetails } = useCar()
  const [recommendationLists, setRecommendationLists] = useState<
    CarRecommendation[]
  >(carRecommendation.carRecommendations)
  const [searchInputValue, setSearchInputValue] = useState('')
  const { showToast, RenderToast } = useToast()
  const [, setLoanDetails] = useLocalStorage<CarVariantLoan | null>(
    LocalStorageKey.SelectedLoan,
    null,
  )
  const [, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [indexPage, setIndexPage] = useState<CarResultIndexPage>()
  const carResultParameters = useCarResultParameter()
  useAmplitudePageView(() => {
    trackViewCarResult(carResultParameters)
  })
  const { saveCarModel } = useCar()
  const [brandName, setBrandName] = useState<string | undefined>()
  const { showModal: showCitySelectorModal, CitySelectorModal } =
    useCitySelectorModal()

  const { modal, patchModal } = useModalContext()
  const [showModalTmp, setShowModal] = useState(false)
  const [showAnimate, setShowAnimate] = useState(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [isShowDisclaimer, setIsShowDisclaimer] = useState(false)
  const scrollToContent = useRef<null | HTMLDivElement>(null)
  const scrollToSectionContent = () => {
    scrollToContent.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
  const isCurrentCitySameWithSSR = getCity().cityCode === defaultCity.cityCode

  useEffect(() => {
    scrollToSectionContent()
    if (recommendationLists.length > 0) {
      const daihatsuCars = recommendationLists.filter(
        (item) => item.brand === 'Daihatsu',
      )
      if (daihatsuCars.length > 0) {
        setIsShowDisclaimer(true)
      } else {
        setIsShowDisclaimer(false)
      }
    } else {
      setIsShowDisclaimer(false)
    }
  }, [recommendationLists])

  const cityHandler = async () => {
    // prevent cannot scroll in revamp mobile
    if (!cityOtr && !isMobile) {
      showCitySelectorModal()
    }
  }

  useEffect(() => {
    const objData = {
      brand:
        funnelQuery.brand && funnelQuery.brand.length > 0
          ? funnelQuery.brand
          : '-',
      carbodytype:
        funnelQuery.bodyType && funnelQuery.bodyType.length > 0
          ? funnelQuery.bodyType
          : '-',
      city: cityOtr ? cityOtr.cityName : '-',
    }
    if (!isMobile) setTrackEventMoEngage('view_car_search', objData)
    cityHandler()
  }, [])

  const resetLoadingState = () => {
    setShowLoading(false)
  }

  const timeoutShimmer = () => {
    if (isShowLoading) {
      const timeout = setTimeout(() => {
        setShowLoading(false)
        clearTimeout(timeout)
      }, 550)
    }
  }

  const getAllRecommendations = () => {
    getNewFunnelAllRecommendations(undefined, '')
      .then((response: any) => {
        saveRecommendation(response.carRecommendations || [])
        timeoutShimmer()
        resetLoadingState()
      })
      .catch(() => {
        resetLoadingState()
        showToast()
      })
  }

  const getPeluangKredit = (carModel: CarRecommendation) => {
    if (funnelQuery.monthlyIncome && funnelQuery.age) {
      if (carModel.loanRank === LoanRank.Green) {
        return 'Mudah'
      } else if (carModel.loanRank === LoanRank.Red) {
        return 'Sulit'
      } else {
        return 'Null'
      }
    } else {
      return 'Null'
    }
  }

  const trackCarTileClick = (carModel: CarRecommendation) => {
    trackPLPCarClick({
      Car_Brand: carModel.brand,
      Car_Model: carModel.model,
      Peluang_Kredit: getPeluangKredit(carModel),
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carModel.lowestAssetPrice,
        LanguageCode.id,
      )}`,
      DP: `Rp${getMinimumDp(
        carModel.variants,
        LanguageCode.en,
        million,
        ten,
      )} Juta`,
      Tenure: `${funnelQuery.tenure || 5}`,
      Cicilan: `Rp${getMinimumMonthlyInstallment(
        carModel.variants,
        LanguageCode.en,
        million,
        hundred,
      )} jt/bln`,
      City: cityOtr?.cityName || 'Jakarta Pusat',
    })
  }

  const handleCarTileClick = (carModel: CarRecommendation, index: number) => {
    trackCarTileClick(carModel)
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
      index: index + 1,
      carID: carModel.id,
      carName: getModelName(carModel),
      price: `${getModelPriceRange(carModel)} jt`,
      monthlyInstallments: `${getMonthlyInstallmentRange(
        carModel.variants,
        LanguageCode.id,
      )} jt`,
      downPayment: `${getDpRange(carModel.variants, LanguageCode.id)} jt`,
      ...carResultParameters,
    }
    localStorage.setItem('carDetail', selectCarResult.price)
    saveCarModel(carModel || undefined)
    trackSelectCarResult(selectCarResult)
    getCarModelDetailsById(carModel.id)
      .then(handleCarModelDetailsUpdate(recommendation, saveCarModelDetails))
      .then(() => {
        window.location.href = variantListUrl
          .replace(
            ':brand/:model',
            (carModel.brand + '/' + carModel.model.replace(/ +/g, '-'))
              .replace(/ +/g, '')
              .toLowerCase(),
          )
          .replace(':tab', '')
          .replace('?', `?loanRankCVL=${carModel.loanRank}`)
      })
      .catch((error: any) => {
        console.error(error)
        showToast()
      })
  }

  const changePage = (page: number) => {
    const startIndex = page * itemLimit - itemLimit
    const endIndex = startIndex + itemLimit
    setIndexPage({ startIndex, endIndex })
  }

  useEffect(() => {
    if (bodyType || brand) {
      setShowLoading(true)
      getNewFunnelRecommendationsByQueries({
        [QueryKeys.CarBodyType]: bodyType?.split(','),
        [QueryKeys.CarBrand]: brand
          ?.split(',')
          .map((item) => getCarBrand(item)),
      })
        .then((response: any) => {
          saveRecommendation(response.carRecommendations || [])
          timeoutShimmer()
          resetLoadingState()
        })
        .catch(() => {
          resetLoadingState()
          showToast()
        })
    }

    if (
      funnelQuery.downPaymentAmount ||
      funnelQuery.monthlyInstallment ||
      (!!funnelQuery.brand && funnelQuery.brand.length > 0)
    ) {
      if (downPaymentAmount || monthlyInstallment) {
        patchFunnelQuery({
          downPaymentAmount: downPaymentAmount,
          downPaymentType: DownPaymentType.DownPaymentAmount,
          monthlyInstallment: monthlyInstallment,
        })
        getNewFunnelRecommendations(queryTemp).then((response) => {
          saveRecommendation(response.carRecommendations || [])
          timeoutShimmer()
        })
      }
    } else if (recommendation.length === 0 || !isCurrentCitySameWithSSR) {
      setShowLoading(true)
      getAllRecommendations()
    }

    if (funnelQuery.carModel) {
      setSearchInputValue(String(funnelQuery.carModel))
    }

    return () => {
      if (!isCurrentCitySameWithSSR) {
        saveRecommendation([])
      }
    }
  }, [])

  const getDataFunnel = () => {
    if (Array(funnelQuery.brand).length > 0) {
      const { brand, ...restParams } = funnelQuery
      const brandNames = Array(funnelQuery.brand).map((item) =>
        getCarBrand(item),
      )
      const queryParams = { ...restParams, brand: brandNames }
      return getNewFunnelRecommendations(queryParams).then((response) => {
        saveRecommendation(response.carRecommendations || [])
        timeoutShimmer()
      })
    }
    return getNewFunnelRecommendations(funnelQuery).then((response) => {
      saveRecommendation(response.carRecommendations || [])
      timeoutShimmer()
    })
  }

  useEffect(() => {
    if (brand) {
      if (!brand.includes('SEVA')) {
        setBrandName(getCarBrand(brand))
        const forFilterRecommendations = recommendation.map((item: any) => {
          item.brandAndModel = `${item.brand} ${item.model}`
          item.modelAndBrand = `${item.model} ${item.brand}`
          return item
        })
        const filterRecommendations = brand
          ? forFilterRecommendations.filter((item: { brandAndModel: any }) =>
              String(item.brandAndModel)
                .toLowerCase()
                .includes(brand.toLowerCase()),
            )
          : recommendation
        setRecommendationLists(filterRecommendations)
        timeoutShimmer()
      }
    } else {
      setRecommendationLists(recommendation)
      timeoutShimmer()
    }
  }, [recommendation])

  useEffect(() => {
    if (!isMobile) {
      if (funnelQuery.sortBy === undefined) {
        patchFunnelQuery({
          sortBy: 'highToLow',
        })
      }
      if (
        funnelQuery.carModel ||
        funnelQuery.downPaymentAmount ||
        funnelQuery.monthlyInstallment ||
        (!!funnelQuery.brand && funnelQuery.brand.length > 0)
      ) {
        setSearchInputValue(String(funnelQuery.carModel))
        getDataFunnel()
      }
    }
  }, [funnelQuery])

  const renderTitle = () => {
    if (brandName) {
      return t.CarResultPage.resultWithBrand({
        total: recommendationLists.length,
        brand: brandName,
      })
    } else {
      return t.CarResultPage.totalResult({
        total: recommendationLists.length,
      })
    }
  }

  const WebHeader = () => {
    return (
      <StyledWebHeader>
        <StyledFilter>
          {recommendationLists.length !== 0 && (
            <StyledTitleRegular>
              Menampilkan&nbsp;<StyledTitle>{renderTitle()}</StyledTitle>
              &nbsp;di SEVA.
            </StyledTitleRegular>
          )}
        </StyledFilter>
        {isShowDisclaimer && <CityDisclaimer />}
      </StyledWebHeader>
    )
  }

  // const SearchTopBar = () => (
  //   <StyledInputTopBar>{SearchBar()}</StyledInputTopBar>
  // )

  useEffect(() => {
    if (funnelQuery.brand) {
      if (funnelQuery.brand.length === 1) {
        setBrandName(funnelQuery.brand[0])
      } else {
        setBrandName('')
      }
    }
  }, [funnelQuery, modal])

  // TEMPORARY
  const enableFreeInstallmentBanner = false

  return (
    <>
      <StyledCarResultsPage scroll={!modal.isOpenCarFilter}>
        <PageHeaderSevaCarResults>
          <SearchWrapper>
            <HeaderCarResult />
          </SearchWrapper>
        </PageHeaderSevaCarResults>
        <FloatingIcon />
        <Content ref={scrollToContent}>
          <ResultAndFilterWrapper>
            <FilterSideMenuWrapper>
              <NewFilterSideMenu />
            </FilterSideMenuWrapper>
            {!modal.isOpenCarFilter && (
              <StyledFloatinFilterButton
                data-testid={elementId.CarResultPage.ButtonSearch}
                onClick={() => {
                  patchModal({ isOpenCarFilter: true })
                  setShowAnimate(!showAnimate)
                  setShowModal(!showModalTmp)
                }}
              >
                <StyledFloatingFilterText>
                  Atur Pencarian
                </StyledFloatingFilterText>
              </StyledFloatinFilterButton>
            )}
            <StyledContent>
              <StyledHeader>{WebHeader()}</StyledHeader>
              <StyledGrid>
                {recommendationLists.length !== 0 &&
                  recommendationLists
                    .slice(indexPage?.startIndex, indexPage?.endIndex)
                    .map((car, index) => {
                      if (index === 3 && enableFreeInstallmentBanner) {
                        return (
                          <>
                            <StyledCarModelTileV2
                              key={car.id}
                              carModel={car}
                              onModelClick={() =>
                                handleCarTileClick(car, index)
                              }
                            />
                            <StyledStretchColumn key={index + car.id}>
                              <FreeInstallment />
                            </StyledStretchColumn>
                          </>
                        )
                      }
                      return (
                        <StyledCarModelTileV2
                          key={car.id}
                          carModel={car}
                          onModelClick={() => handleCarTileClick(car, index)}
                        />
                      )
                    })}
              </StyledGrid>
              {!isShowLoading &&
                recommendationLists.length == 0 &&
                funnelQuery.bodyType?.length === 0 && (
                  <StyledNotFound>
                    <StyledNotFoundWrapper>
                      <StyledTextNotFound>
                        Mobil yang kamu cari belum tersedia di kotamu.
                      </StyledTextNotFound>
                    </StyledNotFoundWrapper>
                    <StyledNotFoundDesc>
                      Atur kembali filter pencarianmu.
                    </StyledNotFoundDesc>
                  </StyledNotFound>
                )}
              {!isShowLoading &&
                recommendationLists.length == 0 &&
                funnelQuery.bodyType &&
                funnelQuery.bodyType?.length > 0 && (
                  <StyledNotFound>
                    <StyledNotFoundWrapper>
                      <StyledTextNotFound>
                        Tipe mobil yang kamu cari belum tersedia di kotamu.
                      </StyledTextNotFound>
                    </StyledNotFoundWrapper>
                    <StyledNotFoundDesc>
                      Atur kembali filter pencarianmu.
                    </StyledNotFoundDesc>
                  </StyledNotFound>
                )}
              <Pagination
                length={recommendationLists.length}
                onChangePage={changePage}
                searchRender={searchInputValue}
              />
            </StyledContent>
          </ResultAndFilterWrapper>
          <SeoParagraphSection data={footer} />
          <FooterSeva />
        </Content>
      </StyledCarResultsPage>
      <RenderToast type={ToastType.Error} message={t.common.errorMessage} />
      <CitySelectorModal />
    </>
  )
}

const StyledCarResultsPage = styled.div<{ scroll: boolean }>`
  width: 100%;
  background: ${colors.offWhite};
  overflow-y: ${({ scroll }) => (scroll ? 'auto' : 'hidden')};
  position: ${({ scroll }) => (scroll ? 'relative' : 'fixed')};
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .item-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin: 0;
    list-style: none;
  }

  .liStyle {
    opacity: 0;
  }

  .liStyle::before {
    display: block;
    content: '';
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
  }
`

const StyledHeader = styled.div`
  padding: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1024px) {
    padding: 0;
    max-width: 480px;
  }
`

const ResultAndFilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1040px;
  margin-left: auto;
  margin-right: auto;
`

const StyledTextNotFound = styled.div`
  font-family: var(--kanyon-bold);
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0px;
  margin-left: 10px;
  padding-top: 3px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    font-size: 16px;
    margin-left: 5px;
    line-height: 18px;
  }
`

const FilterSideMenuWrapper = styled.div`
  margin-top: 0px;
  margin-top: 10px;
  border-right: 1px solid #e4e9f1;

  @media (max-width: 1024px) {
    display: none;
  }
`

const StyledMobileHeader = styled.div`
  @media (min-width: 1025px) {
    display: none;
  }
`

const StyledWebHeader = styled.div`
  padding: 44px 0px 32px;

  @media (max-width: 1024px) {
    display: none;
  }
`
const StyledTitleRegular = styled.h1`
  display: flex;
  align-items: baseline;
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #000000;

  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 16px;
    margin-left: 25px;
  }
`
const StyledTitle = styled.div`
  color: ${colors.title};
  font-family: var(--open-sans-bold);
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0px;

  @media (max-width: 1024px) {
    font-family: var(--open-sans-bold);
    font-size: 14px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0px;
  }
`

const StyledFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    margin-top: 14px;
  }
`

const StyledTotalCars = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`

const StyledContent = styled.div`
  padding: 0 0 0 24px;
  width: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 0;
  }
`

const StyledCarModelTileV2 = styled(CarModelTileV2)`
  @media (min-width: 1025px) {
    max-width: 360px;
  }
`

const duration = 1000 // ms
const delay = 500 // ms

const animStr = (i: any) =>
  `fadeIn ${duration}ms ease-out ${delay * (i + 1)}ms forwards`

const StyledGrid = styled.div`
  display: grid;
  column-gap: 24px;
  row-gap: 24px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 8px;
    row-gap: 8px;
  }
`

const StyledStretchColumn = styled.div`
  margin-bottom: 16px;

  @media (min-width: 1025px) {
    grid-column: 3 / 1;
  }
`

const StyledNotFoundWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const StyledNotFound = styled.div`
  color: ${colors.title};
  text-align: center;
  margin: 30% 30px 0;

  @media (max-width: 1024px) {
    margin: 16px 30px 0;
  }
`

const StyledNotFoundDesc = styled(TextSmallRegular)`
  font-family: var(--kanyon-medium);
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  color: #252525;

  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 16px;
  }
`

const StyledFloatinFilterButton = styled.div`
  display: none;

  @media (max-width: 1024px) {
    position: fixed;
    bottom: 40px;
    left: 0;
    right: 0;
    z-index: 9;
    width: 125px;
    height: 44px;
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    display: flex;
    background: #d83130;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
    border-radius: 14px;
  }
`

const StyledFloatingFilterText = styled(TextSmallRegular)`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 24px;
  color: #ffffff;
`

export const StyledSlideUpModal = styled.div<{ showPopup: boolean }>`
  width: 100%;
  height: 100%;
  display: ${({ showPopup }) => (showPopup ? 'flex' : 'none')};
  position: fixed;
  top: 0px;
  align-items: flex-end;
  justify-items: center;
  transition: opacity 0.5s;
  opacity: ${({ showPopup }) => (showPopup ? '1' : '0')};
  background: rgba(37, 37, 37, 0.93);
  margin: auto;
  z-index: 99;
  @media (max-height: 450px) {
    width: 50px;
    height: 569px;
  }

  .cssanimation,
  .cssanimation span {
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  .cssanimation span {
    display: inline-block;
  }

  .fadeInBottom {
    animation-name: fadeInBottom;
  }
  .fadeOutBottom {
    animation-name: fadeOutBottom;
  }
  @keyframes fadeInBottom {
    from {
      opacity: 1;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOutBottom {
    from {
      opacity: 1;
      transform: translateY(0%);
    }
    to {
      transform: translateY(50%);
      opacity: 0;
    }
  }
`

const StyledContentModal = styled.div`
  text-align: center;
  flex: 1;
  padding: 0 0 30px;
  display: flex;
  flex-direction: column;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background: ${colors.white};
  width: 100vw;
  @media (max-height: 480px) {
    padding: 10px 14px;
  }
`

const StyledCloseIcon = styled.div`
  display: flex;
  align-self: center;
  margin-top: 20px;
`

const SearchWrapper = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`
