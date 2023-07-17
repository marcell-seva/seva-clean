import { Forward } from 'components/atoms/icon/Forward'
import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { LinkLabelMediumBold } from 'utils/typography/LinkLabelMediumBold'

interface Props {
  label: string
}

export const BackItem = ({ label }: Props) => {
  return (
    <>
      <Wrapper>
        <StyledArrow>
          <Forward />
        </StyledArrow>
        <StyledText>{label}</StyledText>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid ${colors.line};
`

const StyledArrow = styled.div`
  display: flex;
  align-items: center;
  transform: rotate(180deg);
`

const StyledText = styled(LinkLabelMediumBold)`
  color: ${colors.primary1};
  margin-top: 3px;
  margin-left: 14px;
`
