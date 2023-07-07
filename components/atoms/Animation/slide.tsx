import { css, keyframes } from 'styled-components'

export const SlideInUp = keyframes`
     from {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
`

export const SlideOutDown = keyframes`
     from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
    to {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
`

export const OpenSnackBar = css`
  animation: ${SlideInUp} 1s;
`

export const CloseSnackBar = css`
  opacity: 0;
  animation: ${SlideOutDown} 1s;
`
