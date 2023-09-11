import styled, { css } from 'styled-components'

export const TextMediumRegularStyle = css`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
`

export const TextMediumRegular = styled.h2`
  ${TextMediumRegularStyle}
`
