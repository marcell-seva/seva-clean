import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
} from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { DownOutlined } from 'components/atoms'
import {
  CarModelDetailsResponse,
  CarVariantDetails,
  CityOtrOption,
} from 'utils/types'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import {
  availableList,
  availableListColors,
} from '../VariantColor/AvailableListColors'
import { trimLastChar } from 'utils/urlUtils'
import { hundred, million, ten } from 'utils/helpers/const'
import {
  formatPriceNumber,
  formatPriceNumberThousandDivisor,
} from 'utils/numberUtils/numberUtils'
import { articleDateFormat } from 'utils/handler/date'
import {
  trackCarVariantDescriptionCollapseClick,
  trackCarVariantDescriptionExpandClick,
} from 'helpers/amplitude/seva20Tracking'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useCar } from 'services/context/carContext'
import { formatNumberByLocalization } from 'utils/handler/rupiah'

type DescriptionProps = {
  title: string
  description?: string
  className?: string
  carModel?: CarModelDetailsResponse
  carVariant?: CarVariantDetails
  tab: string
}

export const Description = ({
  title,
  className,
  carModel,
  carVariant,
  tab,
}: DescriptionProps) => {
  const [open, setOpen] = useState(false)
  const [expandable, setExpandable] = useState(true)
  const descRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const [colorsOptions, setColorsOptions] = useState<any[]>([])
  const [transmissionOptions, setTransmissionOptions] = useState<string[]>([])
  const [carWidth, setCarWidth] = useState(0)
  const [carHeight, setCarHeight] = useState(0)
  const [carLength, setCarLength] = useState(0)
  const { carModelDetails, recommendation } = useCar()
  const { carModelDetailsResDefaultCity, carRecommendationsResDefaultCity } =
    useContext(PdpDataLocalContext)
  const modelDetailData = carModelDetails || carModelDetailsResDefaultCity
  const recommendationsDetailData =
    recommendation.length !== 0
      ? recommendation
      : carRecommendationsResDefaultCity.carRecommendations
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const checkTextOverflow = () => {
    const curHeight = descRef.current.clientHeight
    const curScrollHeight = descRef.current.scrollHeight

    if (curHeight >= curScrollHeight) {
      return setExpandable(false)
    }

    setExpandable(true)
  }

  useLayoutEffect(() => {
    if (descRef.current?.scrollHeight) {
      checkTextOverflow()
    }
  }, [descRef.current?.scrollHeight])

  useEffect(() => {
    if (
      availableList.includes(trimLastChar(window.location.pathname)) ||
      availableList.includes(
        trimLastChar(window.location.pathname.replace('galeri', '')),
      )
    ) {
      if (window.location.pathname.includes('galeri')) {
        setColorsOptions(
          availableListColors.filter(
            (url) =>
              url.url ===
              trimLastChar(window.location.pathname.replace('galeri', '')),
          )[0].colors,
        )
      } else {
        setColorsOptions(
          availableListColors.filter(
            (url) => url.url === trimLastChar(window.location.pathname),
          )[0].colors,
        )
      }
    }
    if (carModel) {
      setTransmissionOptions(
        carModel.variants
          .map((item) => item.transmission)
          .filter((value, index, self) => self.indexOf(value) === index),
      )
    }
    if (recommendationsDetailData && recommendationsDetailData?.length > 0) {
      setCarHeight(
        recommendationsDetailData.filter(
          (car: any) => car.id === carModel?.id,
        )[0].height,
      )
      setCarLength(
        recommendationsDetailData.filter(
          (car: any) => car.id === carModel?.id,
        )[0].length,
      )
      setCarWidth(
        recommendationsDetailData.filter(
          (car: any) => car.id === carModel?.id,
        )[0].width,
      )
    }
  }, [])

  const getDataForAmplitude = () => {
    return {
      Car_Brand: modelDetailData?.brand ?? '',
      Car_Model: modelDetailData?.model ?? '',
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: window.location.href,
    }
  }

  const trackAmplitude = (value: boolean) => {
    if (value) {
      trackCarVariantDescriptionCollapseClick(getDataForAmplitude())
    } else {
      trackCarVariantDescriptionExpandClick(getDataForAmplitude())
    }
  }

  if (!carModel || !carVariant) return <></>
  return (
    <DescriptionSection className={className}>
      <TitleAndSubtitleSection>
        <DescriptionTitle>{title} </DescriptionTitle>
        {tab === 'summary' ? (
          <DescriptionContent ref={descRef} open={open}>
            {carModel?.brand + ' ' + carModel?.model} adalah mobil dengan{' '}
            {carVariant?.variantDetail.carSeats} Kursi{' '}
            {carVariant?.variantDetail.bodyType}{' '}
            {carModel.variants.length === 1
              ? 'yang tersedia dalam kisaran harga mulai dari ' +
                (carModel?.variants[0].priceValue.toString().length > 9
                  ? 'Rp ' +
                    formatPriceNumberThousandDivisor(
                      formatPriceNumber(carModel?.variants[0].priceValue),
                      LanguageCode.id,
                    )
                  : 'Rp ' +
                    formatNumberByLocalization(
                      carModel?.variants[0].priceValue,
                      LanguageCode.id,
                      1000000,
                      1,
                    ))
              : 'yang tersedia dalam kisaran harga ' +
                (carModel?.variants[0].priceValue.toString().length > 9
                  ? 'Rp ' +
                    formatPriceNumberThousandDivisor(
                      formatPriceNumber(carModel?.variants[0].priceValue),
                      LanguageCode.id,
                    ) +
                    ' - ' +
                    formatPriceNumberThousandDivisor(
                      formatPriceNumber(
                        carModel?.variants[carModel?.variants.length - 1]
                          .priceValue,
                      ),
                      LanguageCode.id,
                    )
                  : 'Rp ' +
                    formatNumberByLocalization(
                      carModel?.variants[0].priceValue,
                      LanguageCode.id,
                      1000000,
                      1,
                    ) +
                    ' - ' +
                    formatNumberByLocalization(
                      carModel?.variants[carModel?.variants.length - 1]
                        .priceValue,
                      LanguageCode.en,
                      1000000,
                      1,
                    ))}{' '}
            juta di Indonesia. Mobil ini tersedia dalam{' '}
            {colorsOptions.length > 0 &&
              `${colorsOptions.length}  pilihan warna, `}
            {carModel.variants.length} tipe mobil, dan{' '}
            {transmissionOptions.length > 1
              ? `${transmissionOptions.length} opsi
        transmisi: ${transmissionOptions[0]} dan ${transmissionOptions[1]} `
              : `${transmissionOptions.length} opsi transmisi ${transmissionOptions[0]} `}
            di Indonesia. Mobil ini memiliki dimensi sebagai berikut:{' '}
            {carLength} mm L x {carWidth} mm W x {carHeight} mm H. Cicilan
            kredit mobil {`${carModel.brand} ${carModel.model}`} dimulai dari Rp{' '}
            {getMinimumMonthlyInstallment(
              carModel.variants,
              LanguageCode.en,
              million,
              hundred,
            )}{' '}
            juta selama {carModel.variants[0].tenure * 12 + ' '}
            bulan.
          </DescriptionContent>
        ) : tab === 'price' ? (
          <DescriptionContent ref={descRef} open={open}>
            Harga mobil {carModel?.brand + ' ' + carModel?.model} ini mulai dari
            Rp{' '}
            {carModel?.variants[0].priceValue.toString().length > 9
              ? formatPriceNumberThousandDivisor(
                  formatPriceNumber(carModel?.variants[0].priceValue),
                  LanguageCode.id,
                )
              : formatNumberByLocalization(
                  carModel.variants[0].priceValue,
                  LanguageCode.id,
                  million,
                  ten,
                )}{' '}
            juta untuk varian termurahnya. Varian termahal{' '}
            {carModel?.brand + ' ' + carModel?.model}, yakni varian{' '}
            {carModel.variants[carModel.variants.length - 1].name} memiliki
            harga Rp{' '}
            {carModel?.variants[0].priceValue.toString().length > 9
              ? formatPriceNumberThousandDivisor(
                  formatPriceNumber(
                    carModel?.variants[carModel.variants.length - 1].priceValue,
                  ),
                  LanguageCode.id,
                )
              : formatNumberByLocalization(
                  carModel.variants[carModel.variants.length - 1].priceValue,
                  LanguageCode.en,
                  million,
                  ten,
                )}{' '}
            juta. Dapatkan promo mobil menarik dari SEVA, dengan cara hubungi
            kami secepatnya melalui website ini.
          </DescriptionContent>
        ) : tab === 'credit' ? (
          <DescriptionContent ref={descRef} open={open}>
            Mobil {carModel?.brand + ' ' + carModel?.model} ini juga bisa anda
            dapatkan secara kredit melalui platform SEVA. Anda dapat memilih DP
            dan cicilan bulanan sesuai keinginan anda. Hari ini,{' '}
            {articleDateFormat(new Date(Date.now()), LanguageCode.id)},{' '}
            {carModel.model + ' '}
            tersedia dengan uang muka hanya Rp{' '}
            {getMinimumDp(
              carModel.variants,
              LanguageCode.en,
              million,
              hundred,
            )}{' '}
            juta dan cicilan Rp{' '}
            {getMinimumMonthlyInstallment(
              carModel.variants,
              LanguageCode.en,
              million,
              hundred,
            )}{' '}
            juta selama {carModel.variants[0].tenure * 12} bulan.
          </DescriptionContent>
        ) : tab === 'spesification' ? (
          <DescriptionContent ref={descRef} open={open}>
            {carModel.brand} menghadirkan {carModel.model} dalam beberapa model
            varian serta exterior dan interior yang modern. Mobil{' '}
            {carModel.model} tersedia dalam {carModel.variants.length} varian
            dan ditenagai mesin {carVariant.variantDetail.fuelType} berkapasitas{' '}
            {carVariant.variantDetail.engineCapacity} cc. {carModel.model}{' '}
            tersedia dengan transmisi{' '}
            {transmissionOptions.length > 1
              ? `${transmissionOptions[0]} dan ${
                  transmissionOptions[1] === undefined &&
                  transmissionOptions.length > 1
                    ? transmissionOptions[2]
                    : transmissionOptions[1]
                }`
              : `${transmissionOptions[0]}`}
            .
          </DescriptionContent>
        ) : tab === 'gallery' ? (
          <DescriptionContent ref={descRef} open={open}>
            Temukan berbagai foto eksterior dan interior {carModel.model},
            eksklusif hanya di SEVA.
          </DescriptionContent>
        ) : (
          <> </>
        )}
      </TitleAndSubtitleSection>
      {expandable && (
        <ExpandAction
          open={open}
          onClick={() => {
            trackAmplitude(open)
            setOpen(!open)
          }}
        />
      )}
    </DescriptionSection>
  )
}

