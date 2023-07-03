import { Button } from 'components/atoms'
import React, { useMemo } from 'react'
import styled from 'styled-components'
// import { Link } from 'react-router-dom'
import { colors } from 'styles/colors'
import { useMediaQuery } from 'react-responsive'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
// import { ActionButton } from '../CarHeader/component/HeaderActionButton'
import elementId from 'helpers/elementIds'
import { ActionButton } from '../HeaderActionButton/HeaderActionButton'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

export type StickyButtonProps = {
  onClickPenawaran: () => void
  toLoan: string
  isSticky?: boolean
}

export function StickyButton({ isSticky, ...props }: StickyButtonProps) {
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' })
  return (
    <StickyButtonWrapper sticky={isSticky}>
      {isDesktop ? (
        <BrandModelActionButton {...props} />
      ) : (
        <ActionButtonMobile {...props} />
      )}
    </StickyButtonWrapper>
  )
}

const BrandModelActionButton = (props: StickyButtonProps) => {
  const { carModelDetails } = useContextCarModelDetails()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const sortCarModelVariant = useMemo(() => {
    return (
      carModelDetails?.variants.sort(function (a, b) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [carModelDetails])

  const carOtrPrice = useMemo(() => {
    return carModelDetails
      ? replacePriceSeparatorByLocalization(
          sortCarModelVariant[0].priceValue || 0,
          LanguageCode.id,
        )
      : 0
  }, [sortCarModelVariant])

  return (
    <DesktopActionButtonDesktop>
      <BrandModelWrapper>
        <BrandModelName>
          {carModelDetails?.brand} {carModelDetails?.model}
        </BrandModelName>
        <PriceOTRWrapper>
          <InfoText>Harga mulai dari</InfoText>
          <OTR>OTR</OTR>
          <PriceText>Rp {carOtrPrice}</PriceText>
          <InfoText>
            {`(OTR ${
              carModelDetails?.brand === 'Daihatsu'
                ? 'Jakarta Pusat'
                : cityOtr?.cityName || 'Jakarta Pusat'
            })`}
          </InfoText>
        </PriceOTRWrapper>
      </BrandModelWrapper>
      <ActionButton {...props} />
    </DesktopActionButtonDesktop>
  )
}

const ActionButtonMobile = ({
  onClickPenawaran,
  toLoan,
}: StickyButtonProps) => (
  <>
    <MintaPenawaranButton
      version={ButtonVersion.PrimaryDarkBlue}
      size={ButtonSize.Big}
      onClick={onClickPenawaran}
    >
      Minta Penawaran
    </MintaPenawaranButton>
    <LinkHitungCicilan href={toLoan}>
      <HitungCicilanButton
        data-testid={elementId.InstantApproval.ButtonCalculateInstallment}
        version={ButtonVersion.PrimaryDarkBlue}
        size={ButtonSize.Big}
      >
        Hitung Cicilan
      </HitungCicilanButton>
    </LinkHitungCicilan>
  </>
)

const StickyButtonWrapper = styled.div<{ sticky?: boolean }>`
  position: fixed;
  z-index: 3;
  bottom: 0;
  transform: ${({ sticky }) =>
    sticky ? 'translateY(0%)' : 'translateY(100%)'};
  transition: transform 0.5s;

  background-color: ${colors.white};

  width: 100%;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
    height: 69px;

    padding: 10px 17px 11px 16px;
    gap: 5px;
  }

  @media (min-width: 1025px) {
    box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.25);
    height: 71px;
  }
`

const DesktopActionButtonDesktop = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const BrandModelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const BrandModelName = styled.h3`
  font-family: 'KanyonBold';
  font-size: 16px;
  line-height: 28px;
  color: ${colors.primaryDarkBlue};
`

const PriceOTRWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: baseline;
`
const InfoText = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  color: ${colors.placeholder};
`

const OTR = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: ${colors.body2};
  margin-left: 2px;
`

const PriceText = styled.span`
  font-family: 'KanyonBold';
  font-size: 14px;
  line-height: 16px;
  color: ${colors.body2};
`

export const MintaPenawaranButton = styled(Button)`
  font-size: 14px;
  width: 50%;
  max-height: 48px;
  margin: 0;

  @media (min-width: 1025px) {
    width: 205px;
    font-size: 16px;
    margin-right: 11px;
    border-radius: 8px;
  }
`

export const LinkHitungCicilan = styled.a`
  width: 50%;
  max-height: 48px;

  @media (min-width: 1025px) {
    width: 205px;
    margin-right: 7px;

    button {
      font-size: 16px;
      border-radius: 8px;
    }
  }
`

export const HitungCicilanButton = styled(Button)`
  font-size: 14px;
  width: 100%;
`
