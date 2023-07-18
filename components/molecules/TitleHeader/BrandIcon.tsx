import React from 'react'
import styled from 'styled-components'

const LogoToyota = 'assets/icon/logo-toyota.webp'
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
            <img
              src={LogoToyota}
              alt="Toyota"
              style={{ width: 48, height: 'auto' }}
            />
          ),
          Daihatsu: (
            <img
              src={LogoDaihatsu}
              alt="Daihatsu"
              style={{ width: 47, height: 'auto' }}
            />
          ),
          BMW: (
            <img
              src={LogoBmw}
              alt="BMW"
              style={{ width: 47, height: 'auto' }}
            />
          ),
          Peugeot: (
            <img
              src={Peugeot}
              alt="Peugeot"
              style={{ width: 47, height: 'auto' }}
            />
          ),
          Isuzu: (
            <img
              src={Isuzu}
              alt="Isuzu"
              style={{ width: 47, height: 'auto' }}
            />
          ),
        }[brand]
      }
    </StyledIcon>
  )
}

const StyledIcon = styled.div`
  padding-right: 13px;
  padding-left: 4px;
`
