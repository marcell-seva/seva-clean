import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import {
  loanCalculatorWithCityBrandModelVariantUrl,
  variantListUrl,
} from 'routes/routes'
import {
  getCarModelDetailsById,
  getCarVariantDetailsById,
  handleRecommendationsAndCarModelDetailsUpdate,
} from 'services/recommendations'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import DOMPurify from 'dompurify'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { useMediaQuery } from 'react-responsive'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { trackLoanCalcWidgetItemClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { CarSuggestions } from 'utils/types/utils'
import {
  getNewFunnelAllRecommendations,
  getSuggestionsCars,
} from 'services/newFunnel'
import { handleProgressUpdate } from 'utils/loadingUtils'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { SearchInputV2 } from '../searchInputV2'
import { Loading } from 'components/atoms/loading'

const BackgroundImageDesktop =
  '/assets/illustration/background-image-desktop.webp'

export const LoanCalculatorWidgetV2 = () => {
  const router = useRouter()
  const [searchInputValue, setSearchInputValue] = useState('')
  const [progress, setProgress] = useState(0)
  const { setRecommendations } = useContextRecommendations()
  const { setCarVariantDetails } = useContextCarVariantDetails()
  const { setCarModelDetails } = useContextCarModelDetails()
  const [suggestionsLists, setSuggestionsLists] = useState<CarSuggestions[]>([])
  const [isShowLoading, setShowLoading] = useState(true)
  const { currentLanguage } = useCurrentLanguageFromContext()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  const resetLoadingState = () => {
    setProgress(0)
    setShowLoading(false)
  }

  const handleDebounceFn = (inputValue: string) => {
    getSuggestionsCars(
      {
        onDownloadProgress: handleProgressUpdate(setProgress),
      },
      inputValue,
      'lowToHigh',
    )
      .then((response) => {
        setSuggestionsLists(response.data)
        resetLoadingState()
      })
      .catch(() => {
        resetLoadingState()
      })
  }

  const debounceFn = useCallback(debounce(handleDebounceFn, 500), [])

  const onSearchInputChange = (searchInputValueParam: string) => {
    setSearchInputValue(
      searchInputValueParam
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    )
    debounceFn(searchInputValueParam)
  }

  const handleNavigation = (
    id: string,
    brand: string,
    model: string,
    variant: string,
  ) => {
    if (isMobile) {
      const cityName =
        brand === 'Daihatsu'
          ? 'Jakarta Pusat'
          : getCity()?.cityName || 'Jakarta Pusat'
      const cityNameSlug = cityName.toLowerCase().trim().replace(/ +/g, '-')
      const brandSlug = brand.toLowerCase().trim().replace(/ +/g, '-')
      const modelSlug = model.toLowerCase().trim().replace(/ +/g, '-')
      const variantSlug = variant
        .toLowerCase()
        .trim()
        .replace(/ +/g, '-')
        .replace('/', '')

      router.push(
        loanCalculatorWithCityBrandModelVariantUrl
          .replace(':cityName', cityNameSlug)
          .replace(':brand', brandSlug)
          .replace(':model', modelSlug)
          .replace(':variant', variantSlug),
      )
    } else {
      router.push({
        pathname: variantListUrl
          .replace(':brand', brand.toLowerCase())
          .replace(':model', model.replace(/ +/g, '-').toLowerCase())
          .replace(':tab?', 'kredit'),
        query: { variant: id },
      })
    }
  }

  const onClickSuggestion = (id: string) => {
    getCarVariantDetailsById(id).then((response) => {
      setCarVariantDetails(response.data)
      const carVariantDetails = {
        brand: response.data.modelDetail.brand,
        model: response.data.modelDetail.model,
        variant: response.data.variantDetail.name,
      }
      Promise.all([
        getNewFunnelAllRecommendations(undefined, ''),
        getCarModelDetailsById(response.data.modelDetail.id),
      ])
        .then(
          handleRecommendationsAndCarModelDetailsUpdate(
            setRecommendations,
            setCarModelDetails,
          ),
        )
        .finally(() => {
          trackLoanCalcWidgetItemClick({
            Car_Brand: carVariantDetails.brand,
            Car_Model: carVariantDetails.model,
            Car_Variant: carVariantDetails.variant,
          })
          handleNavigation(
            id,
            carVariantDetails.brand,
            carVariantDetails.model,
            carVariantDetails.variant,
          )
        })
    })
  }

  return (
    <>
      <Container backgroundImage={BackgroundImageDesktop}>
        <div className="content-lcw">
          <span className="title-lcw">Yuk, coba hitung sekarang!</span>
          <span className="subtitle-lcw">
            Buat kamu yang serba #JelasDariAwal, langsung hitung cicilan buat
            mobil impianmu.
          </span>
          <div className="search-input-wrapper-lcw">
            <SearchInputV2
              name={elementId.InstantApproval.FindCreditCar}
              onSearchInputChange={onSearchInputChange}
              searchInputValue={searchInputValue}
              placeholder={'Cari model mobil yang mau dihitung'}
            />
            {suggestionsLists.length !== 0 && searchInputValue.length > 0 && (
              <div className="data-result-lcw">
                {suggestionsLists
                  .filter((a) => a.price_value !== null)
                  .map((car) => {
                    return (
                      <a
                        onClick={() => onClickSuggestion(String(car.id))}
                        key={car.id}
                        className="link-lcw loan-calc-widget-dropdown-item-element"
                      >
                        {car.variant_title && car.price_value && (
                          <>
                            <div
                              className="car-name-lcw"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  car.variant_title?.replace(
                                    searchInputValue,
                                    '<strong style="font-weight: 700;">' +
                                      searchInputValue +
                                      '</strong>',
                                  ),
                                ),
                              }}
                            />
                            <span className="car-price-lcw">{`Mulai dari Rp ${formatPriceNumberThousandDivisor(
                              car.price_value,
                              currentLanguage,
                            )}`}</span>
                          </>
                        )}
                      </a>
                    )
                  })}
              </div>
            )}
          </div>
          <span className="example-wording-lcw">Contoh: Fortuner</span>
        </div>
      </Container>
      <Loading isShowLoading={isShowLoading} progress={progress} />
    </>
  )
}

const Container = styled.div<{
  backgroundImage: string
}>`
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 24px;

  @media (min-width: 1025px) {
    max-width: 1040px;
    padding: 126px 80px 105px;
  }
`
