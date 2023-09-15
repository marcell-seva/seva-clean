import React, { useState, KeyboardEvent, useCallback, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { colors } from 'styles/colors'
import { useTranslation } from 'react-i18next'
import { carResultsUrl, variantListUrl } from 'utils/helpers/routes'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import debounce from 'lodash.debounce'
import { trackSearchBarSuggestionClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { findAll } from 'highlight-words-core'
import { getCarsSearchBar } from 'services/searchbar'
import {
  useAmplitudePageView,
  useCarResultParameter,
} from 'utils/hooks/useAmplitudePageView'
import { Option } from 'utils/types'
import { useToast } from 'components/atoms/OldToast/Toast'
import { useRouter } from 'next/router'
import {
  trackSearchCarResults,
  trackViewCarResult,
} from 'helpers/amplitude/newFunnelEventTracking'
import { Loading } from 'components/atoms/loading'
import { SearchInput } from 'components/atoms/searchInput/oldSearchInput'
import { client } from 'utils/helpers/const'
import { FunnelQueryKey } from 'utils/types/models'

interface HeaderCarResultProps {
  overrideDisplay?: string
  isOnModal?: boolean
  closeModal?: (e: KeyboardEvent) => void
  suggestionListMobileWidth?: string
}
export default function HeaderCarResult({
  overrideDisplay = 'none',
  isOnModal = false,
  closeModal,
  suggestionListMobileWidth = '90%',
}: HeaderCarResultProps) {
  const carResultParameters = useCarResultParameter()
  useAmplitudePageView(() => {
    trackViewCarResult(carResultParameters)
  })
  const { t } = useTranslation()
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  if (client) {
    // @ts-ignore
    window.temp = ''
  }

  const [searchInputValue, setSearchInputValue] = useState('')
  const [suggestionsLists, setSuggestionsLists] = useState<Option<string>[]>([])
  const { showToast } = useToast()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [isShowLoading, setShowLoading] = useState(true)
  const currentURL = client ? window.location.href : ''
  const handleDebounceFn = (inputValue: string) => {
    getCarsSearchBar(inputValue)
      .then((response) => {
        const listedResult = response.map(
          (item: { value: string; label: string }) => {
            const splitValue = item.value.split(' ')
            const carBrand = splitValue[0]
            const carVariant = splitValue.slice(1).join('-')
            if (
              item.label === 'Toyota' ||
              item.label === 'Daihatsu' ||
              item.label === 'Isuzu' ||
              item.label === 'BMW' ||
              item.label === 'Peugeot'
            )
              return { value: '', label: item.label }

            return {
              value: `/${carBrand}/${carVariant}`
                .replace(/ +/g, '')
                .toLowerCase(),
              label: item.label,
            }
          },
        )

        setSuggestionsLists([...listedResult])
      })
      .catch(() => {
        showToast()
      })
      .finally(() => {
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

  const resetLoadingState = () => {
    setProgress(0)
    setShowLoading(false)
  }

  const clickList = (item: any) => {
    let urlDestination = ''
    if (item.value.length > 0) {
      urlDestination = variantListUrl
        .replace('/:brand/:model', item.value)
        .replace(':tab?', '')
    } else {
      patchFunnelQuery({
        [FunnelQueryKey.Brand]: [item.label],
      })
      urlDestination = carResultsUrl
    }

    const getOriginationUrl = () => {
      if (window.location.href.includes(carResultsUrl)) {
        return currentURL
          .replace('https://www.', '')
          .replace(window.location.pathname, urlDestination)
      } else {
        return window.location.href.replace('https://www.', '')
      }
    }
    router.push(urlDestination)
    trackSearchBarSuggestionClick({
      Page_Origination_URL: getOriginationUrl(),
      Page_Direction_URL: window.location.href.replace('https://www.', ''),
    })
    window.location.reload()
  }

  const clickEnter = (e: any) => {
    setSuggestionsLists([])
    e.Handled = true
    localStorage.setItem('searchEnter?', searchInputValue)
    if (e.key === 'Enter') {
      // @ts-ignore
      if (window.temp !== searchInputValue) {
        // @ts-ignore
        window.temp = searchInputValue
        patchFunnelQuery({
          [FunnelQueryKey.CarModel]: searchInputValue,
        })
        trackSearchCarResults({
          search: searchInputValue,
          ...carResultParameters,
        })
        if (isOnModal && closeModal) {
          closeModal(e)
        }
        trackSearchBarSuggestionClick({
          Page_Origination_URL: currentURL.replace('https://www.', ''),
          Page_Direction_URL:
            window.location.hostname.replace('www.', '') + carResultsUrl,
        })
      }
    }
  }

  const handleIconSearchClick = (value: string) => {
    patchFunnelQuery({
      [FunnelQueryKey.CarModel]: value,
    })
    trackSearchCarResults({
      search: searchInputValue,
      ...carResultParameters,
    })
    trackSearchBarSuggestionClick({
      Page_Origination_URL: currentURL.replace('https://www.', ''),
      Page_Direction_URL:
        window.location.hostname.replace('www.', '') + carResultsUrl,
    })
    setSuggestionsLists([])
  }

  useEffect(() => {
    if (funnelQuery.carModel !== undefined)
      setSearchInputValue(funnelQuery.carModel.toString())
  }, [funnelQuery])

  const renderSearchOptionsItem = (textToHighlight: string) => {
    const searchWords: string[] = []
    searchWords.push(searchInputValue)
    const chunks = findAll({
      caseSensitive: false,
      searchWords,
      textToHighlight,
    })

    const temp = chunks
      .map((chunk) => {
        const { end, highlight, start } = chunk
        const text = textToHighlight.substr(start, end - start)
        if (highlight) {
          return `<strong style="font-weight: 700;">${text}</strong>`
        } else {
          return text
        }
      })
      .join('')

    return temp
  }

  return (
    <>
      <StyledWrapper>
        <StyledContentWrapper>
          <StyledSearchWrapper overrideDisplay={overrideDisplay}>
            <InputWrapper>
              {isOnModal ? (
                <StyledSearchInput
                  onIconSearchClick={(value: string) =>
                    handleIconSearchClick(value)
                  }
                  data-testid={elementId.Homepage.SearchBar.InputSearchCar}
                  onSearchInputChange={onSearchInputChange}
                  searchInputValue={searchInputValue}
                  onKeyDown={(e) => clickEnter(e)}
                  placeholder={'Cari model mobil...'}
                  searchIconSuffix={true}
                />
              ) : (
                <StyledSearchInput
                  onIconSearchClick={(value: string) =>
                    handleIconSearchClick(value)
                  }
                  data-testid={elementId.Homepage.SearchBar.InputSearchCar}
                  onSearchInputChange={onSearchInputChange}
                  searchInputValue={searchInputValue}
                  onKeyDown={(e) => clickEnter(e)}
                  placeholder={'Cari model mobil...'}
                />
              )}
            </InputWrapper>
            {suggestionsLists.length !== 0 && searchInputValue.length > 0 && (
              <StyledDataResult
                suggestionListMobileWidth={suggestionListMobileWidth}
              >
                {suggestionsLists.map((car) => {
                  return (
                    <StyledLink
                      data-testid={
                        elementId.Homepage.SearchBar.CarModelOption +
                        car.label +
                        searchInputValue
                      }
                      onClick={() => clickList(car)}
                      key={car.value}
                      rel="noopener noreferrer"
                    >
                      {car.label && (
                        <StyledCarName
                          dangerouslySetInnerHTML={{
                            __html: renderSearchOptionsItem(car.label),
                          }}
                        />
                      )}
                    </StyledLink>
                  )
                })}
              </StyledDataResult>
            )}
            <Loading isShowLoading={isShowLoading} progress={progress} />
          </StyledSearchWrapper>
        </StyledContentWrapper>
      </StyledWrapper>
    </>
  )
}

export const GlobalStyle = createGlobalStyle`
  html body {
    margin: 0 auto;
    max-width: none;
  }
`
const StyledWrapper = styled.div`
  background: ${colors.white};
  width: 632px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
  }
`
const StyledContentWrapper = styled.div`
  display: flex;
  padding-left: 4vw;
  padding-right: 4vw;
  justify-content: center;
  @media (max-width: 1024px) {
    max-width: 100%;
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
`

const StyledDataResult = styled.div<{
  suggestionListMobileWidth: string
}>`
  margin-top: 7px;
  width: 632px;
  margin-left: 0vw;
  border-radius: 16px;
  height: auto;
  max-height: 200px;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  z-index: 99;
  :-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 1024px) {
    position: absolute;
    z-index: 99;
    width: ${({ suggestionListMobileWidth }) => suggestionListMobileWidth};
    margin-right: 17px;
    border-radius: 16px;
    /* margin-left: 16vw; */
    max-height: 210px;
    height: auto;
    background-color: white;
    box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    overflow-x: hidden;
    overflow-y: auto;
  }
`
export const StyledLink = styled.a`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  margin: 8px;
  :hover {
    border-radius: 8px;
    background-color: ${colors.primarySky};
  }
  @media (max-width: 1024px) {
    display: flex;
    height: auto;
    width: auto;
    align-items: flex-start;
    line-height: 22px;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 1vh;
    margin-top: 1vh;
    padding: 8px;
  }
`
export const StyledCarName = styled.div`
  margin-left: 1vw;
  text-align: start;
  @media (max-width: 1024px) {
    margin-left: 0;
    margin-right: 20px;
  }
`

const StyledSearchWrapper = styled.div<{ overrideDisplay: string }>`
  margin: 0;
  width: 632px;
  @media (max-width: 1024px) {
    position: relative;
    display: ${({ overrideDisplay }) => overrideDisplay};
    width: 100%;
  }
`

const InputWrapper = styled.div`
  width: 100%;
  @media (max-width: 1024px) {
    width: 100%;
  }
`

const StyledSearchInput = styled(SearchInput)`
  /* text-transform: capitalize; */
  padding: 0px 10px;
  padding-left: 20px;
  width: 100%;
`
