import React, { useMemo } from 'react'
import styles from '../../../styles/pages/navigationfiltermobile.module.scss'
import {
  IconFilter,
  IconStrawberry,
  IconChevronDown,
  // IconBrand,
  IconRemove,
  Button,
} from 'components/atoms'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { sortOptions } from 'config/funnel.config'
import clsx from 'clsx'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import { AxiosResponse } from 'axios'
import { carResultsUrl } from 'utils/helpers/routes'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { ButtonSize, ButtonVersion, LanguageCode } from 'utils/enum'
import { CarRecommendationResponse } from 'utils/types/context'
import { useCar } from 'services/context/carContext'
// import { useQuery } from 'hooks/useQuery'

type NavFilterMobileProps = {
  carlist?: any
  onButtonClick?: (value: boolean) => void
  onSortClick: () => void
  sticky?: boolean
  startScroll?: boolean
  isFilter?: boolean
  isFilterFinancial?: boolean
  resultMinMaxPrice?: any
  setRecommendations: any
  isShowAnnouncementBox?: boolean | null
}
export const NavigationFilterMobile = ({
  carlist,
  onButtonClick,
  onSortClick,
  sticky,
  startScroll,
  isFilter,
  isFilterFinancial,
  // resultMinMaxPrice,
  setRecommendations,
  isShowAnnouncementBox,
}: NavFilterMobileProps) => {
  const router = useRouter()
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const { recommendation } = useCar()
  const { sortBy } = funnelQuery
  const filterSortOption = sortOptions.filter((x) => x.value === sortBy)[0]
  const sortFilter = filterSortOption?.label || ''
  const summaryCar = carlist?.length || 0
  const onClickOK = () => {
    onButtonClick && onButtonClick(true)
  }
  const Currency = (value: any) => {
    return replacePriceSeparatorByLocalization(
      filterNonDigitCharacters(value.toString()),
      LanguageCode.id,
    )
  }
  const showInformDaihatsu = useMemo(() => {
    const collectDaihatsu = recommendation.some(
      (item) => item.brand === 'Daihatsu',
    )
    return collectDaihatsu
  }, [recommendation])

  const removeFinancialFilter = () => {
    patchFunnelQuery({
      age: '',
      downPaymentAmount: '',
      monthlyIncome: '',
      tenure: 5,
      isDefaultTenureChanged: false,
    })
    const filter = {
      ...funnelQuery,
      age: '',
      downPaymentAmount: '',
      monthlyIncome: '',
      tenure: 5,
      isDefaultTenureChanged: false,
    }
    newFunnel(filter)
  }
  const removePriceRangeFilter = () => {
    patchFunnelQuery({
      priceRangeGroup: '',
    })
    const filter = {
      ...funnelQuery,
      priceRangeGroup: '',
    }
    newFunnel(filter)
  }
  const removeFilter = (type: any, key: any) => {
    if (type === 'bodyType') {
      patchFunnelQuery({
        bodyType:
          funnelQuery.bodyType &&
          funnelQuery.bodyType.filter((item: any) => item !== key),
      })
      const filter = {
        ...funnelQuery,
        bodyType:
          funnelQuery.bodyType &&
          funnelQuery.bodyType.filter((item: any) => item !== key),
      }
      newFunnel(filter)
    } else {
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
    }
  }
  const newFunnel = async (filter: any) => {
    getNewFunnelRecommendations(filter).then((response: any) => {
      setRecommendations(response.carRecommendations)
      const paramUrl = {
        age: String(filter.age),
        downPaymentAmount:
          (filter.downPaymentAmount && filter.downPaymentAmount.toString()) ||
          '',
        monthlyIncome:
          (filter.monthlyIncome && filter.monthlyIncome.toString()) || '',
        priceRangeGroup: filter.priceRangeGroup,
        bodyType:
          filter.bodyType.length > 0
            ? String(filter.bodyType).replace(' ', ',')
            : '',
        // sortBy: sortBy,
        brand:
          filter.brand.length > 0 ? String(filter.brand).replace(' ', ',') : '',
        tenure: String(filter.tenure),
        sortBy: String(funnelQuery.sortBy) || 'lowToHigh',
      }
      router.replace({
        pathname: carResultsUrl,
        search: new URLSearchParams(
          Object.entries(paramUrl).filter(([, v]) => v !== ''),
        )
          .toString()
          .replace('%2C', ','),
      })
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
            {funnelQuery.bodyType &&
              funnelQuery.bodyType.map((item: any) => (
                <div key={item} className={styles.navOuter}>
                  <div
                    className={styles.navFrame}
                    onClick={() => removeFilter('bodyType', item)}
                  >
                    <span className={styles.text}>{item}</span>{' '}
                    <div className={styles.onClick}>
                      <IconRemove width={16} height={16} color="#878D98" />
                    </div>
                  </div>
                </div>
              ))}
            {funnelQuery.priceRangeGroup && (
              <div className={styles.navOuter}>
                <div
                  className={styles.navFrame}
                  onClick={removePriceRangeFilter}
                >
                  <span className={styles.text}>
                    Rp
                    {Currency(
                      funnelQuery.priceRangeGroup?.toString().split('-')[0],
                    )}{' '}
                    - Rp
                    {Currency(
                      funnelQuery.priceRangeGroup?.toString().split('-')[1],
                    )}
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
                {summaryCar} Mobil Baru
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
      {showInformDaihatsu && !sticky && (
        <>
          <div className={styles.line} />
          <div className={styles.informWrapper}>
            <span
              className={styles.informDaihatsuText}
              data-testid={elementId.DSOCityBlocker}
            >
              Harga OTR Daihatsu menggunakan harga OTR Jakarta Pusat.
            </span>
          </div>
        </>
      )}
    </>
  )
}
