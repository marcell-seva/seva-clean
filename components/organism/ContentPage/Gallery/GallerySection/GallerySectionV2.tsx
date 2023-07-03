import React, { ChangeEvent, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { ToggleSwitch } from 'components/atoms'
import { Gallery360ImageV2 } from './Gallery360ImageV2'
import { GalleryRegularImageV2 } from './GalleryRegularImageV2'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { availableList } from './AvailableList'
import { trimLastChar } from 'utils/urlUtils'
import { useMediaQuery } from 'react-responsive'
import {
  TrackingEventName,
  TrackingEventWebPDPPhoto,
} from 'helpers/amplitude/eventTypes'
import {
  CarVariantPhotoParam,
  trackPDPPhotoClick,
} from 'helpers/amplitude/seva20Tracking'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LocalStorageKey } from 'utils/enum'

interface Props {
  title: string
}

const GallerySectionV2 = ({ title }: Props) => {
  const { carModelDetails } = useContextCarModelDetails()
  const { images: carModelImages } = { ...carModelDetails }
  const [isSelectedExterior, setIsSelectedExterior] = useState(true)
  const [isSelected360, setIsSelected360] = useState(false)
  const [exteriorImageList, setExteriorImageList] = useState<string[]>([])
  const [interiorImageList, setInteriorImageList] = useState<string[]>([])
  const [isRegularInteriorAvailable, setIsRegularInteriorAvailable] =
    useState(true)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const getIndexFilter = (data: string, key: string) =>
    data.toLowerCase().includes(key)

  const filterImageBaseOnDevices = (
    data: Array<string>,
    type: string,
  ): Array<string> => {
    let dataImage
    dataImage = data.filter((item: string) => {
      return (
        getIndexFilter(item, type) &&
        getIndexFilter(item, isMobile ? 'mobile' : 'desktop')
      )
    })

    if (dataImage.length === 0) {
      dataImage = data.filter((item: string) => {
        return getIndexFilter(item, type)
      })
    }
    return dataImage
  }

  const groupingImage = () => {
    if (!carModelImages) return
    let mainNonInterior = carModelImages.filter(
      (item: string) =>
        getIndexFilter(item, 'main') &&
        !getIndexFilter(item, 'int') &&
        getIndexFilter(item, isMobile ? 'mobile' : 'desktop'),
    )

    if (mainNonInterior.length === 0) {
      mainNonInterior = carModelImages.filter(
        (item: string) =>
          getIndexFilter(item, 'main') && !getIndexFilter(item, 'int'),
      )
    }

    const dataExterior = filterImageBaseOnDevices(carModelImages, 'eks')
    const dataInterior = filterImageBaseOnDevices(carModelImages, 'int')

    if (dataInterior.length === 0) {
      setIsRegularInteriorAvailable(false)
    }

    const extTemp = [...mainNonInterior, ...dataExterior]
    const extTempUnique = Array.from(new Set(extTemp))

    setExteriorImageList(extTempUnique)
    setInteriorImageList([...dataInterior])
  }

  useEffect(() => {
    if (carModelImages && carModelImages.length > 0) {
      groupingImage()
    }
  }, [carModelImages])

  const trackEventPhoto = (
    event: TrackingEventWebPDPPhoto,
    photoType: string,
  ) => {
    const trackProperties: CarVariantPhotoParam = {
      Car_Brand: carModelDetails?.brand as string,
      Car_Model: carModelDetails?.model as string,
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
      Photo_Type: photoType,
      City: cityOtr?.cityName || 'null',
    }
    trackPDPPhotoClick(event, trackProperties)
  }

  const onClickExterior = () => {
    setIsSelectedExterior(true)
    trackEventPhoto(TrackingEventName.WEB_PDP_TAB_PHOTO_CLICK, 'Exterior')
  }

  const onClickInterior = () => {
    setIsSelectedExterior(false)
    trackEventPhoto(TrackingEventName.WEB_PDP_TAB_PHOTO_CLICK, 'Interior')
  }

  const handleSwitchToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setIsSelected360(isChecked)
    if (isChecked) {
      trackEventPhoto(
        TrackingEventName.WEB_PDP_360_PHOTO_TOGGLE_ON,
        isSelectedExterior ? 'Exterior' : 'Interior',
      )
    } else {
      trackEventPhoto(
        TrackingEventName.WEB_PDP_360_PHOTO_TOGGLE_OFF,
        isSelectedExterior ? 'Exterior' : 'Interior',
      )
    }
  }

  const renderRegularExteriorInteriorButton = () => {
    return (
      <>
        {isMobile ? (
          <>
            <StyledButton
              isSelected={isSelectedExterior}
              onClick={onClickExterior}
              disabled={false}
            >
              Eksterior
            </StyledButton>
            <StyledButton
              isSelected={!isSelectedExterior}
              onClick={onClickInterior}
              disabled={!isRegularInteriorAvailable}
            >
              Interior
            </StyledButton>
          </>
        ) : (
          <>
            <StyledTab
              isSelected={isSelectedExterior}
              onClick={onClickExterior}
              disabled={false}
            >
              Eksterior
            </StyledTab>
            <StyledTab
              isSelected={!isSelectedExterior}
              onClick={onClickInterior}
              disabled={!isRegularInteriorAvailable}
            >
              Interior
            </StyledTab>
          </>
        )}
      </>
    )
  }

  const render360ExteriorInteriorButton = () => {
    return (
      <>
        {isMobile ? (
          <>
            <StyledButton
              isSelected={isSelectedExterior}
              onClick={onClickExterior}
              disabled={false}
            >
              Eksterior
            </StyledButton>
            <StyledButton
              isSelected={!isSelectedExterior}
              onClick={onClickInterior}
              disabled={false}
            >
              Interior
            </StyledButton>
          </>
        ) : (
          <>
            <StyledTab
              isSelected={isSelectedExterior}
              onClick={onClickExterior}
              disabled={false}
            >
              Eksterior
            </StyledTab>
            <StyledTab
              isSelected={!isSelectedExterior}
              onClick={onClickInterior}
              disabled={false}
            >
              Interior
            </StyledTab>
          </>
        )}
      </>
    )
  }

  console.log(
    'qwe',
    availableList.includes(trimLastChar(window.location.pathname)),
  )

  if (exteriorImageList.length === 0 && interiorImageList.length === 0)
    return <></>

  return (
    <Container>
      <HeaderSection>
        <Title>{title}</Title>
        <ButtonGroup>
          <ExteriorInteriorButtonWrapper>
            {isSelected360
              ? render360ExteriorInteriorButton()
              : renderRegularExteriorInteriorButton()}
          </ExteriorInteriorButtonWrapper>
          {(availableList.includes(trimLastChar(window.location.pathname)) ||
            availableList.includes(
              trimLastChar(window.location.pathname.replace('/galeri', '')),
            )) && (
            <Button360Group>
              <Button360Label>360 View</Button360Label>
              <ToggleSwitch onChange={(e) => handleSwitchToggle(e)} />
            </Button360Group>
          )}
        </ButtonGroup>
      </HeaderSection>
      <Content>
        {isSelected360 ? (
          <Gallery360ImageV2 isSelectedExterior={isSelectedExterior} />
        ) : (
          <GalleryRegularImageV2
            imageList={{
              exterior: exteriorImageList,
              interior: interiorImageList,
            }}
            isSelectedExterior={isSelectedExterior}
          />
        )}
      </Content>
    </Container>
  )
}

