import styled from 'styled-components'

export const Line = styled.div<{
  width?: string
  height?: string
  background?: string
}>`
  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${height};`}
  ${({ background }) => background && `background: ${background};`}
`
