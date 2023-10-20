import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formSelectBrandCar.module.scss'
import { Space } from 'antd'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'
import Image from 'next/image'

const LogoToyota = '/revamp/icon/logo-toyota.webp'
const LogoDaihatsu = '/revamp/icon/logo-daihatsu.webp'
const Isuzu = '/revamp/icon/logo-isuzu.webp'
const LogoBmw = '/revamp/icon/logo-bmw.webp'
const Peugeot = '/revamp/icon/logo-peugeot.webp'

export interface FilterMobileProps {
  setIsCheckedBrand: any
  isCheckedBrand: any
  isResetFilter?: boolean
  isApplied?: boolean
  brand?: any
  isSelected: boolean
  setResetTmp: any
  isButtonClick: boolean | undefined
}
interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
  isChecked: boolean
}

export const FormSelectBrandCarSevaOTO = ({
  setIsCheckedBrand,
  isCheckedBrand,
  isResetFilter,
  isApplied,
  isSelected,
  brand,
  // setResetTmp,
  isButtonClick,
}: FilterMobileProps) => {
  const { funnelQuery } = useFunnelQueryData()

  const [isCheckedBrandQuery, setIsCheckedBrandQuery] =
    useState<string[]>(isCheckedBrand)

  // setIsCheckedBrand(isCheckedBrandQuery)
  const carList: CarButtonProps[] = [
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
      isChecked: isCheckedBrandQuery.includes('Toyota'),
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
      isChecked: isCheckedBrandQuery.includes('Daihatsu'),
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
      isChecked: isCheckedBrandQuery.includes('Isuzu'),
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
      isChecked: isCheckedBrandQuery.includes('BMW'),
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
      isChecked: isCheckedBrandQuery.includes('Peugeot'),
    },
  ]
  const onClick = (key: string) => {
    if (isCheckedBrandQuery.includes(key)) {
      setIsCheckedBrand(isCheckedBrandQuery.filter((item) => item !== key))
      setIsCheckedBrandQuery(isCheckedBrandQuery.filter((item) => item !== key))
      paramQuery.brand = isCheckedBrandQuery.filter((item) => item !== key)
    } else {
      setIsCheckedBrand([key])
      setIsCheckedBrandQuery([key])
      paramQuery.brand = [key]
    }
  }
  useEffect(() => {
    if (isCheckedBrand) {
      setIsCheckedBrandQuery(isCheckedBrand)
    }
    if (isResetFilter) {
      setIsCheckedBrandQuery([])
      // setResetTmp(false)
      // setIsCheckedBrand([])
      // paramQuery.brand = []
    }
    if (!isApplied && brand && brand.length === 0) {
      setIsCheckedBrandQuery([])
    } else if (funnelQuery.brand && !isResetFilter && isApplied) {
      setIsCheckedBrand(funnelQuery.brand)
      paramQuery.brand = funnelQuery.brand
    }
    if (
      isButtonClick &&
      isCheckedBrandQuery.length === 0 &&
      brand &&
      brand.length > 0 &&
      !isApplied
    ) {
      setIsCheckedBrandQuery(brand.split(','))
      setIsCheckedBrand(brand.split(','))
    }
    if (isApplied) {
      setIsCheckedBrand(isCheckedBrandQuery)
    }
    if (
      !isButtonClick &&
      isCheckedBrandQuery.length > 0 &&
      funnelQuery.brand?.length === 0 &&
      !isApplied
    ) {
      setIsCheckedBrandQuery([])
    }
  }, [
    isResetFilter,
    isApplied,
    isButtonClick,
    isCheckedBrand,
    setIsCheckedBrand,
  ])
  const paramQuery = funnelQuery

  return (
    <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
      <Space size={[16, 16]} wrap>
        {carList.map(({ key, icon, value, isChecked }) => {
          return (
            <>
              <div
                onClick={() => (isSelected ? onClick(key) : '')}
                key={key}
                className={!isChecked ? styles.box : styles.boxOnclick}
                data-testid={`${elementId.Logo}${
                  key === 'BMW' ? key : key.toLowerCase()
                }`}
                style={
                  isSelected
                    ? { background: 'white', cursor: 'pointer' }
                    : { background: '#F5F6F6', cursor: 'not-allowed' }
                }
              >
                <div className={styles.content}>
                  {icon} {key}
                </div>
              </div>
            </>
          )
        })}
      </Space>
    </div>
  )
}
