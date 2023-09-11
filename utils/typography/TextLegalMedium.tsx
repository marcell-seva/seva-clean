import styled, { css } from 'styled-components'

export const TextLegalMediumStyle = css`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
`

export const TextLegalMedium = styled.span`
  ${TextLegalMediumStyle}
`
