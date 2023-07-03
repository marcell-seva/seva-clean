import React from 'react'
import styled from 'styled-components'

const LogoToyota = 'assets/icon/logo-toyota.webp'
const LogoDaihatsu = '/v3/assets/icon/logo-daihatsu.webp'
const Isuzu = '/v3/assets/icon/logo-isuzu.webp'
const LogoBmw = '/v3/assets/icon/logo-bmw.webp'
const Peugeot = '/v3/assets/icon/logo-peugeot.webp'

export const BrandIcon = ({ brand }: { brand: string }) => {
  return (
    <StyledIcon>
      {
        {
          Toyota: (
            <img
              src={LogoToyota}
              alt="Toyota"
              style={{ width: 21, height: 18 }}
            />
          ),
          Daihatsu: (
            <img
              src={LogoDaihatsu}
              alt="Daihatsu"
              style={{ width: 21.6, height: 15 }}
            />
          ),
          BMW: (
            <img
              src={LogoBmw}
              alt="BMW"
              style={{ width: 19.2, height: 19.2 }}
            />
          ),
          Peugeot: (
            <img
              src={Peugeot}
              alt="Peugeot"
              style={{ width: 17.49, height: 19.2 }}
            />
          ),
          Isuzu: (
            <img src={Isuzu} alt="Isuzu" style={{ width: 21.6, height: 7.2 }} />
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
