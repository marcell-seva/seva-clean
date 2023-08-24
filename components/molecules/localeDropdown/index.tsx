import React, { useMemo } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { useTranslation } from 'react-i18next'
import { useUtils } from 'services/context/utilsContext'
import { LanguageCode } from 'utils/enum'
import { FlagIndonesia } from 'components/atoms/icon/FlagIndonesia'
import { FlagUSA } from 'components/atoms/icon/FlagUSA'
import { useDropdownMenu } from 'components/atoms/dropdownMenu'
import { trackSelectLanguage } from 'helpers/amplitude/trackingEvents'
import { DownOutlined } from 'components/atoms'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'

interface LocaleOption {
  value: LanguageCode
  displayShortText: string
  displayText: string
  flag: JSX.Element
}

const LocaleOptions: Array<LocaleOption> = [
  {
    value: LanguageCode.id,
    displayShortText: LanguageCode.id.toUpperCase(),
    displayText: 'Bahasa Indonesia',
    flag: <FlagIndonesia />,
  },
  {
    value: LanguageCode.en,
    displayShortText: LanguageCode.en.toUpperCase(),
    displayText: 'English',
    flag: <FlagUSA />,
  },
]

export const LocaleDropDown = () => {
  const { DropdownMenu, setDropdownDisplay } = useDropdownMenu()

  const { i18n } = useTranslation()

  const { currentLanguage, setCurrentLanguage } = useUtils()

  const changeLanguage = (targetLanguage: LanguageCode) => {
    i18n.changeLanguage(targetLanguage)
    setCurrentLanguage(targetLanguage)
    trackSelectLanguage(targetLanguage)
    setDropdownDisplay(false)
  }

  const currentLanguageOption = useMemo(
    () =>
      LocaleOptions.find((option) => option.value === currentLanguage) ??
      LocaleOptions[0],
    [currentLanguage],
  )

  const displayLanguageOption = () => setDropdownDisplay(true)

  return (
    <StyledLocaleDropdown>
      <StyledCurrentLocale onClick={displayLanguageOption}>
        {currentLanguageOption.flag}
        <StyledLocaleText>
          {currentLanguageOption?.displayShortText}
        </StyledLocaleText>
        <StyledDownOutlined width={12} height={12} color={colors.title} />
      </StyledCurrentLocale>
      <DropdownMenu>
        {LocaleOptions.map((option) => (
          <StyledLocaleItem
            key={option.value}
            onClick={() => changeLanguage(option.value)}
          >
            {option.flag}
            <StyledLocaleText>{option.displayText}</StyledLocaleText>
          </StyledLocaleItem>
        ))}
      </DropdownMenu>
    </StyledLocaleDropdown>
  )
}

const StyledDownOutlined = styled(DownOutlined)`
  margin-left: 8px;
`

const StyledLocaleDropdown = styled.div`
  position: relative;

  @media (max-width: 1024px) {
    margin: 0 18px 0 27px;
  }
`

const StyledLocaleItem = styled.div`
  display: flex;
  height: 48px;
  width: 192px;
  align-items: center;
  padding-left: 16px;
  :hover {
    cursor: pointer;
    background-color: #5cc9fc;
  }

  @media (max-width: 1024px) {
    padding-left: 10px;
  }
`

const StyledCurrentLocale = styled(StyledLocaleItem)`
  height: 100%;
  width: auto;
  :hover {
    background-color: unset;
  }
  font-weight: 600;
`
const StyledLocaleText = styled(TextLegalMedium)`
  margin-left: 8px;
  font-weight: 600;
`
