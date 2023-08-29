import React, { ButtonHTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { colors, transparent } from 'styles/colors'
import { useTranslation } from 'react-i18next'
import {
  LinkLabelMediumBold,
  LinkLabelMediumBoldStyle,
} from 'utils/typography/LinkLabelMediumBold'
import { IconLoading } from '../icon'

export enum ButtonType {
  primary1 = 'primary1',
  primary2 = 'primary2',
  primary3 = 'primary3',
  primary4 = 'primary4',
  primary5 = 'primary5',
  secondary1 = 'secondary1',
  secondary2 = 'secondary2',
  secondary3 = 'secondary3',
  secondary5 = 'secondary5',
  subtle = 'subtle',
  red = 'red',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType
  width?: number | string
  height?: number | string
  loading?: boolean
}

export const Button = ({
  children,
  width,
  height = '50px',
  loading,
  buttonType = ButtonType.primary1,
  ...restProps
}: ButtonProps) => {
  const { t } = useTranslation()
  const getLoadingColor = () => {
    switch (buttonType) {
      case ButtonType.primary1:
        return colors.offWhite
      case ButtonType.primary4:
        return colors.primaryDarkBlue
      case ButtonType.primary2:
      case ButtonType.secondary2:
        return colors.title
      case ButtonType.secondary1:
        return colors.primary1
      case ButtonType.secondary3:
        return colors.title
      case ButtonType.red:
        return colors.white
      default:
        return colors.offWhite
    }
  }

  const getLoadingComponent = (buttonTypeParam: ButtonType) => {
    return buttonTypeParam !== ButtonType.subtle ? (
      <StyledLoading
        color={getLoadingColor()}
        height={20}
        width={20}
      ></StyledLoading>
    ) : (
      <LinkLabelMediumBold>{t('common.loadingMsg')}</LinkLabelMediumBold>
    )
  }

  return (
    <StyledButton
      width={width}
      height={height}
      buttonType={buttonType}
      $loading={loading}
      {...restProps}
    >
      {loading ? getLoadingComponent(buttonType) : children}
    </StyledButton>
  )
}

const borderWidth = '8px'

const hoverStyle = (hoverColor: string) => css`
  :hover:enabled {
    :after {
      position: absolute;
      top: -${borderWidth};
      right: -${borderWidth};
      bottom: -${borderWidth};
      left: -${borderWidth};
      content: '';
      border-radius: 24px;
      opacity: 0.8;
      border: ${borderWidth} solid ${hoverColor};
    }
  }
`

export const Primary1Style = (loading: boolean, hoverColor: string) => css`
  background: ${colors.primary1};
  color: ${colors.white};
  border: none;

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.title};
    color: ${colors.white};
  }

  :disabled {
    background: ${colors.placeholder};
    color: ${colors.background};
  }
`
const Primary2Style = (loading: boolean, hoverColor: string) => css`
  background: ${colors.primaryRed};
  color: ${colors.title};
  border: none;

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.secondaryText};
    color: ${colors.title};
  }

  :disabled {
    background: ${colors.secondaryLight};
    color: ${colors.placeholder};
  }
`
const Secondary1Style = (loading: boolean, hoverColor: string) => css`
  color: ${colors.primary1};
  background: ${colors.white};
  border: 2px solid ${colors.primary1};

  ${!loading && hoverStyle(hoverColor)}

  :active {
    color: ${colors.primary1};
    background: ${colors.white};
    border: 2px solid ${colors.primary1};
  }

  :disabled {
    color: ${colors.label};
    background: ${transparent('white', 0.5)};
    border: 2px solid ${colors.label};
  }
`

const Primary3Style = (loading: boolean, hoverColor: string) => css`
  background: ${colors.secondaryLight};
  color: ${colors.title};
  border: none;

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.secondaryText};
    color: ${colors.title};
  }

  :disabled {
    background: ${colors.secondaryLight};
    color: ${colors.placeholder};
  }
`

const Primary4Style = (loading: boolean, hoverColor: string) => css`
  background: ${colors.white};
  color: ${colors.primaryDarkBlue};
  border: none;

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.white};
    color: ${colors.primaryDarkBlue};
  }

  :disabled {
    background: ${colors.placeholder};
    color: ${colors.background};
  }
`

const Primary5Style = (loading: boolean, hoverColor: string) => css`
  background: ${colors.primaryBlue};
  color: ${colors.white};
  border: none;

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.primaryBlue};
    color: ${colors.white};
  }

  :disabled {
    background: ${colors.placeholder};
    color: ${colors.background};
  }
`

const Secondary2Style = (loading: boolean, hoverColor: string) => css`
  color: ${colors.title};
  background: ${colors.white};
  border: 2px solid ${colors.secondary};

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.white};
    color: ${colors.title};
    border: 2px solid ${colors.secondary};
  }

  :disabled {
    color: ${colors.label};
    background: ${transparent('white', 0.5)};
    border: 2px solid ${colors.label};
  }
`
const Secondary3Style = (loading: boolean, hoverColor: string) => css`
  color: ${colors.title};
  background: ${colors.white};
  border: 2px solid ${colors.primary1};

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.white};
    color: ${colors.title};
    border: 2px solid ${colors.secondary};
  }

  :disabled {
    color: ${colors.label};
    background: ${transparent('white', 0.5)};
    border: 2px solid ${colors.label};
  }
`

const Secondary5Style = (loading: boolean, hoverColor: string) => css`
  color: ${colors.primaryBlue};
  background: ${colors.white};
  border: 2px solid ${colors.primaryBlue};

  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.white};
    color: ${colors.primaryBlue};
    border: 2px solid ${colors.primaryBlue};
  }

  :disabled {
    color: ${colors.label};
    background: ${transparent('white', 0.5)};
    border: 2px solid ${colors.label};
  }
`

const SubtleStyle = (loading: boolean) => css`
  color: ${colors.primary1};
  background: none;
  border: none;

  ${!loading &&
  css`
    :hover {
      background: ${colors.primary2};
      opacity: 0.8;
      border: ${borderWidth} solid ${colors.primary2};
      border-radius: 40px;
      padding: 0 20px;
    }
  `}

  :active {
    color: ${colors.primary1};
  }

  :disabled {
    color: ${colors.label};
  }
`

const ButtonRedStyle = (loading: boolean, hoverColor: string) => css`
  background: ${colors.red};
  color: ${colors.white};
  border: none;
  margin-top: -4vh;
  @media (max-width: 1024px) {
    height: 38px;
    margin-top: 5vh;
    background-size: contain;
  }
  ${!loading && hoverStyle(hoverColor)}

  :active {
    background: ${colors.secondaryText};
    color: ${colors.title};
  }

  :disabled {
    background: ${colors.secondaryLight};
    color: ${colors.placeholder};
  }
`
const StyledButton = styled.button<{
  width?: number | string
  height?: number | string
  buttonType: ButtonType
  $loading?: boolean
  hoverColor?: string
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  :hover {
    cursor: pointer;
  }
  :disabled {
    cursor: default;
  }

  ${LinkLabelMediumBoldStyle}

  ${({ buttonType, $loading = false, hoverColor = 'transparent' }) => {
    switch (buttonType) {
      case ButtonType.primary1:
        return Primary1Style($loading, hoverColor)
      case ButtonType.primary2:
        return Primary2Style($loading, hoverColor)
      case ButtonType.primary3:
        return Primary3Style($loading, hoverColor)
      case ButtonType.primary4:
        return Primary4Style($loading, hoverColor)
      case ButtonType.primary5:
        return Primary5Style($loading, hoverColor)
      case ButtonType.secondary1:
        return Secondary1Style($loading, hoverColor)
      case ButtonType.secondary2:
        return Secondary2Style($loading, hoverColor)
      case ButtonType.secondary3:
        return Secondary3Style($loading, hoverColor)
      case ButtonType.secondary5:
        return Secondary5Style($loading, hoverColor)
      case ButtonType.red:
        return ButtonRedStyle($loading, hoverColor)
      case ButtonType.subtle:
        return SubtleStyle($loading)
      default:
        return Primary1Style($loading, hoverColor)
    }
  }}
`

export const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

export const StyledLoading = styled(IconLoading)`
  @keyframes circleRotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  animation: circleRotate 1s linear infinite;
`
