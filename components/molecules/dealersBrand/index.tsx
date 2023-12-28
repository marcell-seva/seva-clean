import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/dealerBrand.module.scss'
import Space from 'antd/lib/space'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'
import Image from 'next/image'
import { dealerBrandUrl } from 'utils/helpers/routes'

const LogoToyota = '/revamp/icon/logo-toyota.webp'
const LogoDaihatsu = '/revamp/icon/logo-daihatsu.webp'
const Isuzu = '/revamp/icon/logo-isuzu.webp'
const LogoBmw = '/revamp/icon/logo-bmw.webp'
const Peugeot = '/revamp/icon/logo-peugeot.webp'
const Hyundai = '/revamp/icon/logo-hyundai.webp'

export interface DealerBrandProps {
  isButtonClick?: boolean | undefined
}

interface BrandProps {
  key: string
  icon: JSX.Element
  value: string
}

export const DealerBrands = ({ isButtonClick }: DealerBrandProps) => {
  const carList: BrandProps[] = [
    {
      key: 'Toyota',
      icon: (
        <Image
          src={LogoToyota}
          alt="Toyota"
          style={{ width: 21, height: 18 }}
          width={21}
          height={18}
        />
      ),
      value: 'Toyota',
    },
    {
      key: 'Daihatsu',
      icon: (
        <Image
          src={LogoDaihatsu}
          alt="Daihatsu"
          style={{ width: 21.6, height: 15 }}
          width={21.6}
          height={15}
        />
      ),
      value: 'Daihatsu',
    },
    {
      key: 'Isuzu',
      icon: (
        <Image
          src={Isuzu}
          alt="Isuzu"
          style={{ width: 21.6, height: 7.2 }}
          width={21.6}
          height={7.2}
        />
      ),
      value: 'Isuzu',
    },
    {
      key: 'BMW',
      icon: (
        <Image
          src={LogoBmw}
          alt="BMW"
          style={{ width: 19.2, height: 19.2 }}
          width={19.2}
          height={19.2}
        />
      ),
      value: 'BMW',
    },
    {
      key: 'Peugeot',
      icon: (
        <Image
          src={Peugeot}
          alt="Peugeot"
          style={{ width: 17.49, height: 19.2 }}
          width={17.49}
          height={19.2}
        />
      ),
      value: 'Peugeot',
    },
    {
      key: 'Hyundai',
      icon: (
        <Image
          src={Hyundai}
          alt="Hyundai"
          style={{ width: 24, height: 24 }}
          width={24}
          height={24}
        />
      ),
      value: 'Hyundai',
    },
  ]

  const onClick = (key: string) => {
    const brandCarRoute = dealerBrandUrl.replace(':brand', key).toLowerCase()
    window.location.href = brandCarRoute
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dealer Mobil berdasarkan Merek</h2>
      <div className={styles.wrapperContainer}>
        {carList.map(({ key, icon, value }) => {
          return (
            <div
              onClick={() => onClick(value)}
              key={key}
              className={styles.boxFilter}
            >
              <div className={styles.content}>
                {icon} {key}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
