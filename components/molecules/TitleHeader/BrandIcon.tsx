import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

const LogoToyota = '/assets/icon/logo-toyota.webp'
const LogoDaihatsu = '/assets/icon/logo-daihatsu.webp'
const Isuzu = '/assets/icon/logo-isuzu.webp'
const LogoBmw = '/assets/icon/logo-bmw.webp'
const Peugeot = '/assets/icon/logo-peugeot.webp'

export const BrandIcon = ({ brand }: { brand: string }) => {
  return (
    <StyledIcon>
      {
        {
          Toyota: (
            <Image src={LogoToyota} alt="Toyota" width={47} height={41} />
          ),
          Daihatsu: (
            <Image src={LogoDaihatsu} alt="Daihatsu" width={47} height={33} />
          ),
          BMW: <Image src={LogoBmw} alt="BMW" width={47} height={47} />,
          Peugeot: <Image src={Peugeot} alt="Peugeot" width={47} height={52} />,
          Isuzu: <Image src={Isuzu} alt="Isuzu" width={47} height={15} />,
        }[brand]
      }
    </StyledIcon>
  )
}

const StyledIcon = styled.div`
  padding-right: 13px;
  padding-left: 4px;
`
