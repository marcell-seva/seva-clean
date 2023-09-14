import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getCities } from 'services/cities'
import { useMediaQuery } from 'react-responsive'
import Fuse from 'fuse.js'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { CityOtrOption } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import {
  getCity,
  saveCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { trackCityListClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { Location } from 'components/atoms/icon/Location'
import { Close } from 'components/atoms/icon/OldClose'
import { colors } from 'styles/colors'
import { parsedToUnCapitalizeWithHyphen } from 'utils/parsedToUnCapitalizeWithHyphen'
import { TextLegalRegular } from 'utils/typography/TextLegalRegular'
import { H2MediumBold } from 'utils/typography/H2MediumBold'
import {
  TextMediumRegular,
  TextMediumRegularStyle,
} from 'components/atoms/typography/TextMediumRegular'
import { SearchInput } from 'components/atoms/searchInput/oldSearchInput'
import { client } from 'utils/helpers/const'

interface CityOptions {
  value: string
  label: string
}

export const useCitySelectorModal = () => {
  const { showModal, hideModal, RenderModal, isVisible } = useModal()
  const isSmallDesktop = useMediaQuery({
    query: '(max-width: 1365px) and (min-width: 1280px)',
  })

  const CitySelectorModal = () => {
    // list from api, used for filter
    const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
    //use for fuzzy search, (value & label)
    const [cityListFull, setCityListFull] = useState<any>([])
    const [cityOtr] = useLocalStorage<CityOtrOption | null>(
      LocalStorageKey.CityOtr,
      null,
    )
    const getCityListOption = (cityList: any) => {
      const tempArray: CityOptions[] = []
      for (const item of cityList) {
        const tempObj: CityOptions = {
          label: '',
          value: '',
        }
        tempObj.value = item?.cityName
        tempObj.label = item?.cityName
        tempArray.push(tempObj)
      }
      return tempArray
    }

    useEffect(() => {
      if (cityListFull.length === 0 && cityListApi.length === 0 && isVisible) {
        checkCitiesData()
      }
    }, [isVisible])

    const checkCitiesData = () => {
      const data: string | null = getLocalStorage(LocalStorageKey.citySelector)
      if (data === null) {
        getCities().then((res) => {
          setCityListApi(res)
          const options = getCityListOption(res)
          setCityListFull(options)
          setCitiesData(res)
        })
      } else {
        const decryptedValue: any = JSON.parse(decryptValue(data))
        setCityListApi(decryptedValue)
        const options = getCityListOption(decryptedValue)
        setCityListFull(options)
      }
    }

    const setCitiesData = (payload: any) => {
      const encryptedData = encryptValue(JSON.stringify(payload))
      saveLocalStorage(LocalStorageKey.citySelector, encryptedData)
    }

    const onClickCancel = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation()
      hideModal()
    }

    const clickList = (value: string) => {
      const filter = cityListApi.filter(
        (item: CityOtrOption) => item.cityName === value,
      )
      const temp: CityOtrOption = {
        cityName: filter[0].cityName,
        cityCode: filter[0].cityCode,
        province: filter[0].province,
        id: filter[0].id,
      }
      saveCity(temp)
      trackCityListClick({
        Page_Origination_URL: window.location.href.replace('https://www.', ''),
        City: value,
      })
      location.reload()
    }

    const [searchInputValue, setSearchInputValue] = useState('')
    const [suggestionsLists, setSuggestionsLists] = useState<any>([])

    useEffect(() => {
      const searchOption = {
        keys: ['label'],
        isCaseSensitive: true,
        includeScore: true,
        threshold: 0.1,
      }
      const fuse = new Fuse(cityListFull, searchOption)
      const suggestion = fuse.search(searchInputValue)
      const result = suggestion.map((obj) => obj.item)

      // sort alphabetically
      // result.sort((a: any, b: any) => a.label.localeCompare(b.label))

      // sort based on input
      const sorted = result.sort((a: any, b: any) => {
        if (
          a.label.startsWith(searchInputValue) &&
          b.label.startsWith(searchInputValue)
        )
          return a.label.localeCompare(b.label)
        else if (a.label.startsWith(searchInputValue)) return -1
        else if (b.label.startsWith(searchInputValue)) return 1

        return a.label.localeCompare(b.label)
      })

      setSuggestionsLists(sorted)
    }, [searchInputValue])

    const onSearchInputChange = (searchInputValueParam: string) => {
      setSearchInputValue(
        searchInputValueParam
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
      )
    }

    const renderDesktopView = () => {
      if (isSmallDesktop) {
        return (
          // fix issue on small desktop
          <>
            <StyledTitle>
              Pilih kota Kamu untuk menampilkan harga yang sesuai
            </StyledTitle>
          </>
        )
      } else {
        return (
          <>
            <Location width={30} height={30} color={colors.primary1} />
            <StyledTitle>
              Pilih kota Kamu untuk <br></br> menampilkan harga yang sesuai
            </StyledTitle>
            <StyledSubtitle
              data-testid={
                elementId.Homepage.CitySelectorPopup.InputCitySelectorKTP
              }
            >
              (Pilih sesuai KTP)
            </StyledSubtitle>
          </>
        )
      }
    }

    return (
      <>
        <RenderModal blur={'0px'} transparent={false}>
          <StyledWrapper>
            <StyledContent>
              <>
                {client && window.innerWidth < 1280 ? (
                  <MobileHeaderWrapper>
                    <StyledTitleMobile>
                      Pilih kotamu{' '}
                      <StyledSubtitleMobile>
                        (Pilih sesuai KTP)
                      </StyledSubtitleMobile>
                    </StyledTitleMobile>
                    {cityOtr && (
                      <StyledCloseIcon onClick={onClickCancel}>
                        <Close color={colors.primary1} />
                      </StyledCloseIcon>
                    )}
                  </MobileHeaderWrapper>
                ) : (
                  cityOtr && (
                    <StyledCloseIcon onClick={onClickCancel}>
                      <Close color={colors.primary1} />
                    </StyledCloseIcon>
                  )
                )}
              </>
              <Container>
                {client && window.innerWidth < 1280 ? (
                  <></>
                ) : (
                  renderDesktopView()
                )}
                <InputWrapper>
                  <StyledSearchInput
                    data-testid={
                      elementId.Homepage.GlobalHeader.PopupChangeLocation +
                      getCity().cityName
                    }
                    onSearchInputChange={onSearchInputChange}
                    searchInputValue={searchInputValue}
                    placeholder={getCity().cityName}
                    enablePrefixIcon={false}
                    searchIconSuffix={true}
                  />
                  {suggestionsLists.length !== 0 &&
                    searchInputValue.length > 0 && (
                      <StyledDataResult>
                        {suggestionsLists.map((item: any, index: number) => {
                          return (
                            <StyledLink
                              onClick={() => clickList(item.label)}
                              key={index}
                              rel="noopener noreferrer"
                              className={'city-dropdown-item-element'}
                              data-testid={
                                elementId.Homepage.GlobalHeader
                                  .DropdownListCity +
                                parsedToUnCapitalizeWithHyphen(item.label)
                              }
                            >
                              {item.label && (
                                <StyledItem
                                  dangerouslySetInnerHTML={{
                                    __html: item.label?.replace(
                                      searchInputValue,
                                      '<strong style="font-weight: 700; font-family: Kanyon;">' +
                                        searchInputValue +
                                        '</strong>',
                                    ),
                                  }}
                                />
                              )}
                            </StyledLink>
                          )
                        })}
                      </StyledDataResult>
                    )}
                </InputWrapper>
              </Container>
            </StyledContent>
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }

  return { CitySelectorModal, hideModal, showModal }
}

const StyledWrapper = styled.div`
  width: 632px;
  height: 500px;
  display: flex;
  align-items: center;
  @media (max-width: 1024px) {
    width: 100%;
    height: 100%;
    align-items: unset;
  }
`

const StyledContent = styled.div`
  border-radius: 32px;
  text-align: center;
  flex: 1;
  padding: 20px 24px 19px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${colors.white};
  @media (max-width: 1024px) {
    border-radius: 0;
  }
`

const MobileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.line};
`

const StyledCloseIcon = styled.div`
  display: flex;
  align-self: flex-end;
`

const Container = styled.div`
  margin-top: 20px;
  padding: 0 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1024px) {
    margin-top: 0;
    padding: 0;
  }
