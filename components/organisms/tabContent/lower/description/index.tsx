import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import styles from 'styles/components/organisms/descriptionTab.module.scss'

import {
  CarVariantRecommendation,
  SpecialRateListType,
  UsedCarRecommendation,
  VariantDetail,
  VideoDataType,
} from 'utils/types/utils'
import { availableList, availableListColors } from 'config/AvailableListColors'
import { getMinimumMonthlyInstallment } from 'utils/carModelUtils/carModelUtils'
import { client, hundred, million, ten } from 'utils/helpers/const'

import { formatNumberByLocalization, rupiah } from 'utils/handler/rupiah'
import { Info, VideoItemCard } from 'components/molecules'
import { Gap, IconPlay } from 'components/atoms'
// import promoBannerTradeIn from '/public/revamp/illustration/PromoTradeIn.webp'
import Variants from '../variants'
import { Faq } from 'components/molecules/section/faq'
import { TrackVariantList } from 'utils/types/tracker'
import { CityOtrOption } from 'utils/types/utils'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LeadsFormUsedCar, UsedCarRecommendations } from 'components/organisms'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import DescriptionSection from 'components/organisms/descriptionSection/index'
import elementId from 'helpers/elementIds'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useRouter } from 'next/router'
import { useCar } from 'services/context/carContext'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { TrackerFlag, InstallmentTypeOptions } from 'utils/types/models'
import { getNewFunnelLoanSpecialRate } from 'utils/handler/funnel'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import dynamic from 'next/dynamic'
import { getUsedCarRecommendations } from 'services/api'
const Modal = dynamic(() => import('antd/lib/modal'), { ssr: false })

