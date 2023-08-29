import React from 'react'
import styled, { keyframes } from 'styled-components'
import { colors } from '../../../styles/colors'
import { Loading as LoadingIcon } from '../icon/OldLoading'

export const Loading = () => {
  return (
    <StyledWrapper>
      <StyledLoading color={colors.primary1} />
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const StyledLoading = styled(LoadingIcon)`
  animation: ${rotate} 1s linear infinite;
  color: ${colors.primary1};
`
