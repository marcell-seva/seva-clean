import {
  trackLCCarRecommendationClick,
  trackLCCarRecommendationCTAClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'
import React from 'react'
import {
  carResultsUrl,
  loanCalculatorWithCityBrandModelUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import { CarRecommendation } from 'utils/types/utils'
import { getLowestInstallment } from 'utils/carModelUtils/carModelUtils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Button } from 'components/atoms'
import { LabelMudah } from 'components/molecules'
import styles from 'styles/components/organisms/carRecomendations.module.scss'
import { AlternativeCarCard } from '../alternativeCarCard'
import { useRouter } from 'next/router'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

type CarRecommendationsPropss = {
  title: string
  carRecommendationList: CarRecommendation[]
  onClick: () => void
  selectedCity: string
  additionalContainerStyle?: string
}

export default function CarRecommendations({
  title,
  carRecommendationList,
  onClick,
  selectedCity,
  additionalContainerStyle,
}: CarRecommendationsPropss) {
  const router = useRouter()

  const getDestinationUrl = (carDetail: CarRecommendation) => {
    if (window.location.pathname.includes('/mobil-baru')) {
      return variantListUrl
        .replace(
          ':brand/:model',
          (carDetail.brand + '/' + carDetail.model.replace(/ +/g, '-'))
            .replace(/ +/g, '')
            .toLowerCase(),
        )
        .replace(':tab', 'kredit')
    } else {
      return loanCalculatorWithCityBrandModelUrl
        .replace(
          ':cityName/:brand/:model',
          selectedCity.replace(/ +/g, '-') +
            '/' +
            carDetail.brand.replace(/ +/g, '-') +
            '/' +
            carDetail.model.replace(/ +/g, '-') +
            '/',
        )
        .toLocaleLowerCase()
    }
  }

  const handleCalculateAbility = (item: CarRecommendation) => {
    const lowestInstallment = getLowestInstallment(item.variants)
    const formatLowestInstallment = replacePriceSeparatorByLocalization(
      lowestInstallment,
      LanguageCode.id,
    )

    trackLCCarRecommendationCTAClick({
      Car_Brand: item.brand,
      Car_Model: item.model,
      City: selectedCity,
      Monthly_Installment: `Rp${formatLowestInstallment}`,
      Page_Origination: window.location.href,
    })

    window.location.replace(getDestinationUrl(item))
  }

  const handleClickDetailCar = (url: string, item: CarRecommendation) => {
    const lowestInstallment = getLowestInstallment(item.variants)
    const formatLowestInstallment = replacePriceSeparatorByLocalization(
      lowestInstallment,
      LanguageCode.id,
    )

    const path = variantListUrl
      .replace(
        ':brand/:model/:tab?',
        item.brand.replace(/ +/g, '-') +
          '/' +
          item.model.replace(/ +/g, '-') +
          '/',
      )
      .toLocaleLowerCase()

    trackLCCarRecommendationClick({
      Car_Brand: item.brand,
      Car_Model: item.model,
      City: selectedCity,
      Monthly_Installment: `Rp${formatLowestInstallment}`,
      Page_Origination: window.location.href,
    })

    window.location.href = path
  }

  return (
    <div
      className={`${styles.alternativeCarContainer} ${additionalContainerStyle}`}
    >
      <h3
        className={styles.alternativeCarTitle}
        data-testid={elementId.LoanCalculator.RekomendasiFinansial}
      >
        {title}
      </h3>
      <div className={styles.alternativeCarWrapper}>
        {carRecommendationList?.map((item, index) => (
          <AlternativeCarCard
            key={index}
            recommendation={item}
            onClickLabel={onClick}
            label={<LabelMudah style={{ left: 0 }} />}
          >
            <div
              className={styles.alternativeCarLink}
              onClick={() =>
                handleClickDetailCar(`${carResultsUrl}/${item.id}`, item)
              }
              data-testid={elementId.LoanCalculator.Button.LihatDetail}
            >
              Lihat Detail
            </div>
            <Button
              version={ButtonVersion.Secondary}
              size={ButtonSize.Big}
              onClick={() => handleCalculateAbility(item)}
            >
              Hitung Kemampuan
            </Button>
          </AlternativeCarCard>
        ))}
      </div>
    </div>
  )
}
