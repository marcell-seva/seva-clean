import { createGlobalStyle } from 'styled-components'

export const MaxWidthStyle = createGlobalStyle`
  html body {
    max-width: none;
    overflow-x: hidden !important;
  }
`
