import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import {
  trackGantiLokasiClick,
  trackPilihKotaClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { LocationRed } from 'components/atoms/icon/LocationRed'
import { useCitySelectorModal } from '../citySelector/citySelectorModal'
import { getCityWithoutDefault } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'

export const CitySelectorSectionV2 = () => {
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
      <Container className={'city-selector-element'}>
        <LocationRed width={16} height={16} />
        <StyledText>
          <span>Beli mobil di</span>
          <span
            data-testid={elementId.CarResultPage.HeaderCityResult}
            style={{ fontWeight: '600' }}
          >
            &nbsp;{currentCity?.cityName ?? 'kotamu'}
          </span>
          <span
            data-testid={elementId.Homepage.GlobalHeader.ChangeLocation}
            style={{
              textDecoration: 'underline',
              marginLeft: '5px',
              cursor: 'pointer',
            }}
            onClick={clickHandler}
          >
            {currentCity?.cityName ? 'Ganti lokasi' : 'Pilih lokasi'}
          </span>
        </StyledText>
      </Container>
      <CitySelectorModal />
    </>
  )
}

const Container = styled.div`
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  background-color: ${colors.inputBg};
  padding: 6px 19px;
  display: flex;
  align-items: center;
`

const StyledText = styled.div`
  margin-left: 9px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${colors.body2};
`
