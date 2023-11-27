import { Collapse, ConfigProvider, Select } from 'antd'
import styles from 'styles/components/organisms/searchComponent.module.scss'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  OTONewCarUrl,
  OTOVariantListUrl,
  carResultsUrl,
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
} from 'components/atoms'
import dynamic from 'next/dynamic'
import { getCity } from 'utils/hooks/useGetCity'
import { getCarofTheMonth, getSearchDataQuery } from 'services/api'
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

const CarNotFound = '/revamp/illustration/empty-car.webp'
const Panel = Collapse.Panel

const { Option } = Select

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
  isOpen,
  handleCloseModal,
  isOTO = false,
  pageOrigination,
}: Props) => {
  const { patchFunnelQuery } = useFunnelQueryData()
  const [changeIcon, setChangeIcon] = useState(false)
  const [valueSearch, setValueSearch] = useState('')
  const [suggestionsLists, setSuggestionsLists] = useState<Option<string>[]>([])
  const { showToast } = useToast()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [isShowLoading, setShowLoading] = useState(true)
  const [comDataNew, setComDataNew] = useState<COMData[]>([])
  const [isError, setIsError] = useState(false)
  const [isNotFoundClicked, setIsNotFoundClicked] = useState(false)

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

  const handleDebounceFn = (inputValue: string) => {
    console.log(inputValue)

    const params = new URLSearchParams()
    getCity().cityCode && params.append('city', getCity().cityCode as string)
    getCity().id && params.append('cityId', getCity().id as string)
    params.append('query', inputValue as string)

    getSearchDataQuery('', { params })
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
        console.log(listedResult)

        if (listedResult.length === 0) {
          listedResult.push({
            value: '',
            label: `Hmmm... "${inputValue}" belum tersedia di SEVA.`,
          })
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

  const onHandleChange = (value: string) => {
    console.log(value)
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

  const clickList = (item: any) => {
    if (item.label === SEARCH_NOT_FOUND_TEXT) {
      return // Jangan lakukan apa pun jika opsi "Mobil tidak ditemukan" diklik
    }
    let urlDestination = ''
    if (item.value.length > 0) {
      urlDestination = (isOTO ? OTOVariantListUrl : variantListUrl)
        .replace('/:brand/:model', item.value)
        .replace(':tab?', '')
    } else {
      patchFunnelQuery({
        [FunnelQueryKey.Brand]: [item.label],
      })
      urlDestination = isOTO ? OTONewCarUrl : carResultsUrl
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

    handleCloseModal()
    removeCarBrand
    const brandValue = item.label.split(' ')[0]
    const modelValue = item.label.split(' ').splice(1).join(' ')
    // use window location to reload page
    if (item.value.length > 0) {
      window.location.href = urlDestination
    } else {
      const funnelQueryTemp = {
        brand: [item.label],
      }
      navigateToPLP(
        PreviousButton.SearchBar,
        { search: convertObjectQuery(funnelQueryTemp) },
        true,
        false,
        urlDestination,
      )
    }
    setIsNotFoundClicked(false)
  }

  if (isError) return null
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
                  href={`${
                    isOTO ? `/adaSEVAdiOTO` : ``
                  }/mobil-baru${car.link.toLowerCase()}`}
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
          <Link href={'#'} className={styles.linkAllCar}>
            <h3>Lihat semua mobil baru</h3>
            <IconChevronRight width={20} height={20} color="#246ED4" />
          </Link>
        </div>
      </div>
    )
  }
  const onClickSearchHistory = (data: any) => {
    handleCloseModal()
    if (data.value === '') {
      patchFunnelQuery({ brand: [data.label] })
      const funnelQueryTemp = {
        brand: data.label,
      }
      {
        isOTO
          ? navigateToPLP(
              PreviousButton.SearchBar,
              {
                search: convertObjectQuery(funnelQueryTemp),
              },
              true,
              false,
              OTONewCarUrl,
            )
          : navigateToPLP(PreviousButton.SearchBar, {
              search: convertObjectQuery(funnelQueryTemp),
            })
      }
    } else {
      // use window location to reload page
      window.location.href = (isOTO ? OTONewCarUrl : carResultsUrl) + data.value
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

  console.log(suggestionsLists)

  return (
    <>
      <div
        className={clsx({
          [styles.containerSearch]: true,
          [styles.hideHeaderSearch]: !isOpen,
        })}
      >
        <ConfigProvider
          theme={{
            components: {
              Select: {
                optionPadding: '0',
                optionSelectedBg: 'white',
                // paddingContentHorizontalLG: 16,
                controlPaddingHorizontalSM: 16,
                controlHeightLG: 48,
                // colorBorder: '#EBECEE',
              },
            },
          }}
        >
          <Select
            // allowClear={{
            //   clearIcon: (
            //     <div className={styles.removeIcon}>
            //       <CloseOutlined2 color="#F5F6F6" width={6} height={6} />
            //     </div>
            //   ),
            // }}
            listHeight={640}
            searchValue={valueSearch}
            onSearch={(value) => onHandleChange(value)}
            showSearch
            className={styles.inputSearch}
            size="large"
            onBlur={() => handleCloseModal()}
            onDropdownVisibleChange={() => {
              setChangeIcon(!changeIcon)
            }}
            suffixIcon={
              <div className={styles.removeIcon}>
                <CloseOutlined2 color="#F5F6F6" width={6} height={6} />
              </div>
              // changeIcon ? (
              //   <div className={styles.removeIcon}>
              //     <CloseOutlined2 color="#F5F6F6" width={6} height={6} />
              //   </div>
              // ) : (
              //   <div className={styles.removeIcon}>
              //     <IconSearch color="#F5F6F6" width={15} height={15} />
              //   </div>
              // )
            }
            dropdownRender={(menu) => (
              <div
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {menu}
              </div>
            )}
            notFoundContent={
              <div className={styles.notFoundContainer}>
                <Image
                  src={CarNotFound}
                  width={200}
                  height={149}
                  alt="search not found"
                  className={styles.imgNotFound}
                />
                <div>
                  <h2 className={styles.titleNotFound}>
                    Hmmm... “aventador” belum tersedia di SEVA.{' '}
                  </h2>
                  <p className={styles.descNotFound}>
                    Silakan ubah kata kunci pencarian untuk menemukan mobil
                    impianmu.
                  </p>
                </div>
              </div>
            }
          >
            {suggestionsLists.length !== 0 && valueSearch.length > 0 ? (
              <div className={styles.styledDataResult}>
                {suggestionsLists.map((car) => {
                  return (
                    <>
                      <div
                        data-testid={
                          elementId.Homepage.SearchBar.CarModelOption +
                          car.label +
                          valueSearch
                        }
                        onClick={() => clickList(car)}
                        key={car.value}
                        className={`${styles.styledLink} ${
                          suggestionsLists[0].label === SEARCH_NOT_FOUND_TEXT
                            ? styles.disableClick
                            : ''
                        } searchOption`}
                      >
                        {car.label && (
                          <div style={{ width: '100%' }}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: renderSearchOptionsItem(car.label),
                              }}
                              className={styles.styledCarName}
                            />
                          </div>
                        )}
                      </div>
                      <Line
                        width={'100%'}
                        height={'1px'}
                        background="#EBECEE"
                      />
                    </>
                  )
                })}
                <div className={styles.ctaUsedCar}>
                  <Link href={'#'} className={styles.linkAllCar}>
                    <h3>
                      Cari &rdquo;<b>{valueSearch}</b>&rdquo; mobil bekas
                    </h3>
                    <IconChevronRight width={20} height={20} color="#246ED4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.styledDataSuggest}>
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
                  <Panel
                    header="Cari Mobil Baru"
                    key="1"
                    className={styles.panelStyle}
                  >
                    {renderRecommendation()}
                  </Panel>
                  <Panel
                    header="Cari Mobil Bekas"
                    key="2"
                    className={styles.panelStyle}
                  >
                    <div>{renderRecommendationUsedCar()}</div>
                    <div className={styles.ctaUsedCar}>
                      <Link href={'#'} className={styles.linkAllCar}>
                        <h3>Lihat semua mobil bekas</h3>
                        <IconChevronRight
                          width={20}
                          height={20}
                          color="#246ED4"
                        />
                      </Link>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            )}
          </Select>
        </ConfigProvider>
      </div>
      <Overlay
        isShow={isOpen}
        onClick={() => handleCloseModal()}
        additionalstyle={styles.overlayAdditionalStyle}
      />
    </>
  )
}
