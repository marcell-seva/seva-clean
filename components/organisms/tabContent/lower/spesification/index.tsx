import React, { useEffect, useMemo, useState } from 'react'
import styles from 'styles/components/organisms/spesification.module.scss'
import { Gap, IconCar } from 'components/atoms'
import { TrackVariantList } from 'utils/types/tracker'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { formatNumberByLocalization, rupiah } from 'utils/handler/rupiah'
import { trackWebPDPSpecificationTab } from 'helpers/amplitude/seva20Tracking'
import { LeadsFormSecondary } from 'components/organisms'
import { Info } from 'components/molecules'
import { hundred, million } from 'utils/helpers/const'
import { getMinimumMonthlyInstallment } from 'utils/carModelUtils/carModelUtils'
import { availableList, availableListColors } from 'config/AvailableListColors'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { CarRecommendation, CityOtrOption } from 'utils/types/utils'
import { PropsField, PropsFieldDetail } from 'utils/types/props'
import { useCar } from 'services/context/carContext'
import { LocalStorageKey, LanguageCode } from 'utils/enum'
import { TrackerFlag } from 'utils/types/models'

interface SpecificationTabProps {
  isOTO?: boolean
}

export const SpecificationTab = ({ isOTO = false }: SpecificationTabProps) => {
  const { carModelDetails, carVariantDetails, recommendation } = useCar()
  const [spesification, setSpesification] = useState<any>()
  const headingText = 'Spesifikasi'
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { funnelQuery } = useFunnelQueryData()

  const getDimenssion = (payload: CarRecommendation[]) => {
    const defaultPayload = { width: 0, height: 0, length: 0 }
    if (payload.length === 0) return defaultPayload
    const modelPayload = payload.filter(
      (car: CarRecommendation) => car.id === carModelDetails?.id,
    )

    if (modelPayload.length === 0) return defaultPayload
    return modelPayload[0]
  }

  const sortedCarModelVariant = useMemo(() => {
    return (
      carModelDetails?.variants.sort(function (a, b) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [carModelDetails])

  const trackEventMoengage = () => {
    if (!carModelDetails || !carVariantDetails || recommendation.length === 0)
      return

    const objData = {
      brand: carModelDetails?.brand,
      model: carModelDetails?.model,
      brand_model: carModelDetails?.brand + ' ' + carModelDetails?.model,
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
    setTrackEventMoEngage('view_variant_list_specification_tab', objData)
  }

  useEffect(() => {
    if (carVariantDetails && carModelDetails) {
      const fuelType = carVariantDetails?.variantDetail.fuelType
      const engineCapacity = carVariantDetails?.variantDetail.engineCapacity
      const transmission = carVariantDetails?.variantDetail.transmission
      const seats = carVariantDetails!.variantDetail.carSeats
      const dimenssion = getDimenssion(recommendation)
      const brand = carModelDetails?.brand
      const model = carModelDetails?.model
      const priceRange = getPriceRange(carModelDetails?.variants)
      const totalType = carModelDetails?.variants.length
      const color = getColorVariant()
      const type = carVariantDetails?.variantDetail.bodyType
      const transmissionDetail = getTransmissionType(
        carModelDetails?.variants,
      ).join(' dan ')
      const transmissionType = getTransmissionType(
        carModelDetails?.variants,
      ).length
      const credit = getCreditPrice(carModelDetails?.variants)
      const month = carModelDetails!.variants[0].tenure * 12
      const fuelRatio = carVariantDetails.variantDetail.rasioBahanBakar

      const dataDimension: PropsFieldDetail = {
        title: 'Dimensi & Berat',
        data: [
          {
            key: 'Panjang x Lebar x Tinggi',
            value: `${dimenssion?.length} x ${dimenssion?.width} x ${dimenssion?.height} mm`,
          },
        ],
      }

      const dataInterior: PropsFieldDetail = {
        title: 'Interior',
        data: [{ key: 'Kapasitas', value: ` ${seats} kursi` }],
      }

      const dataTransmission: PropsFieldDetail = {
        title: 'Mesin & Transmisi',
        data: [
          { key: 'Bahan bakar', value: fuelType || 'Bensin' },
          {
            key: 'Kapasitas Mesin',
            value: `${engineCapacity} cc`,
          },
          {
            key: 'Jenis Transmisi',
            value: transmission || 'Manual',
          },
        ],
      }
      if (fuelRatio !== null && fuelRatio !== '-') {
        dataTransmission.data.push({
          key: 'Rasio Bahan Bakar',
          value: fuelRatio,
        })
      }
      const dataDetail = {
        dimension: dataDimension,
        interior: dataInterior,
        transmission: dataTransmission,
        model: model,
        type: type,
        brand: brand,
        seats: seats,
        priceRange: priceRange,
        totalType: totalType,
        color: color,
        transmissionDetail: transmissionDetail,
        credit: credit,
        month: month,
        width: dimenssion.width,
        height: dimenssion.height,
        length: dimenssion.length,
        transmissionType: transmissionType,
      }
      setSpesification(dataDetail)
      trackEventMoengage()
    }
  }, [carVariantDetails, carModelDetails, recommendation])

  useEffect(() => {
    if (carModelDetails && flag === TrackerFlag.Init) {
      sendAmplitude()
      setFlag(TrackerFlag.Sent)
    }
  }, [carModelDetails])

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
    trackWebPDPSpecificationTab(data)
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

  const getCreditPrice = (payload: any) => {
    return getMinimumMonthlyInstallment(
      payload,
      LanguageCode.en,
      million,
      hundred,
    )
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
      const upperPrice = rupiah(payload[0].priceValue)
      const lowerPrice = rupiah(payload[variantLength - 1].priceValue)

      return `yang tersedia dalam kisaran harga ${lowerPrice} - ${upperPrice} juta`
    }
  }

  const getInfoText = (): string => {
    return `${spesification?.brand} ${spesification?.model} adalah mobil dengan ${spesification?.seats} Kursi ${spesification?.type} ${spesification?.priceRange} di Indonesia. Mobil ini tersedia dalam  ${spesification?.color} pilihan warna, ${spesification?.totalType} tipe mobil, dan ${spesification?.transmissionType} opsi transmisi: ${spesification?.transmissionDetail} di Indonesia. Mobil ini memiliki dimensi sebagai berikut: ${spesification?.length} mm L x ${spesification?.width} mm W x ${spesification?.height} mm H. Cicilan kredit mobil ${spesification?.brand} ${spesification?.model} dimulai dari Rp ${spesification?.credit} juta selama ${spesification?.month} bulan. `
  }

  const getTipsText = (): string => {
    const currentYear: number = new Date().getFullYear()
    return `Saat ini membeli mobil baru bukanlah hal buruk. Di tahun ${currentYear} data menunjukan bahwa pembelian mobil baru mengalami peningkatan yang cukup signifikan,
   ini artinya mobil baru masih menjadi pilihan banyak orang. Jika kamu berniat membeli mobil baru, mobil baru ${spesification?.brand} ${spesification?.model}
  Membeli mobil baru sama halnya seperti membeli mobil bekas, kita juga harus memperhatikan perawatannya, karena mobil yang rajin perawatan tentu akan bertahan untuk jangka waktu yang panjang. Perawatan yang bisa dilakukan untuk mobil baru ${spesification?.brand} ${spesification?.model}
    adalah pergantian oli, filter AC, periksa tekanan ban, serta mencuci mobil. `
  }
  const Field: React.FC<PropsField> = ({
    title,
    data,
    isLastIndex,
  }: any): JSX.Element => {
    return (
      <div className={styles.field}>
        <p className={styles.textTitle}>{title}</p>
        {data?.map((item: any, key: number) => (
          <div className={styles.content} key={key}>
            <p className={styles.textKey}>{item.key}</p>
            <p className={styles.textValue}>{item.value}</p>
          </div>
        ))}
        {!isLastIndex && <div className={styles.separator} />}
      </div>
    )
  }

  const SpesificationSection = (): JSX.Element => (
    <div className={styles.spesification}>
      <div className={styles.heading}>
        <div className={styles.iconInfo}>
          <IconCar width={24} height={24} color="#B4231E" alt="SEVA Car Icon" />
        </div>
        <h3 className={styles.textHeading}>{headingText}</h3>
      </div>
      <div className={styles.detail}>
        <Field
          title={spesification?.dimension.title}
          data={spesification?.dimension.data}
        />
        <Field
          title={spesification?.interior.title}
          data={spesification?.interior.data}
        />
        <Field
          isLastIndex
          title={spesification?.transmission.title}
          data={spesification?.transmission.data}
        />
      </div>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      <SpesificationSection />
      <Gap height={32} />
      <LeadsFormSecondary isOTO={isOTO} />
      <div className={styles.wrapperSeoText}>
        <div className={styles.gap} />
        <Info isWithIcon headingText="Tentang Mobil" descText={getInfoText()} />
        <div className={styles.gap} />
        <Info
          headingText={`Membeli Mobil ${spesification?.brand} ${spesification?.model}? Seperti Ini Cara Perawatannya!`}
          descText={getTipsText()}
        />
        <div className={styles.gap} />
      </div>
    </div>
  )
}
