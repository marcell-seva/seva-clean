import React, { ForwardedRef, InputHTMLAttributes, ReactElement } from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { colors } from 'styles/colors'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  suffixIcon?: () => JSX.Element
  prefixComponent?: () => JSX.Element
  prefixMarginRight?: number
  bottomComponent?: () => JSX.Element
  height?: number
  ref?: ForwardedRef<HTMLInputElement>
  overrideRedBorder?: boolean
  isCarResultPage?: boolean
  textInputStyle?: FlattenSimpleInterpolation
  textPlaceholderStyle?: FlattenSimpleInterpolation
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
    prefixMarginRight = 0,
    height = 56,
    name,
    overrideRedBorder = false,
    ...restProps
  }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>,
): ReactElement => {
  return (
    <StyledContainer>
      <StyledInputArea
        {...restProps}
        height={height}
        overrideRedBorder={overrideRedBorder}
      >
        {prefixComponent && prefixComponent()}
        <StyledInput
          data-testid={name}
          name={name}
          type={type}
          ref={ref}
          {...restProps}
          onFocus={onFocus}
          onBlur={onBlur}
          prefixMarginRight={prefixMarginRight}
          className={'input-element'}
          textInputStyle={restProps.textInputStyle}
          textPlaceholderStyle={restProps.textPlaceholderStyle}
        />
        {suffixIcon && suffixIcon()}
      </StyledInputArea>
      {bottomComponent && bottomComponent()}
    </StyledContainer>
  )
}
export const InputV2 = React.forwardRef(noForwardRefInput)

const StyledContainer = styled.div`
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`
const StyledInputArea = styled.div<{
  height: number
  overrideRedBorder: boolean
}>`
  padding: 8px 7px;
  height: ${({ height }) => height}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${colors.white};
  border: 0.5px solid
    ${({ overrideRedBorder }) =>
      overrideRedBorder ? colors.primaryRed : colors.placeholder};
  border-radius: 4px;
  :focus-within {
    border-color: ${colors.label};
  }
  @media (max-width: 1024px) {
    height: 32px;
  }
`

const StyledText = css`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  color: ${colors.title};

  @media (min-width: 1025px) {
    font-size: 14px;
    line-height: 20px;
  }
`
const StyledInput = styled.input<{
  prefixMarginRight: number
  textInputStyle?: FlattenSimpleInterpolation
  textPlaceholderStyle?: FlattenSimpleInterpolation
}>`
  ${({ textInputStyle }) => (textInputStyle ? textInputStyle : StyledText)}
  margin-left: ${({ prefixMarginRight }) => prefixMarginRight}px;
  width: 100%;
  border: 0;
  padding: 0;
  background: ${colors.white};
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  ::placeholder {
    ${({ textPlaceholderStyle }) =>
      textPlaceholderStyle ? textPlaceholderStyle : StyledText}
  }
`
