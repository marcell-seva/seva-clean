import { Collapse } from 'antd'
import styles from 'styles/components/organisms/searchComponent.module.scss'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  OTONewCarUrl,
  OTOVariantListUrl,
  carResultsUrl,
  usedCarDetailUrl,
  usedCarResultUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import debounce from 'lodash.debounce'
import clsx from 'clsx'
import Image from 'next/image'
import {
  CloseOutlined2,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  SearchInputSecondary,
} from 'components/atoms'
import dynamic from 'next/dynamic'
import { getCity } from 'utils/hooks/useGetCity'
import {
  getCarofTheMonth,
  getNewCarSearch,
  getSearchDataQuery,
  getUsedCarSearch,
} from 'services/api'
import { Option } from 'utils/types'
import { useToast } from 'components/organisms/Toast'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { COMData, FunnelQueryKey } from 'utils/types/models'
import { Line } from 'components/atoms/Line'
import { Swiper, SwiperSlide } from 'swiper/react'
import { removeCarBrand } from 'utils/handler/removeCarBrand'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import {
  PreviousButton,
  navigateToPLP,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'
import { convertObjectQuery } from 'utils/handler/convertObjectQuery'
import elementId from 'utils/helpers/trackerId'
import { findAll } from 'highlight-words-core'
import { SearchInput } from 'components/atoms'
import { SearchNewCar, SearchUsedCar } from 'utils/types/utils'
import { UsedCarDetailCard } from 'components/organisms'
import urls from 'utils/helpers/url'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import { filterSpecialChar } from 'utils/stringUtils'
import getCurrentEnvironment from 'utils/handler/getCurrentEnvironment'
import { useUtils } from 'services/context/utilsContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'

const CarNotFound = '/revamp/illustration/empty-car.webp'
const CarSkeleton = '/revamp/illustration/car-skeleton.webp'
const Panel = Collapse.Panel

const Overlay = dynamic(() =>
  import('components/atoms').then((mod) => mod.Overlay),
)

interface Props {
  isOpen: boolean
  handleCloseModal: () => void
  isOTO?: boolean
  pageOrigination?: string
  isShowbox?: boolean | null
}

const SEARCH_NOT_FOUND_TEXT = 'Mobil tidak ditemukan'

const saveHistoryToLocal = (link: string, name: string) => {
  const searchHistory = JSON.parse(
    localStorage.getItem('searchHistory') || '[]',
  )
  if (searchHistory.length > 2) {
    searchHistory.pop() // hapus item terakhir
  }
  searchHistory.unshift({ value: link, label: name })
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
}

export const SearchComponent = ({
  isOpen = true,
  handleCloseModal,
  isOTO = false,
  pageOrigination,
  isShowbox,
}: Props) => {
  const {
    patchFunnelQuery: patchFunnelQueryData,
    clearQueryFilter: clearQueryFilterData,
  } = useFunnelQueryData()
  const {
    patchFunnelQuery: patchFunnelQueryUsedCarData,
    clearQueryFilter: clearQueryFilterUsedCarData,
  } = useFunnelQueryUsedCarData()
  const { dataSearchUsedCar } = useUtils()
  const [changeIcon, setChangeIcon] = useState(false)
  const [valueSearch, setValueSearch] = useState('')
  const [suggestionsLists, setSuggestionsLists] = useState<SearchNewCar[]>([])
  const [suggestionsListsUsedCar, setSuggestionsListsUsedCar] = useState<
    SearchUsedCar[]
  >([])
  const { showToast } = useToast()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [isShowLoading, setShowLoading] = useState(true)
  const [comDataNew, setComDataNew] = useState<COMData[]>([])
  const [usedCarRecom, setUsedCarRecom] =
    useState<SearchUsedCar[]>(dataSearchUsedCar)
  const [isError, setIsError] = useState(false)
  const [isNotFoundClicked, setIsNotFoundClicked] = useState(false)
  const [notFound, setIsNotFound] = useState(false)
  const [cityOtr] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const getCityUrl = () => {
    if (cityOtr) return `/${cityOtr.cityName.toLowerCase().replace(' ', '-')}`
    else return '/'
  }

  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = 'hidden'
    } else {
      window.document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    getCarofTheMonth('?city=' + getCity().cityCode)
      .then((res) => {
        setComDataNew(res.data)
      })
      .catch(() => {
        setIsError(true)
      })
  }, [])

  const handleDebounceFn = async (inputValue: string) => {
    const params = new URLSearchParams()
    const paramsUsed = new URLSearchParams()
    getCity().cityName && params.append('city', getCity().cityName as string)
    params.append('query', inputValue as string)
    paramsUsed.append('query', inputValue as string)

    if (inputValue === '') {
      return null
    }
    try {
      const [dataNew, dataUsed]: any = await Promise.all([
        getNewCarSearch('', { params }),
        getUsedCarSearch('', { params: paramsUsed }),
      ])

      if (dataNew.data.length === 0 && dataUsed.data.length === 0) {
        setIsNotFound(true)
        setSuggestionsLists([])
        setSuggestionsListsUsedCar([])
      } else if (dataUsed.data.length !== 0 && dataNew.data.length === 0) {
        setIsNotFound(false)
        setSuggestionsLists([])
        setSuggestionsListsUsedCar([...dataUsed.data])
      } else if (dataNew.data.length !== 0 && dataUsed.data.length === 0) {
        setIsNotFound(false)
        setSuggestionsLists([...dataNew.data])
        setSuggestionsListsUsedCar([])
      } else {
        setIsNotFound(false)
        setSuggestionsLists([...dataNew.data])
        setSuggestionsListsUsedCar([...dataUsed.data])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const debounceFn = useCallback(debounce(handleDebounceFn, 500), [])

  const onHandleChange = (value: string) => {
    setValueSearch(
      filterSpecialChar(
        value
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
      ),
    )
    debounceFn(value)
  }

  const resetLoadingState = () => {
    setProgress(0)
    setShowLoading(false)
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

  const usedCarData = useMemo(() => {
    const data = usedCarRecom?.slice(0, 5)

    return data ?? []
  }, [usedCarRecom])

  const renderSearchOptionsItem = (textToHighlight: string) => {
    const searchWords: string[] = []
    searchWords.push(valueSearch)
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
          return `<span style="font-family: var(--open-sans-semi-bold) !important;">${text}</span>`
        } else {
          return text
        }
      })
      .join('')

    return temp
  }

  const onClickSuggestionList = (item: SearchNewCar) => {
    const check = item.url.includes('/p/')

    let urlDestination = ''
    if (check) {
      urlDestination =
        variantListUrl.replace(
          ':brand/:model/:tab?',
          item.url.split('/p/')[1].replaceAll(' ', '-'),
        ) + `/${getCityUrl()}`
    } else {
      urlDestination = carResultsUrl + item.url.split('/c')[1]
    }

    // simpan pencarian ke dalam local storage
    saveHistoryToLocal(
      item.url.split('/p/')[1].replaceAll(' ', '-'),
      item.carName,
    )

    window.location.href = urlDestination
  }

  const onClickRecommendationList = (item: any) => {
    let urlDestination = variantListUrl.replace(
      '/:brand/:model/:tab?',
      item.link,
    )

    // simpan pencarian ke dalam local storage
    saveHistoryToLocal(urlDestination, item.name)

    window.location.href = urlDestination + `/${getCityUrl()}`
  }

  const clickList = (item: SearchUsedCar) => {
    const check = item.sevaUrl.includes('/p/')

    let urlDestination = ''
    if (check) {
      urlDestination = usedCarDetailUrl.replace(
        ':id',
        item.sevaUrl.split('/p/')[1],
      )
    } else {
      urlDestination = usedCarResultUrl + item.sevaUrl.split('/c')[1]
    }

    // simpan pencarian ke dalam local storage
    saveHistoryToLocal(item.sevaUrl, item.carName)

    window.location.href = urlDestination
  }

  if (isError) return null

  const onClickSearchHistory = (data: any) => {
    handleCloseModal()
    const checkNewCar = data.value.includes('mobil-baru/')
    let urlDestination = ''
    if (checkNewCar) {
      const checkPDP = data.value.includes('/p')
      if (checkPDP) {
        urlDestination =
          variantListUrl.replace(
            ':brand/:model/:tab?',
            data.value.split('/p/')[1],
          ) + `/${getCityUrl()}`
      } else {
        const checkSearch = data.value.includes('search')
        if (checkSearch) {
          urlDestination = data.value
        } else {
          urlDestination = carResultsUrl.replace(
            ':brand/:model/:tab?',
            data.value.split('/c/')[1],
          )
        }
      }
    } else {
      const checkPDPUsedCar = data.value.includes('/p')
      if (checkPDPUsedCar) {
        urlDestination = usedCarDetailUrl.replace(
          ':id',
          data.value.split('/p/')[1],
        )
      } else {
        const checkSearch = data.value.includes('search')
        if (checkSearch) {
          urlDestination = data.value
        } else {
          urlDestination = usedCarResultUrl + data.value.split('/c')[1]
        }
      }
    }
    clearQueryFilterData()
    clearQueryFilterUsedCarData()
    window.location.href = urlDestination
  }

  type RenderedLabels = {
    [label: string]: boolean
  }

  const checkHistory =
    JSON.parse(localStorage.getItem('searchHistory') || '[]').length > 0
  const renderSearchHistory = () => {
    const searchHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]',
    ).slice(0, 3)
    const renderedLabels: RenderedLabels = {}

    return (
      <ul>
        {searchHistory.map((searchTerm: any) => {
          if (!renderedLabels[searchTerm.label]) {
            renderedLabels[searchTerm.label] = true
            return (
              <div
                className={styles.styledCarContentName}
                key={searchTerm.value}
              >
                <div
                  className={styles.styledCarName}
                  onClick={() => onClickSearchHistory(searchTerm)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div className={styles.styledUsedCarName}>
                      {searchTerm.label}
                    </div>
                  </div>
                </div>
                <Line width={'100%'} height={'1px'} background="#EBECEE" />
              </div>
            )
          }
          return null
        })}
      </ul>
    )
  }

  const renderRecommendation = () => {
    return (
      <div>
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          className={styles.listNewCar}
        >
          {carData.map((car) => (
            <>
              <SwiperSlide className={styles.containerNewCar} key={car.name}>
                <div onClick={() => onClickRecommendationList(car)}>
                  <div className={styles.linkCar}>
                    <Image
                      src={car.image}
                      alt={car.name}
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      width={'64'}
                      height={'48'}
                      className={styles.styledCarImage}
                    />
                    <div className={styles.styledCarName}>{car.name}</div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
        <div>
          <Link href={carResultsUrl} className={styles.linkAllCar}>
            <p className={styles.linkAllCar}>Lihat semua mobil baru</p>
            <IconChevronRight width={20} height={20} color="#246ED4" />
          </Link>
        </div>
      </div>
    )
  }

  const renderRecommendationUsedCar = () => {
    return (
      <ul>
        {usedCarData?.map((car: SearchUsedCar) => (
          <>
            <div className={styles.styledCarContentName} key={car.carName}>
              <div
                className={styles.styledCarName}
                onClick={() => clickList(car)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div className={styles.styledUsedCarName}>{car.carName}</div>
                </div>
              </div>
            </div>
            <Line width={'100%'} height={'1px'} background="#EBECEE" />
          </>
        ))}
      </ul>
    )
  }

  const renderSuggestionsNewCar = () => {
    return (
      <div>
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          className={styles.listNewCar}
        >
          {suggestionsLists.map((car) => (
            <>
              <SwiperSlide className={styles.containerNewCar} key={car.carName}>
                <div onClick={() => onClickSuggestionList(car)}>
                  <div className={styles.linkCar}>
                    <Image
                      src={car?.image ?? CarSkeleton}
                      alt={car.carName}
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      width={'64'}
                      height={'48'}
                      className={styles.styledCarImage}
                    />
                    <div className={styles.carName}>
                      {car.carName && (
                        <div style={{ width: '100%' }}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: renderSearchOptionsItem(car.carName),
                            }}
                            className={styles.carName}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
      </div>
    )
  }

  const renderSuggestionUsedCar = () => {
    return (
      <ul>
        {suggestionsListsUsedCar.map((car) => (
          <>
            <div className={styles.styledCarContentName} key={car?.carName}>
              <div
                className={styles.styledCarName}
                onClick={() => clickList(car)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div className={styles.styledUsedCarName}>
                    {car?.carName && (
                      <div style={{ width: '100%' }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderSearchOptionsItem(car.carName),
                          }}
                          className={styles.styledCarName}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Line width={'100%'} height={'1px'} background="#EBECEE" />
          </>
        ))}
      </ul>
    )
  }

  const renderNotFound = () => {
    return (
      <div
        className={clsx({
          [styles.styledDataSuggest]: true,
          [styles.hideHeaderDropdown]: !isOpen,
        })}
      >
        <div className={styles.notFoundContainer}>
          <Image
            src={CarNotFound}
            width={200}
            height={149}
            alt="search not found"
            className={styles.imgNotFound}
          />
          <div className={styles.containerNotFound}>
            <h2 className={styles.titleNotFound}>
              Hmmm... “{valueSearch}” belum tersedia di SEVA.{' '}
            </h2>
            <p className={styles.descNotFound}>
              Silakan ubah kata kunci pencarian untuk menemukan mobil impianmu.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderEmptySearch = () => {
    return (
      <div
        className={clsx({
          [styles.styledDataSuggest]: true,
          [styles.hideHeaderDropdown]: !isOpen,
        })}
      >
        {checkHistory && (
          <div style={{ width: '100%', textAlign: 'left' }}>
            {renderSearchHistory()}
          </div>
        )}
        <Collapse
          defaultActiveKey={['1', '2']}
          expandIconPosition="end"
          size="large"
          expandIcon={({ isActive }) =>
            isActive ? (
              <IconChevronUp height={24} width={24} color="#13131B" />
            ) : (
              <IconChevronDown height={24} width={24} color="#13131B" />
            )
          }
        >
          <Panel header="Cari Mobil Baru" key="1" className={styles.panelStyle}>
            {renderRecommendation()}
          </Panel>
          <Panel
            header="Cari Mobil Bekas"
            key="2"
            className={styles.panelStyle}
          >
            <div>{renderRecommendationUsedCar()}</div>
            <div className={styles.ctaUsedCar}>
              <Link href={usedCarResultUrl} className={styles.linkAllCar}>
                <p className={styles.linkAllCar}>Lihat semua mobil bekas</p>
                <IconChevronRight width={20} height={20} color="#246ED4" />
              </Link>
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }

  const navigateToPLPNewCar = (search: string) => {
    clearQueryFilterData()
    const url = `${carResultsUrl}?search=${search}`
    saveHistoryToLocal(url, search)
    if (window.location.pathname === '/mobil-baru/c') {
      patchFunnelQueryData({ search: search })
      router
        .push({
          query: { search: search },
        })
        .then(() => {
          router.reload()
        })
    } else {
      navigateToPLP(PreviousButton.undefined, {
        search: new URLSearchParams({
          search: search,
        }).toString(),
      })
    }
  }

  const navigateToPLPUsedCar = (search: string) => {
    const url = `${usedCarResultUrl}?search=${search}`
    saveHistoryToLocal(url, search)
    if (window.location.pathname === '/mobil-bekas/c') {
      patchFunnelQueryUsedCarData({ search: search })
      router
        .push({
          query: { search: search },
        })
        .then(() => {
          router.reload()
        })
    } else {
      navigateToPLP(
        PreviousButton.undefined,
        {
          search: new URLSearchParams({
            search: search,
          }).toString(),
        },
        true,
        false,
        urls.internalUrls.usedCarResultsUrl,
      )
    }
  }

  return (
    <>
      <div
        className={clsx({
          [styles.containerSearch]: true,
          [styles.showBox]: isShowbox,
          [styles.hideHeaderSearch]: !isOpen,
        })}
      >
        <SearchInputSecondary
          data-testid={elementId.Homepage.SearchBar.InputSearchCar}
          onSearchInputChange={onHandleChange}
          searchInputValue={valueSearch}
          placeholder="Cari mobil impianmu"
          searchIconSuffix={true}
          className={styles.styledSearchInput}
          handleCloseModal={() => handleCloseModal()}
        />
        {notFound && valueSearch.length > 0 ? (
          renderNotFound()
        ) : valueSearch.length > 0 ? (
          <div
            className={clsx({
              [styles.styledDataResult]: true,
              [styles.hideHeaderDropdown]: !isOpen,
            })}
          >
            <Collapse
              defaultActiveKey={['1', '2']}
              expandIconPosition="end"
              size="large"
              expandIcon={({ isActive }) =>
                isActive ? (
                  <IconChevronUp height={24} width={24} />
                ) : (
                  <IconChevronDown height={24} width={24} />
                )
              }
            >
              <Panel
                header="Cari Mobil Baru"
                key="1"
                className={styles.panelStyle}
              >
                {suggestionsLists.length !== 0 && valueSearch.length > 0 ? (
                  <>
                    {renderSuggestionsNewCar()}
                    <div className={styles.ctaUsedCar}>
                      <div
                        className={styles.linkAllCar}
                        onClick={() => {
                          navigateToPLPNewCar(valueSearch)
                        }}
                      >
                        <p className={styles.ctaCarName}>
                          Cari <b>&quot;{valueSearch}&quot;</b> di Mobil Baru
                        </p>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className={styles.descNotFound}>
                        Hmmm... “{valueSearch}” belum tersedia di Mobil Baru.
                      </p>
                      <p className={styles.descNotFound}>
                        Silakan ubah kata kunci pencarian
                      </p>
                    </div>
                    <div className={styles.ctaUsedCar}>
                      <div
                        className={styles.linkAllCar}
                        onClick={() => {
                          navigateToPLPNewCar(valueSearch)
                        }}
                      >
                        <p className={styles.ctaCarName}>
                          Cari <b>&quot;{valueSearch}&quot;</b> di Mobil Baru
                        </p>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </div>
                    </div>
                  </>
                )}
              </Panel>
              <Panel
                header="Cari Mobil Bekas"
                key="2"
                className={styles.panelStyle}
              >
                {suggestionsListsUsedCar.length !== 0 &&
                valueSearch.length > 0 ? (
                  <>
                    {renderSuggestionUsedCar()}
                    <div className={styles.ctaUsedCar}>
                      {/* EDIT */}
                      <div
                        className={styles.linkAllCar}
                        onClick={() => {
                          navigateToPLPUsedCar(valueSearch)
                        }}
                      >
                        <p className={styles.ctaCarName}>
                          Cari <b>&quot;{valueSearch}&quot;</b> di Mobil Bekas
                        </p>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.containerNotFound}>
                      <p className={styles.descNotFound}>
                        Hmmm... “{valueSearch}” tidak tersedia di Mobil Bekas.
                      </p>
                      <p className={styles.descNotFound}>
                        Silakan ubah kata kunci pencarian
                      </p>
                    </div>
                    <div className={styles.ctaUsedCar}>
                      <Link
                        href={usedCarResultUrl}
                        className={styles.linkAllCar}
                        onClick={() => {
                          router.push(urls.internalUrls.usedCarResultsUrl)
                        }}
                      >
                        <p className={styles.linkAllCar}>
                          Lihat semua mobil bekas
                        </p>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </Link>
                    </div>
                  </>
                )}
              </Panel>
            </Collapse>
          </div>
        ) : (
          renderEmptySearch()
        )}
      </div>
      <Overlay
        isShow={isOpen}
        onClick={() => handleCloseModal()}
        additionalstyle={styles.overlayAdditionalStyle}
      />
    </>
  )
}
