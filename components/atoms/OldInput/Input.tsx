import React, {
  ForwardedRef,
  InputHTMLAttributes,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import elementId from 'helpers/elementIds'

export enum InputTheme {
  default = 'default',
  profilePage = 'profile-page',
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  inputTheme?: InputTheme
  suffixIcon?: () => JSX.Element
  prefixComponent?: () => JSX.Element
  prefixMarginRight?: number
  bottomComponent?: () => JSX.Element
  height?: number
  ref?: ForwardedRef<HTMLInputElement>
  overrideRedBorder?: boolean
  overrideHeightMobile?: boolean
  citySelectorMobile?: boolean
  dataTestId?: string
  name?: string
}

const noForwardRefInput = (
  {
    type,
    onFocus,
    onBlur,
    prefixComponent,
    suffixIcon,
    bottomComponent,
    dataTestId,
    name,
    prefixMarginRight = 0,
    height = 56,
    overrideRedBorder = false,
    overrideHeightMobile = false,
    citySelectorMobile = false,
    inputTheme = InputTheme.default,
    ...restProps
  }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>,
): ReactElement => {
  const [nameForm, setNameForm] = useState('')
  useEffect(() => {
    if (name === 'birthdate-register') {
      setNameForm(elementId.HamburgerMenu.Register.BirthDate)
    }
  }, [])
  return (
    <StyledContainer>
      <StyledInputArea
        {...restProps}
        theme={inputTheme}
        height={height}
        overrideRedBorder={overrideRedBorder}
        overrideHeightMobile={overrideHeightMobile}
      >
        {prefixComponent && prefixComponent()}
        <StyledInput
          data-testid={dataTestId || nameForm}
          type={type}
          ref={ref}
          {...restProps}
          onFocus={onFocus}
          onBlur={onBlur}
          prefixMarginRight={prefixMarginRight}
          citySelectorMobile={citySelectorMobile}
          className={'input-element'}
        />
        {suffixIcon && suffixIcon()}
      </StyledInputArea>
      {bottomComponent && bottomComponent()}
    </StyledContainer>
  )
}
export const Input = React.forwardRef(noForwardRefInput)

const StyledContainer = styled.div`
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  text-transform: capitalize;
`

const DefaultTheme = css`
  border-radius: 16px;
  :focus-within {
    border-color: ${colors.label};
  }
`

//temporary same as default
const ProfileTheme = css`
  border-radius: 16px;
  :focus-within {
    border-color: ${colors.label};
  }
`

const StyledInputArea = styled.div<{
  height: number
  overrideRedBorder: boolean
  overrideHeightMobile: boolean
  theme: InputTheme
  disabled?: boolean
}>`
  padding-left: 12px;
  padding-right: 12px;
  height: ${({ height }) => height}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${({ disabled }) => (disabled ? '#F5F5F5' : colors.white)};
  border: 1.5px solid
    ${({ overrideRedBorder }) =>
      overrideRedBorder ? colors.primaryRed : colors.placeholder};

  ${({ theme }) =>
    theme === InputTheme.profilePage ? ProfileTheme : DefaultTheme}

  input {
    font-family: var(--kanyon);
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0px;

    ::placeholder {
      font-family: var(--kanyon);
      font-style: normal;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0px;
    }
  }

  @media (max-width: 1024px) {
    padding: 0 16px;
    height: ${({ overrideHeightMobile, height }) =>
      overrideHeightMobile ? height : '46'}px;
  }
`
const StyledInput = styled.input<{
  prefixMarginRight: number
  citySelectorMobile: boolean
}>`
  margin-left: ${({ prefixMarginRight }) => prefixMarginRight}px;
  width: 100%;
  border: 0;
  padding: 0;
  background: ${colors.white};
  color: ${colors.title};
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  font-family: ${({ citySelectorMobile }) =>
    citySelectorMobile ? 'var(--open-sans)' : 'var(--kanyon)'};
  font-size: ${({ citySelectorMobile }) =>
    citySelectorMobile ? '14px' : '16px'};
  line-height: ${({ citySelectorMobile }) =>
    citySelectorMobile ? '16px' : '24px'};
  font-weight: 400;
  ::placeholder {
    color: ${({ citySelectorMobile }) =>
      citySelectorMobile ? '#52627A' : colors.placeholder};

    @media (max-width: 1024px) {
      font-size: 12px;
    }
  }

  :disabled {
    background-color: #f5f5f5;
    &::placeholder {
      color: ${colors.placeholder};
    }
  }
`