`

const StyledTitleMobile = styled(TextLegalRegular)`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  font-family: var(--kanyon);
`

const StyledSubtitleMobile = styled(TextLegalRegular)`
  color: ${colors.label};
  font-size: 12px;
  line-height: 16px;
  font-family: var(--kanyon);
`

const StyledTitle = styled(H2MediumBold)`
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  font-family: var(--kanyon);

  // 0 margin cause logo is not shown start from 1366
  @media (max-width: 1365px) {
    margin-top: 0;
  }
`

const StyledSubtitle = styled(TextMediumRegular)`
  margin-top: 12px;
  color: ${colors.label};
  font-family: var(--kanyon);
`

const InputWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  position: relative;
`

const StyledDataResult = styled.div`
  margin-top: 7px;
  width: 100%;
  margin-left: 0vw;
  border-radius: 16px;
  height: auto;
  max-height: 250px;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  z-index: 99;
  :-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 1024px) {
    position: absolute;
    z-index: 99;
    width: 100%;
    border-radius: 16px;
    /* margin-left: 16vw; */
    height: auto;
    background-color: white;
    box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    overflow-x: hidden;
    overflow-y: auto;
  }
`
const StyledLink = styled.a`
  width: auto;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  padding-left: 15px;
  margin: 6px;
  :hover {
    background-color: ${colors.primarySky};
    border-radius: 8px;
  }
  @media (max-width: 1024px) {
    display: flex;
    height: 50px;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    padding-left: 25px;
  }
`
const StyledItem = styled.div`
  ${TextMediumRegularStyle};
  margin-left: 1vw;
  font-family: var(--kanyon);
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`

const StyledSearchInput = styled(SearchInput)`
  /* text-transform: capitalize; */
  padding: 0px 10px;
  width: 100%;
`
