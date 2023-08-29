import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import elementId from 'helpers/elementIds'
import { Location } from 'components/atoms/icon/Location'
import { useCitySelectorModal } from './citySelectorModal'
import { getCityWithoutDefault } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import {
  trackGantiLokasiClick,
  trackPilihKotaClick,
} from 'helpers/amplitude/seva20Tracking'
import { TextLegalRegular } from 'utils/typography/TextLegalRegular'
import { NavbarArrow } from 'components/atoms/icon/NavbarArrow'
import { client } from 'utils/helpers/const'

export const CitySelector = () => {
  const { showModal: showCitySelectorModal, CitySelectorModal } =
    useCitySelectorModal()

  const currentCity = getCityWithoutDefault()

  const clickHandler = () => {
    if (currentCity) {
      trackGantiLokasiClick({
        Page_Origination_URL: window.location.href.replace('https://www.', ''),
      })
    } else {
      trackPilihKotaClick({
        Page_Origination_URL: window.location.href.replace('https://www.', ''),
      })
    }

    showCitySelectorModal()
  }

  return (
    <>
      <Wrapper
        data-testid={elementId.Homepage.GlobalHeader.ChangeLocation}
        className={'city-selector-element'}
        onClick={clickHandler}
      >
        {client && window.innerWidth < 1280 ? (
          <>
            <Location color={colors.primary1} width={20} height={20} />
          </>
        ) : (
          <>
            <Location color={colors.primary1} width={16} height={16} />
            <Spacing />
            <WordWrapper>
              <StyledUpperText>
                Beli mobil di <Spacing /> <NavbarArrow />
              </StyledUpperText>
              <StyledCityText>
                {currentCity?.cityName ?? 'Pilih Kota'}
              </StyledCityText>
            </WordWrapper>
          </>
        )}
      </Wrapper>
      <CitySelectorModal />
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const Spacing = styled.div`
  width: 10px;
`

const WordWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledUpperText = styled(TextLegalRegular)`
  font-size: 10px;
  line-height: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  font-family: 'Kanyon';
`

const StyledCityText = styled(TextLegalRegular)`
  font-size: 12px;
  line-height: 18px;
  font-weight: 700;
  font-family: 'Kanyon';
`
