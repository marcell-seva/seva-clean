import styled from 'styled-components'

const ShimmerLoader = '/revamp/illustration/placeholder.gif'

export const Shimmer = styled.div<{ radius?: number }>`
  background-image: url(${ShimmerLoader as any});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: ${({ radius }) => radius || 10}px;
`

export const StyledPlaceholder = styled.div<{
  zIndex?: number
  isMobile?: boolean
}>`
  position: absolute;
  width: 100%;
  z-index: ${({ zIndex }) => zIndex || 12};
  ${({ isMobile }) =>
    isMobile &&
    `
    max-width: 710px;
    margin: 0 auto;
  `}
`