type ExpandActionProps = {
  open: boolean
  onClick: () => void
  className?: string
  arrowColor?: string
  lineHeight?: string
}

export const ExpandAction = ({
  open,
  onClick,
  className,
  arrowColor,
  lineHeight = '16px',
}: ExpandActionProps) => {
  return (
    <BacaSelengkapnyaWrapper className={className}>
      <label onClick={onClick} style={{ lineHeight: lineHeight }}>
        {!open ? 'Baca Selengkapnya' : 'Tutup'}
      </label>
      <StyledIconWrapper open={open} onClick={onClick}>
        <DownOutlined
          width={16}
          height={6}
          color={arrowColor || colors.primaryBlue}
          marginBottom={'2px'}
        />
      </StyledIconWrapper>
    </BacaSelengkapnyaWrapper>
  )
}

const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    width: 1040px;
    margin: 0 auto;
    flex-direction: row;
  }
`

const ClosedStyle = css`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 1025px) {
    -webkit-line-clamp: 1;
  }
`

const DescriptionContent = styled.div<{ open: boolean }>`
  font-family: var(--open-sans);
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;

  color: ${colors.label};
  height: ${({ open }) => (open ? '100%' : '48px')};
  overflow: hidden;
  transition: all 250ms ease-in-out;
  width: 100%;
  ${({ open }) => (open ? OpenedStyle : ClosedStyle)};
  margin-bottom: 14px;

  @media (min-width: 1025px) {
    max-width: 853px;
    height: ${({ open }) => (open ? '100%' : '18px')};
    font-size: 14px;
    line-height: ${({ open }) => (open ? '19px' : '16px')};
  }
`

const TitleAndSubtitleSection = styled.div`
  display: flex;
  flex-direction: column;
`

const DescriptionTitle = styled.span`
  font-family: var(--kanyon-medium);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 4px;

  @media (min-width: 1025px) {
    font-size: 16px;
    margin-bottom: 9px;
  }
`

const BacaSelengkapnyaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;

  label {
    font-family: var(--kanyon-bold);
    font-size: 12px;
    line-height: 16px;
    color: ${colors.primaryBlue};
  }

  @media (min-width: 1025px) {
    gap: 18px;
    margin-top: 30px;
    flex: 1;
    align-items: flex-start;
    justify-content: flex-end;

    label {
      font-size: 14px;
      cursor: pointer;
    }
  }
`

const StyledIconWrapper = styled.div<{ open: boolean }>`
  ${({ open }) => open && rotate}
  transition: transform 150ms ease;
  cursor: pointer;
  padding-bottom: 2px;
  cursor: pointer;
`

const OpenedStyle = css`
  display: unset;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
  overflow: unset;
  text-overflow: unset;
`

const rotate = css`
  transform: rotate(180deg);
`
