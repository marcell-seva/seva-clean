import React from 'react'
import {
  WrapperButton,
  StyledLabel,
  Spacing,
  StyledItemText,
  ItemTextWrapperPrimary,
} from './navbarItemStyle'
import { colors } from 'styles/colors'
import elementId from 'helpers/elementIds'
import { NavbarItemResponse } from 'utils/types/utils'
import { useDropdownMultilevel } from 'components/atoms/dropdownMultiLevel'
import { useRouter } from 'next/router'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { LocalStorageKey } from 'utils/models/models'
import { handleEventTrackingBeliMobile } from 'helpers/amplitude/trackNavigationMenu'
import { trackHeaderNavigationMenuClick } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { NavbarArrow } from 'components/atoms/icon/NavbarArrow'
import { Forward } from 'components/atoms/icon/Forward'

interface Props {
  data: NavbarItemResponse
}

export const BeliMobilMenu = ({ data }: Props) => {
  const merekData = data.subMenu.filter((item) => item.menuName === 'Merek')[0]
  const tipeBodiData = data.subMenu.filter(
    (item) => item.menuName === 'Tipe Bodi',
  )[0]
  const { DropdownMultilevel, setDropdownDisplay } = useDropdownMultilevel()
  const {
    DropdownMultilevel: DropdownMultilevelMerek,
    setDropdownDisplay: setDropdownDisplayMerek,
  } = useDropdownMultilevel()
  const {
    DropdownMultilevel: DropdownMultilevelBodi,
    setDropdownDisplay: setDropdownDisplayBodi,
  } = useDropdownMultilevel()
  const router = useRouter()
  const { patchFunnelQuery } = useFunnelQueryData()

  const mouseEnterHandler = (item: NavbarItemResponse) => {
    if (item.menuName === 'Merek') setDropdownDisplayMerek(true)
    else if (item.menuName === 'Tipe Bodi') setDropdownDisplayBodi(true)
  }

  const mouseLeaveHandler = (item: NavbarItemResponse) => {
    if (item.menuName === 'Merek') setDropdownDisplayMerek(false)
    else if (item.menuName === 'Tipe Bodi') setDropdownDisplayBodi(false)
  }

  const removeUnnecessaryDataFilter = (): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      bodyType: [],
      carModel: '',
      tenure: 5,
      downPaymentAmount: '',
      sortBy: 'highToLow',
    }

    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const clickMerekHandler = (item: NavbarItemResponse) => {
    removeUnnecessaryDataFilter()
    if (item.menuName !== 'Semua Merek') {
      handleEventTrackingBeliMobile(item.menuCode)
      const temp: string[] = []
      temp.push(item.menuName)
      patchFunnelQuery({ brand: temp })
    } else {
      trackHeaderNavigationMenuClick(
        TrackingEventName.WEB_NAVIGATION_MEREK_ALL_CLICK,
      )
      patchFunnelQuery({ brand: [] })
    }
    router.push(item.menuUrl)
  }

  const clickBodiHandler = (item: NavbarItemResponse) => {
    if (item.menuName !== 'Semua Tipe Bodi') {
      const temp: string[] = []
      temp.push(item.menuName)

      patchFunnelQuery({ bodyType: temp })
    } else {
      patchFunnelQuery({ bodyType: [] })
    }
    router.push(item.menuUrl)
  }

  return (
    <WrapperButton
      data-testid={elementId.Homepage.HeaderMenu.BuyCarMenu}
      onMouseEnter={() => setDropdownDisplay(true)}
      onMouseLeave={() => setDropdownDisplay(false)}
    >
      <StyledLabel>{data.menuName}</StyledLabel>
      <Spacing />
      <NavbarArrow />
      <DropdownMultilevel
        items={data.subMenu.length}
        width={'233px'}
        marginTop={27}
      >
        {data.subMenu.map((item, index) => {
          if (item.status) {
            return (
              <div
                key={index}
                onMouseEnter={() => mouseEnterHandler(item)}
                onMouseLeave={() => mouseLeaveHandler(item)}
              >
                <ItemTextWrapperPrimary>
                  <StyledItemText className="item-text">
                    {item.menuName}
                  </StyledItemText>
                  {item.subMenu && item.subMenu.length > 0 && <Forward />}
                </ItemTextWrapperPrimary>
              </div>
            )
          }
        })}
      </DropdownMultilevel>
      <div
        onMouseEnter={() => setDropdownDisplayMerek(true)}
        onMouseLeave={() => setDropdownDisplayMerek(false)}
      >
        <DropdownMultilevelMerek
          items={merekData.subMenu.length}
          width={'233px'}
          marginTop={27}
          left={'233px'}
          background={colors.inputBg}
        >
          <div>
            {merekData.subMenu.map((item, index) => {
              if (item.status) {
                return (
                  <div key={index}>
                    <ItemTextWrapperPrimary
                      data-testid={elementId.Homepage.BuyCar + item.menuName}
                      onClick={() => clickMerekHandler(item)}
                    >
                      <StyledItemText className="item-text">
                        {item.menuName}
                      </StyledItemText>
                      {item.subMenu && item.subMenu.length > 0 && <Forward />}
                    </ItemTextWrapperPrimary>
                  </div>
                )
              }
            })}
          </div>
        </DropdownMultilevelMerek>
      </div>
      <div
        onMouseEnter={() => setDropdownDisplayBodi(true)}
        onMouseLeave={() => setDropdownDisplayBodi(false)}
      >
        <DropdownMultilevelBodi
          items={tipeBodiData.subMenu.length}
          width={'233px'}
          marginTop={27}
          left={'233px'}
          background={colors.inputBg}
        >
          <div>
            {tipeBodiData.subMenu.map((item, index) => {
              if (item.status) {
                return (
                  <div key={index}>
                    <ItemTextWrapperPrimary
                      onClick={() => clickBodiHandler(item)}
                    >
                      <StyledItemText className="item-text">
                        {item.menuName}
                      </StyledItemText>
                      {item.subMenu && item.subMenu.length > 0 && <Forward />}
                    </ItemTextWrapperPrimary>
                  </div>
                )
              }
            })}
          </div>
        </DropdownMultilevelBodi>
      </div>
    </WrapperButton>
  )
}
