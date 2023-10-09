import React, { useContext, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { BrandIcon } from './BrandIcon'
import { formatSortPrice } from 'utils/numberUtils/numberUtils'
import { StickyButtonProps } from '../StickyButton/StickyButton'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { ActionButton } from '../HeaderActionButton/HeaderActionButton'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useCar } from 'services/context/carContext'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'

export function TitleHeader(props: StickyButtonProps) {
  const { carModelDetails } = useCar()
  const { dataCombinationOfCarRecomAndModelDetailDefaultCity } =
    useContext(PdpDataLocalContext)
  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const sortCarModelVariant = useMemo(() => {
    return (
      modelDetailData?.variants.sort(function (a: any, b: any) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [modelDetailData])

  const carOtrPrice = useMemo(() => {
    return sortCarModelVariant.length > 0
      ? replacePriceSeparatorByLocalization(
          sortCarModelVariant[0].priceValue || 0,
          LanguageCode.id,
        )
      : 0
  }, [sortCarModelVariant])

  return (
    <InfoHeaderContainer>
      <TitleHeaderWrapper>
        <BrandIcon brand={modelDetailData?.brand || ''} />
        <BrandModelWrapper>
          <StyledBrand>
            {modelDetailData?.brand}{' '}
            <StyledModel>{modelDetailData?.model}</StyledModel>{' '}
          </StyledBrand>
        </BrandModelWrapper>
      </TitleHeaderWrapper>
      <HeaderPriceWrapper>
        <GrayedText>Harga mulai dari</GrayedText>
        <OTRWrapper>
          <OTR>OTR</OTR>
          <OTRPrice>Rp {carOtrPrice}</OTRPrice>
          <OTRCity>{`(OTR ${cityOtr?.cityName || 'Jakarta Pusat'})`}</OTRCity>
        </OTRWrapper>
        {sortCarModelVariant.length > 0 && (
          <AdditionalInfoCarVariant
            installment={formatSortPrice(
              sortCarModelVariant[0].monthlyInstallment,
            )}
            dp={formatSortPrice(sortCarModelVariant[0].dpAmount)}
            tenure={sortCarModelVariant[0].tenure}
          />
        )}
      </HeaderPriceWrapper>
      <ActionButton {...props} />
    </InfoHeaderContainer>
  )
}

type AdditionalInfoCarVariantProps = {
  installment: string | number
  dp: string | number
  tenure: string | number
  className?: string
}

export const AdditionalInfoCarVariant = ({
  installment,
  dp,
  tenure,
  className,
}: AdditionalInfoCarVariantProps) => (
  <AdditionalInfoWrapper className={className}>
    <AdditionalInfo width="88px">
      <InfoTitle>Cicilan</InfoTitle>
      <InfoData>
        Rp{installment} jt
        <label>/bln</label>
      </InfoData>
    </AdditionalInfo>
    <AdditionalInfo width="67px">
      <InfoTitle>DP</InfoTitle>
      <InfoData>Rp{dp} jt</InfoData>
    </AdditionalInfo>
    <AdditionalInfo width="51.5px">
      <InfoTitle>Tenor</InfoTitle>
      <InfoData>{tenure} tahun</InfoData>
    </AdditionalInfo>
  </AdditionalInfoWrapper>
)

const InfoHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 1025px) {
    display: none;
  }
`

const TitleHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
  max-width: 431px;
  border-bottom: 1px solid ${colors.line};
`

const BrandModelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 14px;
  padding-bottom: 15px;
  border-left: 1px solid ${colors.line};
`

const StyledBrand = styled.h1`
  font-family: var(--kanyon-bold);
  font-size: 16px;
  line-height: 28px;
  color: ${colors.body2};
`

const StyledModel = styled.h1`
  font-family: var(--kanyon-bold);
  font-size: 22px;
  line-height: 28px;
  color: ${colors.body2};
`

const HeaderPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-top: 25px;
`

const GrayedText = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: ${colors.placeholder};
  margin-bottom: 11px;
`

const OTRWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 22px;
`

const StyledOTR = css`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  color: ${colors.body2};
`

const OTR = styled.span`
  ${StyledOTR};
  font-size: 16px;
  line-height: 14px;
`

const OTRPrice = styled.span`
  font-family: var(--kanyon-bold);
  font-size: 20px;
  line-height: 16px;
  color: ${colors.body2};
  margin: 0 11px 0 12px;
`

const OTRCity = styled.span`
  ${StyledOTR};
  font-size: 14px;
  line-height: 16px;
`

const AdditionalInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 38px;
`

const AdditionalInfo = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: ${({ width }) => width};
`

const InfoTitle = styled.span`
  ${StyledOTR};
  font-size: 14px;
  line-height: 18px;
`

const InfoData = styled.span`
  font-family: var(--kanyon-bold);
  font-size: 14px;
  line-height: 18px;

  label {
    font-family: var(--kanyon-medium);
    font-size: 14px;
    line-height: 18px;
  }
`

export const BackArrow = styled.div<{ sticky?: boolean }>``
