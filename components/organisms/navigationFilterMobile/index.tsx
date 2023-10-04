import React, { useEffect, useMemo, useState } from 'react'
import styles from '../../../styles/pages/navigationfiltermobile.module.scss'
import {
  IconFilter,
  IconStrawberry,
  IconChevronDown,
  IconRemove,
  Button,
} from 'components/atoms'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import clsx from 'clsx'
import urls from 'utils/helpers/url'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'
import { sortOptions } from 'utils/config/funnel.config'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { PreviousButton, navigateToPLP } from 'utils/navigate'
import { useRouter } from 'next/router'

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
  isOTO?: boolean
}
export const NavigationFilterMobile = ({
  carlist,
  onButtonClick,
  onSortClick,
  sticky,
  startScroll,
  isFilter,
  isFilterFinancial,
  setRecommendations,
  isShowAnnouncementBox,
  isOTO,
}: NavFilterMobileProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const { sortBy } = funnelQuery
  const router = useRouter()
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
        : navigateToPLP(PreviousButton.SmartSearch, {
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
    </>
  )
}
