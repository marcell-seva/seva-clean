import styled, { css } from 'styled-components'

export const TextLegalRegularStyle = css`
  font-family: var(--open-sans);
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
`

export const TextLegalRegular = styled.span`
  ${TextLegalRegularStyle}
`
