import React, { ForwardedRef, InputHTMLAttributes, ReactElement } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import elementId from 'helpers/elementIds'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  suffixIcon?: () => JSX.Element
  prefixComponent?: () => JSX.Element
  prefixMarginRight?: number
  bottomComponent?: () => JSX.Element
  height?: number
  ref?: ForwardedRef<HTMLInputElement>
  overrideBorder?: string
  overrideRedBorder?: boolean
  overrideHeightMobile?: boolean
  citySelectorMobile?: boolean
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
    height = 56,
    name,
    overrideRedBorder = false,
    overrideHeightMobile = false,
    overrideBorder,
    ...restProps
  }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>,
): ReactElement => {
  return (
    <StyledContainer>
      <StyledInputArea
        {...restProps}
        height={height}
        overrideBorder={overrideBorder}
        overrideRedBorder={overrideRedBorder}
        overrideHeightMobile={overrideHeightMobile}
      >
        {prefixComponent && prefixComponent()}
        {type === 'tel' && name === null ? (
          <StyledInput
            data-testid={elementId.Homepage.CarSearchWidget.InputPhoneNumber}
            type={type}
            ref={ref}
            {...restProps}
            onFocus={onFocus}
            onBlur={onBlur}
            className={'input-element'}
          />
        ) : type === 'tel' && name === 'login-phone-number' ? (
          <StyledInput
            data-testid={elementId.HamburgerMenu.Login.InputPhoneNumber}
            type={type}
            ref={ref}
            {...restProps}
            onFocus={onFocus}
            onBlur={onBlur}
            className={'input-element'}
          />
        ) : (
          <StyledInput
            data-testid={name}
            type={type}
            ref={ref}
            {...restProps}
            onFocus={onFocus}
            onBlur={onBlur}
            className={'input-element'}
          />
        )}
        {suffixIcon && suffixIcon()}
      </StyledInputArea>
      {bottomComponent && bottomComponent()}
    </StyledContainer>
  )
}
export const NewInput = React.forwardRef(noForwardRefInput)

const InputFont = css`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: 0px;
  color: ${colors.label};
`

const StyledContainer = styled.div`
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`
const StyledInputArea = styled.div<{
  height: number
  overrideBorder?: string
  disabled?: boolean
  overrideRedBorder: boolean
  overrideHeightMobile: boolean
}>`
  padding: 9px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${({ disabled }) => (disabled ? '#F5F5F5' : colors.white)};
  border: 0.5px solid
    ${({ overrideRedBorder, overrideBorder }) =>
      overrideRedBorder
        ? colors.primaryRed
        : overrideBorder
        ? overrideBorder
        : colors.label};
  border-radius: 4px;
  :focus-within {
    border-color: ${colors.label};
  }
`
const StyledInput = styled.input`
  ${InputFont}
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  background: ${colors.white};
  color: ${colors.label};
  &::placeholder {
    color: ${colors.label};
    opacity: 0.5;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  :disabled {
    background-color: #f5f5f5;
    &::placeholder {
      color: ${colors.placeholder};
    }
  }
`
