import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import styles from 'styles/components/organisms/descriptionTab.module.scss'

import { UsedCarRecommendation } from 'utils/types/utils'
import { million, ten } from 'utils/helpers/const'

import { formatNumberByLocalization, rupiah } from 'utils/handler/rupiah'
// import promoBannerTradeIn from '/public/revamp/illustration/PromoTradeIn.webp'
import { CityOtrOption } from 'utils/types/utils'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LeadsFormUsedCar, UsedCarRecommendations } from 'components/organisms'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import DescriptionSection from 'components/organisms/descriptionSection/index'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useRouter } from 'next/router'
import { useCar } from 'services/context/carContext'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { TrackerFlag } from 'utils/types/models'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import dynamic from 'next/dynamic'
import { getUsedCarRecommendations } from 'services/api'

const NewCarRecommendations = dynamic(
  () => import('components/organisms/NewCarRecommendations'),
)

type DescriptionProps = {
  setPromoName: (value: string) => void
  onButtonClick: (value: boolean) => void
  //   videoData: VideoDataType
  setSelectedTabValue: (value: string) => void
  //   setVariantIdFuelRatio: (value: string) => void
  //   variantFuelRatio: string | undefined
  //   isOTO?: boolean
}

export const formatShortPrice = (price: number) => {
  return formatNumberByLocalization(price, LanguageCode.id, million, ten)
}

export const DescriptionTab = ({
  setPromoName,
  onButtonClick,
  setSelectedTabValue,
}: DescriptionProps) => {
  const { carModelDetails, carVariantDetails, recommendation } = useCar()
  const {
    usedCarModelDetailsRes,
    usedCarRecommendations,
    usedCarNewRecommendations,
  } = useContext(UsedPdpDataLocalContext)

  const {
    dataCombinationOfCarRecomAndModelDetailDefaultCity,
    carVariantDetailsResDefaultCity,
    carRecommendationsResDefaultCity,
  } = useContext(PdpDataLocalContext)

  const router = useRouter()

  const [usedCarRecommendationList, setUsedCarRecommendationList] = useState([])

  const modelDetail =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity
  const variantDetail = carVariantDetails || carVariantDetailsResDefaultCity
  const carRecommendations =
    recommendation.length > 0
      ? recommendation
      : carRecommendationsResDefaultCity?.carRecommendations

  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const { funnelQuery } = useFunnelQueryData()

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const cheapestVariantData = React.useMemo(() => {
    const cheapestVariant = modelDetail?.variants
      .map((item: any) => item)
      .sort((a: any, b: any) => a.priceValue - b.priceValue)[0]
    return cheapestVariant
  }, [modelDetail])

  const trackEventMoengage = () => {
    if (!carModelDetails || !carVariantDetails) return

    const objData = {
      brand: modelDetail?.brand,
      model: modelDetail?.model,
      ...(funnelQuery.downPaymentAmount && {
        down_payment: funnelQuery.downPaymentAmount,
      }),
      ...(funnelQuery.tenure &&
        funnelQuery.isDefaultTenureChanged && {
          loan_tenure: funnelQuery.tenure,
        }),
      car_seat: variantDetail.variantDetail.carSeats,
      body_type: variantDetail?.variantDetail.bodyType
        ? variantDetail?.variantDetail.bodyType
        : '-',
    }
    setTrackEventMoEngage('view_variant_list', objData)
  }

  useEffect(() => {
    const temp = usedCarRecommendations.filter(
      (data: any) => data.id !== usedCarModelDetailsRes.carId,
    )

    temp.slice(0, 10)

    setUsedCarRecommendationList(temp.slice(0, 10))
  }, [usedCarRecommendations, usedCarModelDetailsRes])

  useEffect(() => {
    if (carModelDetails && cheapestVariantData && flag === TrackerFlag.Init) {
      trackEventMoengage()
      setFlag(TrackerFlag.Sent)
    }
  }, [carModelDetails, cheapestVariantData])

  const toLeads = useRef<null | HTMLDivElement>(null)
  const scrollToLeads = () => {
    toLeads.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <DescriptionSection scrollToLeads={scrollToLeads} />
      </div>
      <div ref={toLeads} className={styles.reference} id="leads-form"></div>
      <LeadsFormUsedCar />
      <div className={styles.wrapper}>
        {usedCarNewRecommendations?.length > 0 && (
          <NewCarRecommendations
            carRecommendationList={usedCarNewRecommendations}
            title="Rekomendasi Mobil Baru"
            onClick={() => {
              return
            }}
            selectedCity={'Jakarta Pusat'}
            additionalContainerStyle={styles.recommendationAdditionalStyle}
          />
        )}
      </div>
      {usedCarRecommendationList?.length > 0 && (
        <UsedCarRecommendations
          usedCarRecommendationList={usedCarRecommendationList}
          title="Beli Mobil Bekas Berkualitas"
          onClick={() => {
            scrollToLeads()
          }}
          additionalContainerStyle={styles.recommendationAdditionalStyle}
        />
      )}
    </div>
  )
}
