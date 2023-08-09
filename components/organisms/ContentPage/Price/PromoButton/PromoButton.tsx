import { trackCarVariantBannerPromoClick } from 'helpers/amplitude/seva20Tracking'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import GlassEffect from './glass-effect.png'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { DownOutlined } from 'components/atoms'
import { useCar } from 'services/context/carContext'

type PromoButtonProps = {
  onClick?: () => void
}

export const PromoButton = ({ onClick }: PromoButtonProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { carModelDetails } = useCar()

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand ?? '',
      Car_Model: carModelDetails?.model ?? '',
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carModelDetails?.variants[0].priceValue || 0,
        LanguageCode.id,
      )}`,
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: window.location.href,
    }
  }

  return (
    <StyledPromoButton
      onClick={() => {
        trackCarVariantBannerPromoClick(getDataForAmplitude())
        onClick && onClick()
      }}
    >
      {!isMobile && <DesktopBg />}
      <PromoButtonWrapper>
        <PromoButtonTextWrapper>
          <PromoButtonText>
            Dapatkan promo cashback dan asuransi!
          </PromoButtonText>
          {isMobile && (
            <PromoButtonSubText>
              {'Lihat pilihan promo untukmu >'}
            </PromoButtonSubText>
          )}
        </PromoButtonTextWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 26,
            height: 20,
            alignItems: 'center',
          }}
        >
          {!isMobile && (
            <PromoButtonSubText>
              {'Lihat pilihan promo untukmu'}
            </PromoButtonSubText>
          )}
          <StyledIcon>
            <DownOutlined color={colors.white} width={16} height={9} />
          </StyledIcon>
        </div>
      </PromoButtonWrapper>
      <BlueCircle>
        <Percent>%</Percent>
      </BlueCircle>
    </StyledPromoButton>
  )
}

const StyledPromoButton = styled.div`
  width: 100%;
  height: 80px;
  background-color: ${colors.primaryBlue};
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  @media (min-width: 1025px) {
    height: 106px;
    cursor: pointer;
    background: linear-gradient(74.94deg, #002d95 0.54%, #2797ff 83.1%);
  }
`

const DesktopBg = styled.div`
  width: 100%;
  height: 103px;
  position: absolute;
  z-index: 1;
  top: 3px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${GlassEffect as any});
`

const BlueCircle = styled.div`
  border-radius: 50%;
  height: 100%;
  width: 86px;
  position: relative;
  background-color: ${colors.primaryDarkBlue};
  left: -30px;
  position: absolute;
  z-index: 2;

  @media (min-width: 1025px) {
    width: 137px;
    left: -55px;
    bottom: -4px;
    height: 118px;
    background-color: ${colors.primaryRed};
  }
`

const Percent = styled.span`
  font-family: 'KanyonBold';
  font-size: 30px;
  line-height: 20px;
  color: ${colors.primarySkyBlue};
  position: relative;
  left: 45px;
  top: 29px;

  @media (min-width: 1025px) {
    color: ${colors.white};
    left: 81px;
    top: 50px;
  }
`

const PromoButtonWrapper = styled.div`
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 64px;
  padding-right: 15px;

  @media (min-width: 1025px) {
    padding-left: 160px;
    padding-right: 34.71px;
  }
`

const PromoButtonTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colors.white};
  width: 185px;

  @media (min-width: 1025px) {
    width: 50%;
  }
`

const PromoButtonText = styled.span`
  font-family: 'KanyonBold';
  font-size: 14px;
  line-height: 20px;

  @media (min-width: 1025px) {
    font-size: 20px;
  }
`

const PromoButtonSubText = styled.span`
  font-family: 'Kanyon';
  font-size: 10px;
  line-height: 16px;
  opacity: 0.7;

  @media (min-width: 1025px) {
    font-size: 18px;
    opacity: 1;
    color: ${colors.white};
    width: 100%;
  }
`

const StyledIcon = styled.div`
  transform: rotate(-90deg);
`