const PopupVariantDetail = dynamic(
  () => import('components/organisms/popupVariantDetail/index'),
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
  const { usedCarModelDetailsRes } = useContext(UsedPdpDataLocalContext)

  const {
    dataCombinationOfCarRecomAndModelDetailDefaultCity,
    carVariantDetailsResDefaultCity,
    carRecommendationsResDefaultCity,
  } = useContext(PdpDataLocalContext)

  const [usedCarRecommendations, setUsedCarRecommendations] = useState<
    UsedCarRecommendation[]
  >([])

  const router = useRouter()

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

  const [openModal, setOpenModal] = useState(false)
  const [variantView, setVariantView] = useState<CarVariantRecommendation>()
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0)

  const sortedCarModelVariant = useMemo(() => {
    return (
      modelDetail?.variants.sort(function (a: VariantDetail, b: VariantDetail) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [modelDetail])

  const fetchUsedCarRecommendations = () => {
    const params = new URLSearchParams()
    params.append('bodyType', usedCarModelDetailsRes.typeName)
    const response = getUsedCarRecommendations('', { params })

    response.then((data: any) => {
      setUsedCarRecommendations(data.data)
    })
  }

  useEffect(() => {
    fetchUsedCarRecommendations()
  }, [])

  const getMonthlyInstallment = (carVariantTmp: CarVariantRecommendation) => {
    getNewFunnelLoanSpecialRate({
      otr: carVariantTmp.priceValue - carVariantTmp.discount,
      dp: 20,
      dpAmount: carVariantTmp.priceValue * 0.2,
      city: cityOtr?.cityCode,
      discount: carVariantTmp.discount,
      rateType: 'REGULAR',
      angsuranType: InstallmentTypeOptions.ADDM,
    })
      .then((res) => {
        const result = res.data.reverse()
        const selectedLoanInitialValue =
          result.filter((item: SpecialRateListType) => item.tenure === 5)[0] ??
          null
        setMonthlyInstallment(selectedLoanInitialValue.installment)
      })
      .catch(() => {
        // TODO add error toast
      })
  }
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
    if (carModelDetails && cheapestVariantData && flag === TrackerFlag.Init) {
      trackEventMoengage()
      setFlag(TrackerFlag.Sent)
    }
  }, [carModelDetails, cheapestVariantData])

  //   useEffect(() => {
  //     if (variantView) {
  //       setVariantIdFuelRatio(variantView.id)
  //     }
  //   }, [variantView])

  const getColorVariant = () => {
    const model = router.query.model
    const brand = router.query.brand
    const currentUrlPathName = router.asPath
    const splitedPath = currentUrlPathName.split('/')
    const carBrandModelUrl = `/${splitedPath[1]}/${brand}/${model}`

    if (availableList.includes(carBrandModelUrl)) {
      const colorsTmp = availableListColors.filter(
        (url) => url.url === carBrandModelUrl,
      )[0].colors

      return colorsTmp.length
    }
  }

  const getPriceRange = (payload: any) => {
    if (payload) {
      const variantLength = payload?.length
      if (variantLength === 1) {
        const price: string = rupiah(payload[0].priceValue)
        return `yang tersedia dalam kisaran harga mulai dari ${price}`
      } else {
        const lowerPrice = rupiah(payload[0].priceValue)
        const upperPrice = rupiah(payload[variantLength - 1].priceValue)

        return `yang tersedia dalam kisaran harga ${lowerPrice} - ${upperPrice} juta`
      }
    }
  }

  const getDimenssion = (payload: any) => {
    return payload?.filter((car: any) => car.id === modelDetail?.id)[0]
  }

  const getTransmissionType = (payload: any) => {
    if (payload) {
      const type: Array<string> = payload
        .map((item: any) => item.transmission)
        .filter(
          (value: any, index: number, self: any) =>
            self.indexOf(value) === index,
        )

      return type
    }
  }

  const getPriceRangeFaq = (payload: any) => {
    if (payload) {
      const variantLength = payload?.length
      if (variantLength === 1) {
        const price: string = rupiah(payload[0].priceValue)
        return `${price}`
      } else {
        const lowerPrice = rupiah(payload[0].priceValue)
        const upperPrice = rupiah(payload[variantLength - 1].priceValue)

        return `${lowerPrice} - ${upperPrice}`
      }
    }
  }

  const getCreditPrice = (payload: any) => {
    return getMinimumMonthlyInstallment(
      payload,
      LanguageCode.en,
      million,
      hundred,
    )
  }

  const summaryInfo = React.useMemo(() => {
    const brand = modelDetail?.brand || ''
    const model = modelDetail?.model || ''
    const type = variantDetail?.variantDetail.bodyType
    const seats = variantDetail?.variantDetail.carSeats
    const priceRange = getPriceRange(modelDetail?.variants)
    const totalType = modelDetail?.variants.length
    const color = getColorVariant()
    const dimenssion = getDimenssion(carRecommendations)
    const credit = getCreditPrice(modelDetail?.variants)
    const month = modelDetail!?.variants[0].tenure * 12
    const transmissionType = getTransmissionType(modelDetail?.variants)?.length
    const transmissionDetail = getTransmissionType(modelDetail?.variants)?.join(
      ' dan ',
    )
    const CarVariants = modelDetail?.variants
    const dpAmount = modelDetail?.variants.sort(
      (a: any, b: any) => a.priceValue - b.priceValue,
    )[0].dpAmount
    const monthlyInstallment = modelDetail?.variants.sort(
      (a: any, b: any) => a.priceValue - b.priceValue,
    )[0].monthlyInstallment
    const priceRangeFaq = getPriceRangeFaq(
      modelDetail?.variants.sort(
        (a: any, b: any) => a.priceValue - b.priceValue,
      ),
    )

    const info = {
      brand,
      model,
      type,
      seats,
      priceRange,
      totalType,
      color,
      width: dimenssion?.width,
      height: dimenssion?.height,
      length: dimenssion?.length,
      credit,
      month,
      transmissionType,
      transmissionDetail,
      carVariants: CarVariants,
      carModelId: dimenssion?.id,
      lowestAssetPrice: dimenssion?.lowestAssetPrice,
      highestAssetPrice: dimenssion?.highestAssetPrice,
      dpAmount: dpAmount,
      monthlyInstallment: monthlyInstallment,
      priceRangeFaq,
    }

    return info
  }, [modelDetail, variantDetail, carRecommendations])

  const dimension = `${summaryInfo.length} x ${summaryInfo.width} x ${summaryInfo.height} mm`

  const getInfoText = (): string => {
    return `${summaryInfo.brand} ${summaryInfo.model} adalah mobil dengan ${summaryInfo.seats} Kursi ${summaryInfo.type} ${summaryInfo.priceRange} di Indonesia. Mobil ini tersedia dalam  ${summaryInfo.color} pilihan warna, ${summaryInfo.totalType} tipe mobil, dan ${summaryInfo.transmissionType} opsi transmisi: ${summaryInfo.transmissionDetail} di Indonesia. Mobil ini memiliki dimensi sebagai berikut: ${summaryInfo.length} mm L x ${summaryInfo.width} mm W x ${summaryInfo.height} mm H. Cicilan kredit mobil ${summaryInfo.brand} ${summaryInfo.model} dimulai dari Rp ${summaryInfo.credit} juta selama ${summaryInfo.month} bulan. `
  }

  const getTipsText = (): string => {
    const currentYear: number = new Date().getFullYear()
    return `Saat ini membeli mobil baru bukanlah hal buruk. Di tahun ${currentYear} data menunjukan bahwa pembelian mobil baru mengalami peningkatan yang cukup signifikan,
   ini artinya mobil baru masih menjadi pilihan banyak orang. Jika kamu berniat membeli mobil baru, mobil baru ${summaryInfo.brand} ${summaryInfo.model}
  Membeli mobil baru sama halnya seperti membeli mobil bekas, kita juga harus memperhatikan perawatannya, karena mobil yang rajin perawatan tentu akan bertahan untuk jangka waktu yang panjang. Perawatan yang bisa dilakukan untuk mobil baru ${summaryInfo.brand} ${summaryInfo.model}
    adalah pergantian oli, filter AC, periksa tekanan ban, serta mencuci mobil. `
  }
  const listFaq = [
    {
      question: `Berapa Cicilan / Kredit Bulanan ${summaryInfo.brand} ${summaryInfo.model} Terendah?`,
      answer: ` Cicilan / kredit bulanan terendah untuk ${summaryInfo.brand} ${
        summaryInfo.model
      } dimulai dari Rp ${formatShortPrice(
        summaryInfo.monthlyInstallment || 0,
      )} juta untuk  ${
        summaryInfo.carVariants && summaryInfo.carVariants.length > 0
          ? summaryInfo.carVariants[0].tenure * 12
          : 0
      } bulan dengan DP Rp ${formatShortPrice(summaryInfo.dpAmount)} juta.`,
      testid: elementId.PDP.FAQ.CicilanMobil,
    },
    {
      question: `Berapa Harga ${modelDetail?.brand} ${modelDetail?.model}?`,
      answer: `Harga ${modelDetail?.brand} ${modelDetail?.model} dimulai dari kisaran harga ${summaryInfo.priceRangeFaq} juta.`,
      testid: elementId.PDP.FAQ.HargaMobil,
    },
    {
      question: `Berapa Panjang Mobil ${modelDetail?.brand} ${modelDetail?.model}?`,
      answer: `Panjang dimensi ${modelDetail?.brand} ${modelDetail?.model} adalah ${summaryInfo.length} mm dan lebarnya ${summaryInfo.width} mm, dan tinggi ${summaryInfo.height}  mm.`,
      testid: elementId.PDP.FAQ.PanjangMobil,
    },
    {
      question: `Berapa kapasitas penumpang dalam ${modelDetail?.brand} ${modelDetail?.model}?`,
      answer: `${modelDetail?.brand} ${modelDetail?.model} biasanya hadir dalam opsi ${summaryInfo?.seats} kursi penumpang, dengan tempat duduk yang nyaman untuk penumpang di baris depan dan belakang.`,
      testid: elementId.PDP.FAQ.KapasitasMobil,
    },
    {
      question: `Apa jenis sistem transmisi yang digunakan oleh ${modelDetail?.brand} ${modelDetail?.model}?`,
      answer: `${modelDetail?.brand} ${modelDetail?.model} umumnya dilengkapi dengan transmisi ${summaryInfo.transmissionDetail}.`,
      testid: elementId.PDP.FAQ.TransmisiMobil,
    },
  ]

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
        <Gap height={24} />
        <Info isWithIcon headingText="Tentang Mobil" descText={getInfoText()} />
        <div className={styles.gap} />
        <Info
          headingText={`Membeli Mobil ${summaryInfo.brand} ${summaryInfo.model}? Seperti Ini Cara Perawatannya!`}
          descText={getTipsText()}
        />
      </div>
      <div className={styles.wrapper}>
        {usedCarRecommendations.length > 0 && (
          <UsedCarRecommendations
            usedCarRecommendationList={usedCarRecommendations}
            title="Beli Mobil Bekas Berkualitas"
            onClick={() => {
              return
            }}
            additionalContainerStyle={styles.recommendationAdditionalStyle}
          />
        )}
      </div>
    </div>
  )
}
