import { BackIcon, IconShare } from 'components/atoms'
import React, { useContext } from 'react'
import { carResultsUrl } from 'utils/helpers/routes'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import Img from 'react-cool-img'
import { TitleHeader } from '../TitleHeader/TitleHeader'
import { HeaderAndContentProps } from 'components/organisms/HeaderAndContent/HeaderAndContent'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useCar } from 'services/context/carContext'
import Image from 'next/image'

export interface CarHeaderProps extends HeaderAndContentProps {
  onClickShare: () => void
  isSticky: boolean
}

export function CarHeader({
  onClickShare,
  isSticky,
  ...props
}: CarHeaderProps) {
  const router = useRouter()
  const { carModelDetails } = useCar()
  const { dataCombinationOfCarRecomAndModelDetailDefaultCity } =
    useContext(PdpDataLocalContext)
  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity

  const handleGoBack = () => {
    router.push(carResultsUrl)
  }

  return (
    <ContainerBg>
      <LinearLeft />
      <Container>
        <Header>
          <IconControlWrapper>
            <BackArrow onClick={handleGoBack}>
              <BackIcon width={16} height={16} />
            </BackArrow>
            <div onClick={onClickShare}>
              <IconShare
                color={colors.primaryDarkBlue}
                width={21}
                height={24}
              />
            </div>
          </IconControlWrapper>
          <DesktopWrapper>
            {modelDetailData?.images && (
              <StyledImage
                src={modelDetailData.images[0]}
                width={354}
                height={265}
                alt={`Warna Mobil ${
                  modelDetailData.brand
                } ${modelDetailData.model.replace('-', ' ')} Bagian Depan`}
                priority
              />
            )}
            <TitleHeader {...props} />
          </DesktopWrapper>
        </Header>
        {/* <TitleHeaderMobile isSticky={isSticky} /> */}
      </Container>
      <LinearRight />
    </ContainerBg>
  )
}

const ContainerBg = styled.div`
  width: 100%;

  /* background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 75%,
    rgba(187, 233, 255, 1) 100%,
    rgba(100, 190, 232, 1) 100%
  ); */
  @media (min-width: 1025px) {
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
    justify-content: space-between;
  }
`

const LinearLeft = styled.div`
  max-width: 200px;
  width: 100%;
  background: linear-gradient(
    88.16deg,
    #64bee8 -172.82%,
    rgba(187, 233, 255, 0) 100.77%
  );
`

const LinearRight = styled(LinearLeft)`
  transform: rotate(180deg);
`

const Container = styled.div`
  @media (min-width: 1025px) {
    min-width: 1040px;
    max-width: 1040px;
    width: 100%;
    padding: 35px 0 56px !important;
  }
`

const Header = styled.div`
  position: relative;
  padding: 0 67px 0 68px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 169.74px;

  @media (min-width: 1025px) {
    height: auto;
    margin-top: 0;
    padding: 0;
    align-items: flex-end;
  }
`

const IconControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  padding: 0 28.37px 0 23.71px;
  top: 0;

  @media (min-width: 1025px) {
    padding: 0 24.35px 0 29.05px;
  }
`

const StyledImage = styled(Image)`
  width: 100%;

  @media (min-width: 1025px) {
    width: 354px;
    height: 265px;
    object-fit: contain;
  }
`

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 85px;
  margin-top: 21px;
`

export const BackArrow = styled.div<{ sticky?: boolean }>``
