import React, { useEffect, useMemo, useState } from 'react'
import styles from 'styles/saas/components/organism/summary.module.scss'

import {
  CarVariantRecommendation,
  SpecialRateListType,
  VideoDataType,
} from 'utils/types/utils'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { availableList, availableListColors } from 'config/AvailableListColors'
import { getMinimumMonthlyInstallment } from 'utils/carModelUtils/carModelUtils'
import { hundred, million, ten } from 'const/const'
import {
  InstallmentTypeOptions,
  LanguageCode,
  LocalStorageKey,
  TrackerFlag,
} from 'utils/models/models'
import { rupiah } from 'utils/handler/rupiah'
import { Info, VideoItemCard } from 'components/molecules'
import { Gap, IconPlay } from 'components/atoms'
// import promoBannerTradeIn from 'assets/illustration/PromoTradeIn.webp'
import Variants from '../variants'
import PopupVariantDetail from 'components/organism/popupVariantDetail/index'
import { Faq } from 'components/molecules/section/faq'
import { TrackVariantList } from 'utils/types/tracker'
import { CityOtrOption } from 'utils/types/utils'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { trackNewVariantListPageView } from 'helpers/amplitude/seva20Tracking'
import { formatNumberByLocalization } from 'utils/numberUtils/numberUtils'
import { Modal } from 'antd'
import { LeadsFormSecondary } from 'components/organism'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import PromoSection from 'components/organism/promoSection/index'
import { getNewFunnelLoanSpecialRate } from 'services/newFunnel'
import elementId from 'helpers/elementIds'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'

type RingkasanProps = {
  setPromoName: (value: string) => void
  onButtonClick: (value: boolean) => void
  videoData: VideoDataType
  setSelectedTabValue: (value: string) => void
  setVariantIdFuelRatio: (value: string) => void
  variantFuelRatio: string | undefined
}

const formatShortPrice = (price: number) => {
  return formatNumberByLocalization(price, LanguageCode.id, million, ten)
}