export default GallerySectionV2

const Container = styled.div`
  width: 100%;
  margin: 40px auto 0;

  @media (min-width: 1025px) {
    width: 1040px;
    margin: 64px auto 0;
  }
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 1025px) {
    gap: 20px;
    padding: 0;
  }
`

const Title = styled.h2`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: ${colors.title};

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 28px;
    color: ${colors.greyscale};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ExteriorInteriorButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (min-width: 1025px) {
    gap: 0;
  }
`

const SelectedButtonStyle = css`
  background: ${colors.primarySky};
  border: 1.5px solid ${colors.primary1};
  color: ${colors.title};
  cursor: pointer;
`

const UnselectedButtonStyle = css`
  background: ${colors.white};
  border: 1.5px solid ${colors.placeholder};
  color: ${colors.placeholder};
  cursor: pointer;
`

const DisabledButtonStyle = css`
  background: ${colors.white};
  border: 1.5px solid ${colors.line};
  color: ${colors.line};
  cursor: default;
`

const getButtonStyle = (isSelected: boolean, disabled: boolean) => {
  if (disabled) return DisabledButtonStyle
  else if (isSelected) return SelectedButtonStyle
  else return UnselectedButtonStyle
}

const StyledButton = styled.button<{
  isSelected: boolean
  disabled: boolean
}>`
  width: 92px;
  ${({ isSelected, disabled }) => getButtonStyle(isSelected, disabled)};
  border-radius: 8px;
  padding: 8px 20px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const SelectedTabStyle = css`
  border-bottom: 4px solid ${colors.primaryDarkBlue};
  color: ${colors.primaryDarkBlue};
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  cursor: pointer;
`

const UnselectedTabStyle = css`
  border-bottom: 2px solid ${colors.line};
  color: ${colors.label};
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
`

const DisabledTabStyle = css`
  border-bottom: 1.5px solid ${colors.line};
  color: ${colors.line};
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  cursor: default;
`

const getTabStyle = (isSelected: boolean, disabled: boolean) => {
  if (disabled) return DisabledTabStyle
  else if (isSelected) return SelectedTabStyle
  else return UnselectedTabStyle
}

const StyledTab = styled.button<{
  isSelected: boolean
  disabled: boolean
}>`
  border: none;
  ${({ isSelected, disabled }) => getTabStyle(isSelected, disabled)};
  padding: 14px 35px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`

const Button360Group = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (min-width: 1025px) {
    gap: 14px;
  }
`

const Button360Label = styled.span`
  font-family: 'PoppinsSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${colors.primaryDarkBlue};

  @media (min-width: 1025px) {
    font-family: 'KanyonBold';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
`

const Content = styled.div`
  margin-top: 12px;

  @media (min-width: 1025px) {
    margin-top: 24px;
  }
`
