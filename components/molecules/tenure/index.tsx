import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import elementId from 'helpers/elementIds'
import { TextLegalMediumStyle } from 'utils/typography/TextLegalMedium'

export const Tenure = () => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const [tenure, setTenure] = useState(Number(funnelQuery.tenure) || 5)
  useEffect(() => {
    setTenure(Number(funnelQuery.tenure))
  }, [funnelQuery])

  return (
    <StyledTenureWrapper>
      {[1, 2, 3, 4, 5].map((item, index) => (
        <TenureBlock
          data-testid={
            elementId.Homepage.CarSearchWidget.TenorOption + (index + 1)
          }
          key={index}
          selected={tenure === item}
          onClick={() => {
            setTenure(item)
            patchFunnelQuery({ tenure: item, isDefaultTenureChanged: true })
          }}
        >
          {item}
        </TenureBlock>
      ))}
    </StyledTenureWrapper>
  )
}

const StyledTenureWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4.39px;
  align-items: center;
`

const TenureBlock = styled.div<{ selected?: boolean }>`
  background-color: ${colors.inputBg};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 35.09px;
  border: ${({ selected }) => (selected ? '0.5px' : 0)} solid
    ${colors.primaryDarkBlue};

  ${TextLegalMediumStyle}
  line-height: 22px;
  color: ${colors.label};
  cursor: pointer;

  @media (min-width: 1025px) {
    font-weight: 400;
  }
`