export const SummaryTab = ({
  setPromoName,
  onButtonClick,
  videoData,
  setSelectedTabValue,
  setVariantIdFuelRatio,
  variantFuelRatio,
}: RingkasanProps) => {
  const { carModelDetails } = useContextCarModelDetails()
  const { carVariantDetails } = useContextCarVariantDetails()
  const { recommendations } = useContextRecommendations()

  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const { funnelQuery } = useFunnelQueryData()

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const [cheapestVariantData, setCheapestVariantData] =
    useState<CarVariantRecommendation>()

  const [info, setInfo] = useState<any>({})
  const [openModal, setOpenModal] = useState(false)
  const [variantView, setVariantView] = useState<CarVariantRecommendation>()
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0)

  const sortedCarModelVariant = useMemo(() => {
    return (
      carModelDetails?.variants.sort(function (a, b) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [carModelDetails])

  useEffect(() => {
    if (carModelDetails && carVariantDetails && recommendations) {
      findCheapestVariant(carModelDetails)
      getSummaryInfo()
    }
  }, [carModelDetails, carVariantDetails, recommendations])

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
        const result = res.data.data.reverse()
        const selectedLoanInitialValue =
          result.filter((item: SpecialRateListType) => item.tenure === 5)[0] ??
          null
        setMonthlyInstallment(selectedLoanInitialValue.installment)
      })
      .catch(() => {
        // TODO add error toast
      })
  }
  const findCheapestVariant = (payload: any) => {
    const cheapestVariant = payload.variants
      .map((item: any) => item)
      .sort((a: any, b: any) => a.priceValue - b.priceValue)[0]
    setCheapestVariantData(cheapestVariant)
  }

  const trackEventMoengage = () => {
    if (!carModelDetails || !carVariantDetails) return

    const objData = {
      brand: carModelDetails?.brand,
      model: carModelDetails?.model,
      ...(funnelQuery.downPaymentAmount && {
        down_payment: funnelQuery.downPaymentAmount,
      }),
      ...(funnelQuery.tenure &&
        funnelQuery.isDefaultTenureChanged && {
          loan_tenure: funnelQuery.tenure,
        }),
      car_seat: carVariantDetails.variantDetail.carSeats,
      body_type: carVariantDetails?.variantDetail.bodyType
        ? carVariantDetails?.variantDetail.bodyType
        : '-',
    }
    setTrackEventMoEngage('view_variant_list', objData)
  }

  useEffect(() => {
    if (carModelDetails && cheapestVariantData && flag === TrackerFlag.Init) {
      sendAmplitude()
      trackEventMoengage()
      setFlag(TrackerFlag.Sent)
    }
  }, [carModelDetails, cheapestVariantData])
  useEffect(() => {
    if (variantView) {
      setVariantIdFuelRatio(variantView.id)
    }
  }, [variantView])

  const sendAmplitude = (): void => {
    const data: TrackVariantList = {
      Car_Brand: carModelDetails?.brand || '',
      Car_Model: carModelDetails?.model || '',
      DP: `Rp${formatNumberByLocalization(
        sortedCarModelVariant[0].dpAmount,
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Monthly_Installment: `Rp${formatNumberByLocalization(
        sortedCarModelVariant[0].monthlyInstallment,
        LanguageCode.id,
        1000000,
        10,
      )} jt/bln`,
      Tenure: `${sortedCarModelVariant[0].tenure} Tahun`,
      City: cityOtr?.cityName || '',
    }
    trackNewVariantListPageView(data)
  }

  const getColorVariant = () => {
    const currentUrlPathName = window.location.pathname
    const splitedPath = currentUrlPathName.split('/')
    const carBrandModelUrl = `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`
    if (availableList.includes(carBrandModelUrl)) {
      const colorsTmp = availableListColors.filter(
        (url) => url.url === carBrandModelUrl,
      )[0].colors

      return colorsTmp.length
    }
  }

  const getSummaryInfo = () => {
    const brand = carModelDetails?.brand || ''
    const model = carModelDetails?.model || ''
    const type = carVariantDetails?.variantDetail.bodyType
    const seats = carVariantDetails?.variantDetail.carSeats
    const priceRange = getPriceRange(carModelDetails?.variants)
    const totalType = carModelDetails?.variants.length
    const color = getColorVariant()
    const dimenssion = getDimenssion(recommendations.carRecommendations)
    const credit = getCreditPrice(carModelDetails?.variants)
    const month = carModelDetails!.variants[0].tenure * 12
    const transmissionType = getTransmissionType(
      carModelDetails?.variants,
    ).length
    const transmissionDetail = getTransmissionType(
      carModelDetails?.variants,
    ).join(' dan ')
    const CarVariants = carModelDetails?.variants
    const dpAmount = carModelDetails?.variants.sort(
      (a: any, b: any) => a.priceValue - b.priceValue,
    )[0].dpAmount
    const monthlyInstallment = carModelDetails?.variants.sort(
      (a: any, b: any) => a.priceValue - b.priceValue,
    )[0].monthlyInstallment
    const priceRangeFaq = getPriceRangeFaq(
      carModelDetails?.variants.sort(
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

    setInfo(info)
  }
  const dimension = `${info.length} x ${info.width} x ${info.height} mm`

  const getCreditPrice = (payload: any) => {
    return getMinimumMonthlyInstallment(
      payload,
      LanguageCode.en,
      million,
      hundred,
    )
  }

  const getDimenssion = (payload: any) => {
    return payload?.filter((car: any) => car.id === carModelDetails?.id)[0]
  }

  const getTransmissionType = (payload: any) => {
    const type: Array<string> = payload
      .map((item: any) => item.transmission)
      .filter(
        (value: any, index: number, self: any) => self.indexOf(value) === index,
      )

    return type
  }
  const getPriceRange = (payload: any) => {
    const variantLength = payload.length
    if (variantLength === 1) {
      const price: string = rupiah(payload[0].priceValue)
      return `yang tersedia dalam kisaran harga mulai dari ${price}`
    } else {
      const lowerPrice = rupiah(payload[0].priceValue)
      const upperPrice = rupiah(payload[variantLength - 1].priceValue)

      return `yang tersedia dalam kisaran harga ${lowerPrice} - ${upperPrice} juta`
    }
  }

  const getPriceRangeFaq = (payload: any) => {
    const variantLength = payload.length
    if (variantLength === 1) {
      const price: string = rupiah(payload[0].priceValue)
      return `${price}`
    } else {
      const lowerPrice = rupiah(payload[0].priceValue)
      const upperPrice = rupiah(payload[variantLength - 1].priceValue)

      return `${lowerPrice} - ${upperPrice}`
    }
  }
  const getInfoText = (): string => {
    return `${info.brand} ${info.model} adalah mobil dengan ${info.seats} Kursi ${info.type} ${info.priceRange} di Indonesia. Mobil ini tersedia dalam  ${info.color} pilihan warna, ${info.totalType} tipe mobil, dan ${info.transmissionType} opsi transmisi: ${info.transmissionDetail} di Indonesia. Mobil ini memiliki dimensi sebagai berikut: ${info.length} mm L x ${info.width} mm W x ${info.height} mm H. Cicilan kredit mobil ${info.brand} ${info.model} dimulai dari Rp ${info.credit} juta selama ${info.month} bulan. `
  }

  const getTipsText = (): string => {
    const currentYear: number = new Date().getFullYear()
    return `Saat ini membeli mobil baru bukanlah hal buruk. Di tahun ${currentYear} data menunjukan bahwa pembelian mobil baru mengalami peningkatan yang cukup signifikan,
   ini artinya mobil baru masih menjadi pilihan banyak orang. Jika kamu berniat membeli mobil baru, mobil baru ${info.brand} ${info.model}
  Membeli mobil baru sama halnya seperti membeli mobil bekas, kita juga harus memperhatikan perawatannya, karena mobil yang rajin perawatan tentu akan bertahan untuk jangka waktu yang panjang. Perawatan yang bisa dilakukan untuk mobil baru ${info.brand} ${info.model}
    adalah pergantian oli, filter AC, periksa tekanan ban, serta mencuci mobil. `
  }
  const listFaq = [
    {
      question: `Berapa Cicilan / Kredit Bulanan ${info.brand} ${info.model} Terendah?`,
      answer: ` Cicilan / kredit bulanan terendah untuk  dimulai dari Rp ${formatShortPrice(
        info.monthlyInstallment || 0,
      )} juta untuk  ${
        info.carVariants && info.carVariants.length > 0
          ? info.carVariants[0].tenure * 12
          : 0
      } bulan dengan DP Rp ${formatShortPrice(info.dpAmount)} juta.`,
      testid: elementId.PDP.FAQ.CicilanMobil,
    },
    {
      question: `Berapa Harga ${carModelDetails?.brand} ${carModelDetails?.model}?`,
      answer: `Harga ${carModelDetails?.brand} ${carModelDetails?.model} dimulai dari kisaran harga ${info.priceRangeFaq} juta.`,
      testid: elementId.PDP.FAQ.HargaMobil,
    },
    {
      question: `Berapa Panjang Mobil ${carModelDetails?.brand} ${carModelDetails?.model}?`,
      answer: `Panjang dimensi ${carModelDetails?.brand} ${carModelDetails?.model} adalah ${info.length} mm dan lebarnya ${info.width} mm, dan tinggi ${info.height}  mm.`,
      testid: elementId.PDP.FAQ.PanjangMobil,
    },
  ]

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand,
      Car_Model: carModelDetails?.model,
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: window.location.href,
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <PromoSection
          setPromoName={setPromoName}
          dataForAmplitude={getDataForAmplitude()}
          onButtonClick={onButtonClick}
          cheapestVariantData={cheapestVariantData}
          info={info}
          onPage={'VariantListPage'}
          setSelectedTabValue={setSelectedTabValue}
        />
        {carModelDetails && (
          <Variants
            carModelDetails={carModelDetails}
            setOpenModal={setOpenModal}
            setViewVariant={setVariantView}
            setSelectedTabValue={setSelectedTabValue}
            onCardClick={(value) => getMonthlyInstallment(value)}
          />
        )}
        {variantView && (
          <Modal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            title="Detail Mobil"
            footer={null}
            className="custom-modal"
            width={343}
            style={{ borderRadius: '8px' }}
          >
            <PopupVariantDetail
              carVariant={variantView}
              dimension={dimension}
              fuelRatio={variantFuelRatio}
              monthlyInstallment={monthlyInstallment}
            />
          </Modal>
        )}

        {videoData.videoId.length > 0 ? (
          <>
            <div className={styles.videoSectionCard}>
              <div className={styles.videoSectionHeader}>
                <IconPlay width={24} height={24} color="#B4231E" />
                <h3
                  className={styles.videoSectionHeaderText}
                  data-testid={elementId.Text + 'video-ulasan'}
                >
                  Video Ulasan
                </h3>
              </div>
              <VideoItemCard data={videoData} />
            </div>
            <div className={styles.gap} />
          </>
        ) : null}
        <Gap height={24} />
        <Faq
          isWithIcon
          headingText={`Pertanyaan yang Sering Diajukan`}
          descText={listFaq}
        />
        <Gap height={32} />
      </div>
      <LeadsFormSecondary />
      <div className={styles.wrapper}>
        <Gap height={24} />
        <Info isWithIcon headingText="Tentang Mobil" descText={getInfoText()} />
        <div className={styles.gap} />
        <Info
          headingText={`Membeli Mobil ${info.brand} ${info.model}? Seperti Ini Cara Perawatannya!`}
          descText={getTipsText()}
        />
      </div>
    </div>
  )
}
