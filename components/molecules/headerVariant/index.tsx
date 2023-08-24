import { SearchInput } from 'components/atoms'
import { Loading } from 'components/atoms/loading'
import { trackSearchBarSuggestionClick } from 'helpers/amplitude/seva20Tracking'
import { findAll } from 'highlight-words-core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useMediaQuery } from 'react-responsive'
import { api } from 'services/api'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { getCarsSearchBar } from 'services/searchbar'
import styles from 'styles/components/molecules/headerSearch.module.scss'
import { LocalStorageKey } from 'utils/enum'
import { convertObjectQuery } from 'utils/handler/convertObjectQuery'
import { carResultsUrl, variantListUrl } from 'utils/helpers/routes'
import elementId from 'utils/helpers/trackerId'
import { Option } from 'utils/types'
import { COMData, FunnelQueryKey } from 'utils/types/models'
import { Line } from './Line'
import { useToast } from './Toast'
interface HeaderVariantProps {
  overrideDisplay?: string
  isOnModal?: boolean
  closeModal?: (e: KeyboardEvent) => void
  suggestionListMobileWidth?: string
  hideModal: () => void
}

const SEARCH_NOT_FOUND_TEXT = 'Mobil tidak ditemukan'

export default function HeaderVariant({
  overrideDisplay = 'none',
  isOnModal = false,
  closeModal,
  hideModal,
  suggestionListMobileWidth = '90%',
}: HeaderVariantProps) {
  const { patchFunnelQuery } = useFunnelQueryData()
  const [searchInputValue, setSearchInputValue] = useState('')
  const [suggestionsLists, setSuggestionsLists] = useState<Option<string>[]>([])
  const { showToast } = useToast()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [isShowLoading, setShowLoading] = useState(true)
  const currentURL = window.location.href

  const [comDataNew, setComDataNew] = useState<COMData[]>([])
  const [isError, setIsError] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [isNotFoundClicked, setIsNotFoundClicked] = useState(false)

  const handleDebounceFn = (inputValue: string) => {
    getCarsSearchBar(inputValue)
      .then((response) => {
        const listedResult = response.map(
          (item: { value: string; label: string }) => {
            const splitValue = item.label.split(' ')
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
        if (listedResult.length === 0) {
          listedResult.push({ value: '', label: SEARCH_NOT_FOUND_TEXT })
        }

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
    setIsNotFoundClicked(false)
  }

  const resetLoadingState = () => {
    setProgress(0)
    setShowLoading(false)
  }

  const clickList = (item: any) => {
    if (item.label === SEARCH_NOT_FOUND_TEXT) {
      return // Jangan lakukan apa pun jika opsi "Mobil tidak ditemukan" diklik
    }
    let urlDestination = ''
    if (item.value.length > 0) {
      urlDestination = variantListUrl
        .replace('/:brand/:model', item.value)
        .replace(':tab?', '')
    } else {
      patchFunnelQuery({
        [FunnelQueryKey.Brand]: [item.label],
      })
      const funnelQueryTemp = {
        brand: [item.label],
      }
      urlDestination = carResultsUrl + '?' + convertObjectQuery(funnelQueryTemp)
    }

    // simpan pencarian ke dalam local storage
    const searchHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]',
    )
    if (searchHistory.length >= 5) {
      searchHistory.pop() // hapus item terakhir
    }
    searchHistory.unshift(item)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

    hideModal()

    trackSearchBarSuggestionClick({
      Page_Origination_URL: window.location.href,
      Page_Direction_URL: window.location.origin + urlDestination,
    })
    router.push(urlDestination)
    // window.location.reload()
    setIsNotFoundClicked(false)
  }

  const removeUnnecessaryDataFilter = (): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      brand: [],
      bodyType: [],
      tenure: 5,
      downPaymentAmount: '',
      monthlyIncome: '',
      age: '',
      sortBy: 'highToLow',
      isDefaultTenureChanged: false,
    }

    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

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

  const carData = useMemo(() => {
    const data = comDataNew?.slice(0, 5).map((item) => ({
      name: `${item.brand} ${item.model?.carModel.model ?? ''}`,
      image: (item.model && item.model.carModel.imageUrls.main_color[0]) || '',
      link: `/${item.brand}/${item.model?.carModel.model
        .replace(/\s+/g, '-')
        .toLowerCase()}`,
    }))

    return data ?? []
  }, [comDataNew])

  useEffect(() => {
    api
      .getCarofTheMonth()
      .then((res) => {
        setComDataNew(res.data)
      })
      .catch(() => {
        setIsError(true)
      })
  }, [])

  if (isError) return null
  const renderRecommendation = () => {
    return (
      <ul>
        {carData.map((car) => (
          <div className={styles.styledCarContentName} key={car.name}>
            <a
              className={styles.styledCarName}
              href={`/mobil-baru${car.link.toLowerCase()}`}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px',
                }}
              >
                <img
                  src={car.image}
                  alt={car.name}
                  style={{
                    width: '70px',
                    height: '50px',
                    marginRight: '12px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    alignItems: 'left',
                  }}
                />
                <div className={styles.styledCarName}>{car.name}</div>
              </div>
              <Line width={'100%'} height={'1px'} background="#EBECEE" />
            </a>
          </div>
        ))}
      </ul>
    )
  }
  const onClickSearchHistory = (data: any) => {
    hideModal()
    if (data.value === '') {
      patchFunnelQuery({ brand: [data.label] })
      const funnelQueryTemp = {
        brand: data.label,
      }
      router.push({
        pathname: carResultsUrl,
        search: convertObjectQuery(funnelQueryTemp),
      })
    } else {
      router.push({
        pathname: carResultsUrl + data.value,
      })
    }
    // use location reload so that content re-fetched
    // window.location.reload()
  }

  type RenderedLabels = {
    [label: string]: boolean
  }

  const renderSearchHistory = () => {
    const searchHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]',
    )
    const renderedLabels: RenderedLabels = {}

    return (
      <ul>
        <h3 style={{ fontWeight: 'bold', marginBottom: '14px' }}>
          Riwayat pencarian
        </h3>
        {searchHistory.map((searchTerm: any) => {
          if (!renderedLabels[searchTerm.label]) {
            renderedLabels[searchTerm.label] = true
            return (
              <React.Fragment key={searchTerm.label}>
                <div
                  className={styles.styledCarContentName}
                  onClick={() => onClickSearchHistory(searchTerm)}
                >
                  <div className={styles.styledCarName}>
                    <a>{searchTerm.label}</a>
                  </div>
                  <Line width={'100%'} height={'1px'} background="#EBECEE" />
                </div>
              </React.Fragment>
            )
          }
          return null
        })}
      </ul>
    )
  }

  return (
    <>
      <div className={styles.styledWrapper}>
        <div className={styles.styledContentWrapper}>
          <div
            className={styles.styledSearchWrapper}
            style={{ display: isMobile ? overrideDisplay : 'static' }}
          >
            <div className={styles.inputWrapper}>
              {isOnModal ? (
                <SearchInput
                  data-testid={elementId.Homepage.SearchBar.InputSearchCar}
                  onSearchInputChange={onSearchInputChange}
                  searchInputValue={searchInputValue}
                  placeholder="Cari mobil impianmu"
                  enablePrefixIcon={false}
                  searchIconSuffix={true}
                  className={styles.styledSearchInput}
                />
              ) : (
                <SearchInput
                  data-testid={elementId.Homepage.SearchBar.InputSearchCar}
                  onSearchInputChange={onSearchInputChange}
                  searchInputValue={searchInputValue}
                  placeholder="Cari mobil impianmu"
                  className={styles.styledSearchInput}
                />
              )}
            </div>
            {suggestionsLists.length !== 0 && searchInputValue.length > 0 ? (
              <div className={styles.styledDataResult}>
                {suggestionsLists.map((car) => {
                  return (
                    <div
                      data-testid={
                        elementId.Homepage.SearchBar.CarModelOption +
                        car.label +
                        searchInputValue
                      }
                      onClick={() => clickList(car)}
                      key={car.value}
                      className={`${styles.styledLink} ${
                        suggestionsLists[0].label === SEARCH_NOT_FOUND_TEXT
                          ? styles.disableClick
                          : ''
                      }`}
                    >
                      {car.label && (
                        <div style={{ width: '100%' }}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: renderSearchOptionsItem(car.label),
                            }}
                            className={styles.styledCarName}
                          />
                          <Line
                            width={'100%'}
                            height={'1px'}
                            background="#EBECEE"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div
                className={styles.styledDataSuggest}
                style={{ width: isMobile ? suggestionListMobileWidth : '100%' }}
              >
                <div className={styles.styledItem}>
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    {renderSearchHistory()}
                    <h3
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '14px',
                        marginTop: '14px',
                      }}
                    >
                      Rekomendasi Mobil
                    </h3>
                    {renderRecommendation()}
                  </div>
                </div>
              </div>
            )}
            <Loading isShowLoading={isShowLoading} progress={progress} />
          </div>
        </div>
      </div>
    </>
  )
}
