import React from 'react'
import styled from 'styled-components'
// import { useInstalmentFreeModal } from 'pages/VariantListPageSeva/InstalmentFreeModal/InstalmentFreeModal'
import { useMediaQuery } from 'react-responsive'

const webImage = '/v3/assets/illustration/car_search_desktop.png'
const mobileImage = '/v3/assets/illustration/car_search_mobile.png'

export const FreeInstallment = () => {
  // const {
  //   InstalmentFreeModal,
  //   showModal: showInstalmentFreeModal,
  // } = useInstalmentFreeModal()
  const isTablet = useMediaQuery({ query: '(min-width: 1025px)' })

  const handleModal = (event: React.MouseEvent) => {
    event.stopPropagation()
    // showInstalmentFreeModal()
  }

  const renderImage = () => {
    if (!isTablet) {
      return <StyledMobileImage src={mobileImage} />
    } else {
      return <StyledWebImage src={webImage} />
    }
  }

  return (
    <>
      <StyledContainer onClick={handleModal}>{renderImage()}</StyledContainer>
      {/* <InstalmentFreeModal /> */}
    </>
  )
}

const StyledContainer = styled.div`
  width: 100%;
  border-radius: 16px;
  cursor: pointer;
`

const StyledWebImage = styled.img`
  object-fit: fill;
  width: inherit;
  border-radius: 16px;
`

const StyledMobileImage = styled.img`
  border-radius: 16px;
  object-fit: fill;
  width: inherit;
`
