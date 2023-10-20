import React, { useEffect, useMemo, useState } from 'react'
import styles from 'styles/pages/navigationfiltermobile.module.scss'
import {
  IconFilter,
  IconStrawberry,
  IconChevronDown,
  IconRemove,
  Button,
} from 'components/atoms'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import clsx from 'clsx'
import urls from 'utils/helpers/url'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { addSeparator, filterNonDigitCharacters } from 'utils/stringUtils'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'
import { sortOptionsUsedCar } from 'utils/config/funnel.config'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { PreviousButton, navigateToPLP } from 'utils/navigate'
import { useRouter } from 'next/router'
import {
  getNewFunnelRecommendations,
  getUsedCarFunnelRecommendations,
} from 'utils/handler/funnel'
import { usedCar } from 'services/context/usedCarContext'

type NavFilterMobileUsedCarProps = {
  carlist?: any
  onButtonClick?: (value: boolean) => void
  onSortClick: () => void
  sticky?: boolean
  startScroll?: boolean
  isFilter?: boolean
  isFilterFinancial?: boolean
  resultMinMaxPrice?: any
  setRecommendations: any
  setTotalItems: any
  isShowAnnouncementBox?: boolean | null
  cityList?: any
  isOTO?: boolean
  isUsed?: boolean
}
export const NavigationFilterMobileUsedCar = ({
  carlist,
  onButtonClick,
  onSortClick,
  sticky,
  startScroll,
  isFilter,
  isFilterFinancial,
  setRecommendations,
  setTotalItems,
  isShowAnnouncementBox,
  cityList,
  isOTO,
  isUsed,
}: NavFilterMobileUsedCarProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()
  const { sortBy } = funnelQuery
  const router = useRouter()
  const filterSortOption = sortOptionsUsedCar.filter(
    (x) => x.value === sortBy,
  )[0]
  const sortFilter = filterSortOption?.label || ''
  const summaryCar = carlist || 0
  const onClickOK = () => {
    onButtonClick && onButtonClick(true)
  }
  const [location, setLocation] = useState([])
  const Currency = (value: any) => {
    return replacePriceSeparatorByLocalization(
      filterNonDigitCharacters(value.toString()),
      LanguageCode.id,
    )
  }

  const removeFinancialFilter = () => {
    patchFunnelQuery({
      tenure: 5,
      isDefaultTenureChanged: false,
      transmission: '',
    })
    const filter = {
      ...funnelQuery,
      tenure: 5,
      isDefaultTenureChanged: false,
      transmission: '',
    }
    newFunnel(filter)
  }
  const removePriceRangeFilter = () => {
    patchFunnelQuery({
      priceStart: '',
      priceEnd: '',
    })
    const filter = {
      ...funnelQuery,
      priceStart: '',
      priceEnd: '',
    }
    newFunnel(filter)
  }

  const removeTransmissionFilter = () => {
    patchFunnelQuery({
      transmission: '',
    })
    const filter = {
      ...funnelQuery,
      transmission: '',
    }
    newFunnel(filter)
  }

  const removeYearRangeFilter = () => {
    patchFunnelQuery({
      yearStart: '',
      yearEnd: '',
    })
    const filter = {
      ...funnelQuery,
      yearStart: '',
      yearEnd: '',
    }
    newFunnel(filter)
  }
  const removeMileageRangeFilter = () => {
    patchFunnelQuery({
      mileageStart: '',
      mileageEnd: '',
    })
    const filter = {
      ...funnelQuery,
      mileageStart: '',
      mileageEnd: '',
    }
    newFunnel(filter)
  }
  const removeFilter = (type: any, key: any) => {
    if (type === 'brand') {
      patchFunnelQuery({
        brand:
          funnelQuery.brand &&
          funnelQuery.brand.filter((item: any) => item !== key),
      })
      const filter = {
        ...funnelQuery,
        brand:
          funnelQuery.brand &&
          funnelQuery.brand.filter((item: any) => item !== key),
      }
      newFunnel(filter)
    } else {
      patchFunnelQuery({
        city_id:
          funnelQuery.city_id &&
          funnelQuery.city_id.filter((item: any) => {
            return item !== key
          }),
      })
      const filter = {
        ...funnelQuery,
        city_id:
          funnelQuery.city_id &&
          funnelQuery.city_id.filter((item: any) => item !== key),
      }
      newFunnel(filter)
    }
  }

  useEffect(() => {
    const resultFilter = cityList?.filter((item: any) => {
      return funnelQuery.city_id?.includes(item.cityId)
    })

    setLocation(resultFilter)
  }, [funnelQuery.city_id])
  const newFunnel = async (filter: any) => {
    getUsedCarFunnelRecommendations(filter).then((response: any) => {
      setTotalItems(response.totalItems)
      setRecommendations(response.carData)
      const paramUrl = {
        priceStart: filter.priceStart,
        priceEnd: filter.priceEnd,
        yearStart: filter.yearStart,
        yearEnd: filter.yearEnd,
        mileageStart: filter.mileageStart,
        mileageEnd: filter.mileageEnd,
        city_id: filter.city_id,
        transmission: filter.transmission,
        // sortBy: sortBy,
        brand:
          filter.brand.length > 0 ? String(filter.brand).replace(' ', ',') : '',
        tenure: String(filter.tenure),
        sortBy: String(funnelQuery.sortBy) || 'lowToHigh',
      }

      isOTO
        ? navigateToPLP(
            PreviousButton.SmartSearch,
            {
              search: new URLSearchParams(
                Object.entries(paramUrl).filter(([, v]) => v !== ''),
              )
                .toString()
                .replace('%2C', ','),
            },
            true,
            false,
            urls.internalUrls.duplicatedCarResultsUrl,
          )
        : navigateToPLP(
            PreviousButton.SmartSearch,
            {
              search: new URLSearchParams(
                Object.entries(paramUrl).filter(([, v]) => v !== ''),
              )
                .toString()
                .replace('%2C', ','),
            },
            true,
            false,
            urls.internalUrls.usedCarResultsUrl,
          )
    })
  }

  return (
    <>
      <div
        className={clsx({
          [styles.wrapper]: true,
          [styles.stickycontainer]: sticky,
          [styles.hideHeader]: startScroll,
          [styles.showHeader]: !startScroll && !isShowAnnouncementBox,
          [styles.showHeaderWithAnnouncementBox]:
            !startScroll && isShowAnnouncementBox,
          [styles.wrapperWithAnnouncementBox]: isShowAnnouncementBox,
        })}
      >
        {isFilter ? (
          <div className={styles.filterActiveWrapper}>
            <div onClick={onClickOK} className={styles.filterActive}>
              <IconFilter width={24} height={24} /> Filter
            </div>
            <div className={styles.verticalLine} />
            {isFilterFinancial && (
              <div className={styles.navOuter}>
                <div
                  className={styles.navFrame}
                  onClick={removeFinancialFilter}
                >
                  <span className={styles.text}>Finansial</span>{' '}
                  <div className={styles.onClick}>
                    <IconRemove width={16} height={16} color="#878D98" />
                  </div>
                </div>
              </div>
            )}
            {funnelQuery.brand &&
              funnelQuery.brand.map((item: any) => (
                <div key={item} className={styles.navOuter}>
                  <div
                    className={styles.navFrame}
                    onClick={() => removeFilter('brand', item)}
                  >
                    <span className={styles.text}>{item}</span>{' '}
                    <div className={styles.onClick}>
                      <IconRemove width={16} height={16} color="#878D98" />
                    </div>
                  </div>
                </div>
              ))}
            {location &&
              location.map((item: any) => (
                <div key={item} className={styles.navOuter}>
                  <div
                    className={styles.navFrame}
                    onClick={() => removeFilter('location', item.cityId)}
                  >
                    <span className={styles.text}>{item.cityName}</span>{' '}
                    <div className={styles.onClick}>
                      <IconRemove width={16} height={16} color="#878D98" />
                    </div>
                  </div>
                </div>
              ))}
            {funnelQuery.priceStart && funnelQuery.priceEnd && (
              <div className={styles.navOuter}>
                <div
                  className={styles.navFrame}
                  onClick={removePriceRangeFilter}
                >
                  <span className={styles.text}>
                    Rp
                    {Currency(funnelQuery.priceStart?.toString())} - Rp
                    {Currency(funnelQuery.priceEnd?.toString())}
                  </span>{' '}
                  <div className={styles.onClick}>
                    <IconRemove width={16} height={16} color="#878D98" />
                  </div>
                </div>
              </div>
            )}
            {funnelQuery.transmission && (
              <div className={styles.navOuter}>
                <div
                  className={styles.navFrame}
                  onClick={removeTransmissionFilter}
                >
                  <span className={styles.text}>
                    {funnelQuery.transmission}
                  </span>{' '}
                  <div className={styles.onClick}>
                    <IconRemove width={16} height={16} color="#878D98" />
                  </div>
                </div>
              </div>
            )}
            {funnelQuery.yearStart && funnelQuery.yearEnd && (
              <div className={styles.navOuter}>
                <div
                  className={styles.navFrame}
                  onClick={removeYearRangeFilter}
                >
                  <span className={styles.text}>
                    {funnelQuery.yearStart?.toString()} -
                    {funnelQuery.yearEnd?.toString()}
                  </span>{' '}
                  <div className={styles.onClick}>
                    <IconRemove width={16} height={16} color="#878D98" />
                  </div>
                </div>
              </div>
            )}
            {funnelQuery.mileageStart && funnelQuery.mileageEnd && (
              <div className={styles.navOuter}>
                <div
                  className={styles.navFrame}
                  onClick={removeMileageRangeFilter}
                >
                  <span className={styles.text}>
                    {addSeparator(funnelQuery.mileageStart?.toString())}
                    km - {addSeparator(funnelQuery.mileageEnd?.toString())}
                    km
                  </span>{' '}
                  <div className={styles.onClick}>
                    <IconRemove width={16} height={16} color="#878D98" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={onClickOK}
            version={ButtonVersion.Secondary}
            size={ButtonSize.Big}
            data-testid={elementId.PLP.Button.FilterMobil}
            secondaryClassName={styles.filterButton}
          >
            <IconFilter width={14} height={14} /> Filter Mobil
          </Button>
        )}
        {!sticky && (
          <>
            {' '}
            <div className={styles.line} />
            <div className={styles.bottomSection}>
              <div
                className={styles.sortSection}
                role="button"
                onClick={onSortClick}
                data-testid={elementId.FilterButton.Sorting}
              >
                <IconStrawberry width={16} height={16} /> Urutkan:{' '}
                <p>{sortFilter}</p>
                <IconChevronDown width={16} height={16} />
              </div>
              <div
                className={styles.carSummaryLabel}
                data-testid={elementId.PLP.Text.JumlahMobil}
              >
                {summaryCar} {isUsed ? 'Mobil Bekas' : 'Mobil Baru'}
              </div>
            </div>
          </>
        )}
      </div>
      {isFilterFinancial && !sticky && (
        <>
          {/*<div className={styles.filterResultPadding}>*/}
          {/*  <div className={styles.filterResultWrapper}>*/}
          {/*    <div className={styles.filterResultFrame}>*/}
          {/*      <IconBrand width={24} height={24} color="#B4231E" />*/}
          {/*      <p className={styles.filterResultText}>*/}
          {/*        Berdasarkan filter finansialmu, kisaran harga mobil yang ideal*/}
          {/*        untukmu adalah <br />*/}
          {/*        <p className={styles.filterResultPrice}>*/}
          {/*          Rp{Currency(resultMinMaxPrice.resultMinPrice)} - Rp*/}
          {/*          {Currency(resultMinMaxPrice.resultMaxPrice)}*/}
          {/*        </p>*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </>
      )}
    </>
  )
}
