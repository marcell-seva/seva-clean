import { AdditionalInfoCarVariant } from 'components/molecules/TitleHeader/TitleHeader'
import { client, million, ten } from 'utils/helpers/const'
import {
  trackCarVariantPricelistClick,
  trackCarVariantPricelistClickCta,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import React, { useContext, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { variantListUrl } from 'utils/helpers/routes'
import { api } from 'services/api'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { formatSortPrice } from 'utils/numberUtils/numberUtils'
import { CarVariantRecommendation, CityOtrOption } from 'utils/types'
import { useCar } from 'services/context/carContext'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'

export const PriceList = () => {
  const router = useRouter()
  const { model, brand, slug } = router.query
  const tab = Array.isArray(slug) ? slug[0] : undefined
  const { carModelDetails, saveCarVariantDetails } = useCar()
  const { dataCombinationOfCarRecomAndModelDetailDefaultCity } =
    useContext(PdpDataLocalContext)
  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity
  const [indexOpen, setIndexOpen] = useState<number | null>()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const formatPrice = (price: number) => {
    return formatNumberByLocalization(price, LanguageCode.id, million, ten)
  }

  const getDataForAmplitude = (item: CarVariantRecommendation) => {
    return {
      Car_Brand: modelDetailData?.brand ?? '',
      Car_Model: modelDetailData?.model ?? '',
      City: cityOtr?.cityName || 'null',
      OTR: `Rp${replacePriceSeparatorByLocalization(
        item.priceValue,
        LanguageCode.id,
      )}`,
      DP: `Rp${formatNumberByLocalization(
        item.dpAmount,
        LanguageCode.en,
        million,
        ten,
      )} Juta`,
      Cicilan: `Rp${formatNumberByLocalization(
        item.monthlyInstallment,
        LanguageCode.en,
        million,
        ten,
      )} jt/bln`,
      Tenure: String(item.tenure),
      Car_Variant: item.name,
      Page_Origination_URL: client ? window.location.href : '',
    }
  }

  const onChooseItem = (item: CarVariantRecommendation, index: number) => {
    trackCarVariantPricelistClick(getDataForAmplitude(item))
    if ((indexOpen !== null || indexOpen === 0) && indexOpen !== index) {
      setIndexOpen(null)
      return setTimeout(() => {
        setIndexOpen(index)
      }, 200)
    }

    if (index === indexOpen) {
      return setIndexOpen(null)
    }

    return setIndexOpen(index)
  }

  const getCityParam = () => {
    return `?city=${cityOtr?.cityCode ?? 'jakarta'}&cityId=${
      cityOtr?.cityId ?? '118'
    }`
  }

  const navigateToCreditTab = (item: CarVariantRecommendation) => {
    trackCarVariantPricelistClickCta(getDataForAmplitude(item))
    api.getCarVariantDetails(item.id, getCityParam()).then((result3: any) => {
      if (result3.variantDetail.priceValue != null) {
        saveCarVariantDetails(result3)
      }
    })

    window.location.href =
      variantListUrl
        .replace(':brand', (brand as string) ?? '')
        .replace(':model', (model as string) ?? '')
        .replace(':tab', 'kredit') + `selectedVariantId=${item.id}`
  }

  return (
    <PriceListWrapper>
      {modelDetailData.variants
        .filter((item: any) => item.name)
        .sort(function (a: any, b: any) {
          return a.priceValue - b.priceValue
        })
        .map((item: any, index: number) => (
          <>
            <PriceBox
              key={item.id}
              open={indexOpen === index}
              onClick={() => isMobile && onChooseItem(item, index)}
            >
              {isMobile ? (
                <>
                  <CarPriceWrapper open={indexOpen === index}>
                    <CarModelVariant>
                      <CarModelVariantText bold={indexOpen === index}>
                        {item.name}
                      </CarModelVariantText>
                    </CarModelVariant>
                    <CarPrice>
                      Rp{' '}
                      {replacePriceSeparatorByLocalization(
                        item.priceValue,
                        LanguageCode.id,
                      )}
                      ,-
                    </CarPrice>
                  </CarPriceWrapper>
                  <CarInfoVariant>
                    <InfoVariantText>
                      Cicilan per bulan {formatPrice(item.monthlyInstallment)}{' '}
                      jt
                    </InfoVariantText>
                    <InfoVariantText>
                      DP {formatPrice(item.dpAmount)} jt
                    </InfoVariantText>
                    <InfoVariantText>Tenor {item.tenure} tahun</InfoVariantText>
                  </CarInfoVariant>
                </>
              ) : (
                <>
                  <CarPriceWrapper>
                    <CarVariantName>{item.name}</CarVariantName>
                    <CarPriceInfoWrapper>
                      <CarPrice>
                        Rp{' '}
                        {replacePriceSeparatorByLocalization(
                          item.priceValue,
                          LanguageCode.id,
                        )}
                        ,-
                      </CarPrice>
                      <StyledAdditionalInfoCarVariant
                        installment={formatSortPrice(item.monthlyInstallment)}
                        dp={formatSortPrice(item.dpAmount)}
                        tenure={item.tenure}
                      />
                    </CarPriceInfoWrapper>
                  </CarPriceWrapper>
                  <HitungCicilanButton
                    onClick={() => navigateToCreditTab(item)}
                  >
                    <HitungCicilanText>Hitung Cicilan</HitungCicilanText>
                  </HitungCicilanButton>
                </>
              )}
            </PriceBox>
            {indexOpen === index && (
              <HitungCicilanMobileButton
                key={index}
                onClick={() => navigateToCreditTab(item)}
              >
                Hitung Cicilan
              </HitungCicilanMobileButton>
            )}
          </>
        ))}
    </PriceListWrapper>
  )
}

const PriceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-bottom: 35px;

  @media (min-width: 1025px) {
    gap: 24px;
    width: 1040px;
    margin: 0 auto;
  }
`

const PriceBox = styled.div<{ open: boolean }>`
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  border-radius: 8px;
  background-color: ${colors.white};
  overflow: hidden;
  height: ${({ open }) => (open ? '110px' : '47px')};
  transition: height 500ms ease;

  @media (min-width: 1025px) {
    height: 81px;
    display: flex;
    align-items: center;
    width: 100%;
  }
`

const CarPriceWrapper = styled.div<{ open?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 12px;
  justify-content: space-between;
  height: ${(open) => (open ? '47px' : '100%')};
  ${({ open }) =>
    open &&
    `
    background-color: ${colors.primarySkyBlue10}
  `};

  @media (min-width: 1025px) {
    padding: 0;
    width: 100%;
  }
`

const CarVariantName = styled.span`
  font-family: var(--kanyon-medium);
  font-size: 16px;
  line-height: 20px;
  color: ${colors.body2};
  margin-left: 32px;
`

const CarPriceInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 37px;
  width: 52%;
`

const StyledAdditionalInfoCarVariant = styled(AdditionalInfoCarVariant)`
  margin-bottom: 0;
`

const CarModelVariant = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 190px;
`

const CarModelVariantText = styled.span<{ bold?: boolean }>`
  font-family: ${({ bold }) =>
    bold ? 'var(--kanyon-bold)' : 'var(--kanyon-medium)'};
  font-size: 12px;
  line-height: 14px;
  color: ${colors.primaryDarkBlue};
`

const CarPrice = styled.span`
  font-family: var(--kanyon-bold);

  @media (max-width: 1024px) {
    width: 110px;
    font-size: 12px;
    line-height: 16px;

    color: ${colors.primaryDarkBlue};
  }

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 16px;
    color: ${colors.body2};
    margin-right: 72px;
    width: 100%;
  }
`

const CarInfoVariant = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 7px 12px 12px;
`

const InfoVariantText = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: ${colors.primaryDarkBlue};
`

const HitungCicilanButton = styled.div`
  background-color: ${colors.primaryBlue};
  height: 100%;
  width: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const HitungCicilanText = styled.span`
  font-family: var(--kanyon-bold);
  font-size: 16px;
  line-height: 24px;
  color: ${colors.white};
  text-align: center;
`

const HitungCicilanMobileButton = styled.div`
  width: 100%;
  height: 30px;
  background: ${colors.primaryBlue};
  padding: 0 12px;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  border-radius: 8px;

  display: flex;
  align-items: center;

  color: ${colors.white};
  font-family: var(--kanyon-bold);
  font-size: 12px;
`
