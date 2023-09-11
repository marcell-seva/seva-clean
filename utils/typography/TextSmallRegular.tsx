import styled, { css } from 'styled-components'

export const TextSmallRegularStyle = css`
  font-family: var(--open-sans);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
`
export const TextSmallRegular = styled.span`
  ${TextSmallRegularStyle};
`
