import { Collapse, ConfigProvider, Select } from 'antd'
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

const CarNotFound = '/revamp/illustration/empty-car.webp'
const Panel = Collapse.Panel

const Overlay = dynamic(() =>
  import('components/atoms').then((mod) => mod.Overlay),
)

interface Props {
  isOpen: boolean
  handleCloseModal: () => void
  isOTO?: boolean
  pageOrigination?: string
}

const SEARCH_NOT_FOUND_TEXT = 'Mobil tidak ditemukan'

export const SearchComponent = ({
  isOpen = true,
  handleCloseModal,
  isOTO = false,
  pageOrigination,
}: Props) => {
  const { patchFunnelQuery: patchFunnelQueryData, setFunnelQueryValue } =
    useFunnelQueryData()
  const { patchFunnelQuery: patchFunnelQueryUsedCarData } =
    useFunnelQueryUsedCarData()
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
  const [isError, setIsError] = useState(false)
  const [isNotFoundClicked, setIsNotFoundClicked] = useState(false)
  const [notFound, setIsNotFound] = useState(false)

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
    getCity().cityCode && params.append('city', getCity().cityCode as string)
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
      console.log(dataNew.data.length)
      console.log(dataUsed.data.length)

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
      value
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
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
          return `<strong style="font-weight: 700;">${text}</strong>`
        } else {
          return text
        }
      })
      .join('')

    return temp
  }

  const onClickRecommedationList = (car: any) => {
    let urlDestination = (isOTO ? OTOVariantListUrl : variantListUrl)
      .replace('/:brand/:model', car.link)
      .replace(':tab?', '')
  }

  const onClickSuggestionList = (item: SearchNewCar) => {
    const check = item.url.includes('/p/')

    let urlDestination = ''
    if (check) {
      urlDestination = variantListUrl.replace(
        ':brand/:model/:tab?',
        item.url.split('/p/')[1],
      )
    } else {
      urlDestination = carResultsUrl + item.url.split('/c')[1]
    }

    // simpan pencarian ke dalam local storage
    const searchHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]',
    )
    if (searchHistory.length >= 3) {
      searchHistory.pop() // hapus item terakhir
    }
    searchHistory.unshift({ value: item.url, label: item.carName })
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

    window.location.href = urlDestination
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
    const searchHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]',
    )
    if (searchHistory.length >= 3) {
      searchHistory.pop() // hapus item terakhir
    }
    searchHistory.unshift({ value: item.sevaUrl, label: item.carName })
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

    window.location.href = urlDestination
  }

  if (isError) return null

  const onClickSearchHistory = (data: any) => {
    handleCloseModal()
    const check = data.value.includes('/p/')
    let urlDestination = ''
    if (check) {
      urlDestination = usedCarDetailUrl.replace(
        ':id',
        data.value.split('/p/')[1],
      )
    } else {
      urlDestination = usedCarResultUrl + data.value.split('/c')[1]
    }

    window.location.href = urlDestination
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
                    <a style={{ color: '#000' }}>{searchTerm.label}</a>
                  </div>
                </div>
                <Line width={'100%'} height={'1px'} background="#EBECEE" />
              </React.Fragment>
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
                <Link
                  href={`${isOTO ? `/adaSEVAdiOTO` : ``}/mobil-baru${
                    isOTO ? '' : '/p'
                  }${car.link.toLowerCase()}`}
                  onClick={() => onClickRecommedationList(car)}
                >
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
                    />
                    <div className={styles.styledCarName}>{car.name}</div>
                  </div>
                </Link>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
        <div>
          <Link href={carResultsUrl} className={styles.linkAllCar}>
            <h3>Lihat semua mobil baru</h3>
            <IconChevronRight width={20} height={20} color="#246ED4" />
          </Link>
        </div>
      </div>
    )
  }

  const renderRecommendationUsedCar = () => {
    return (
      <ul>
        {carData.map((car) => (
          <>
            <div className={styles.styledCarContentName} key={car.name}>
              <Link
                className={styles.styledCarName}
                href={`${
                  isOTO ? `/adaSEVAdiOTO` : ``
                }/mobil-baru${car.link.toLowerCase()}`}
                onClick={() => onClickRecommedationList(car)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div className={styles.styledUsedCarName}>{car.name}</div>
                </div>
              </Link>
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
                      src={car?.image ?? ''}
                      alt={car.carName}
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      width={'64'}
                      height={'48'}
                    />
                    <div className={styles.styledCarName}>
                      {car.carName && (
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
              <div className={styles.styledLink} onClick={() => clickList(car)}>
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
        <div className={styles.styledItem}>
          <div style={{ width: '100%', textAlign: 'left' }}>
            {renderSearchHistory()}
          </div>
        </div>
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
                <h3>Lihat semua mobil bekas</h3>
                <IconChevronRight width={20} height={20} color="#246ED4" />
              </Link>
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }
  console.log(suggestionsLists)

  const navigateToPLPNewCar = (search: string) => {
    if (window.location.pathname === '/mobil-baru/c') {
      patchFunnelQueryData({ search: search })
      router
        .push({
          query: { ...router.query, search: search },
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
    if (window.location.pathname === '/mobil-bekas/c') {
      patchFunnelQueryUsedCarData({ search: search })
      router
        .push({
          query: { ...router.query, search: search },
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
                      <Link
                        href={'#'}
                        className={styles.linkAllCar}
                        onClick={() => {
                          navigateToPLPNewCar(valueSearch)
                        }}
                      >
                        <h3>
                          Cari <b>&quot;{valueSearch}&quot;</b> di Mobil Baru
                        </h3>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </Link>
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
                      <Link
                        href={'#'}
                        className={styles.linkAllCar}
                        onClick={() => {
                          router.push(urls.internalUrls.carResultsUrl)
                        }}
                      >
                        <h3>Lihat semua mobil baru</h3>
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
                      <Link
                        href={'#'}
                        className={styles.linkAllCar}
                        onClick={() => {
                          navigateToPLPUsedCar(valueSearch)
                        }}
                      >
                        <h3>
                          Cari <b>&quot;{valueSearch}&quot;</b> di Mobil Bekas
                        </h3>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </Link>
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
                        <h3>Lihat semua mobil bekas</h3>
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
