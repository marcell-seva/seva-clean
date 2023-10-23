import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/form/formSelectBrandCar.module.scss'
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
  brandList: any
  isResetFilter?: boolean
  isApplied?: boolean
  brand?: any
  setResetTmp: any
  isButtonClick: boolean | undefined
}
interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
  isChecked: boolean
}

interface BrandList {
  makeId: number | null
  makeCode: string
  makeName: string
  logoUrl: string | null
}

export const FormSelectBrandUsedCar = ({
  setIsCheckedBrand,
  brandList,
  isResetFilter,
  isApplied,
  brand,
  // setResetTmp,
  isButtonClick,
}: FilterMobileProps) => {
  const { funnelQuery } = useFunnelQueryData()
  const [isCheckedBrandQuery, setIsCheckedBrandQuery] = useState<string[]>(
    brand ? brand : [],
  )
  // setIsCheckedBrand(isCheckedBrandQuery)
  const logoList = {
    Toyota: LogoToyota,
    Daihatsu: LogoDaihatsu,
    Isuzu: Isuzu,
    BMW: LogoBmw,
    Peugeot: Peugeot,
  }
  const sizeLogo = {
    Toyota: '21,18',
    Daihatsu: '21.6,15',
    Isuzu: '21.6,7.2',
    BMW: '19.2,19.2',
    Peugeot: '17.49,19.2',
  }
  const carList: CarButtonProps[] = brandList.map((obj: BrandList) => {
    return {
      key: obj.makeName,
      icon: (
        <Image
          src={logoList[obj.makeName as keyof typeof logoList]}
          alt={obj.makeName}
          width={parseInt(
            sizeLogo[obj.makeName as keyof typeof sizeLogo]?.split(',')[0],
          )}
          height={parseInt(
            sizeLogo[obj.makeName as keyof typeof sizeLogo]?.split(',')[1],
          )}
        />
      ),
      value: obj.makeCode,
      isChecked: isCheckedBrandQuery.includes(obj.makeCode),
    }
  })
  const onClick = (key: string) => {
    if (isCheckedBrandQuery.includes(key)) {
      setIsCheckedBrand(isCheckedBrandQuery.filter((item) => item !== key))
      setIsCheckedBrandQuery(isCheckedBrandQuery.filter((item) => item !== key))
      paramQuery.brand = isCheckedBrandQuery.filter((item) => item !== key)
    } else {
      setIsCheckedBrand(isCheckedBrandQuery.concat(key))
      setIsCheckedBrandQuery(isCheckedBrandQuery.concat(key))
      paramQuery.brand = isCheckedBrandQuery.concat(key)
    }
  }
  useEffect(() => {
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
  }, [isResetFilter, isApplied, isButtonClick])
  const paramQuery = funnelQuery

  return (
    <div className={styles.container}>
      <Space size={[16, 16]} wrap>
        {carList.map(({ key, icon, value, isChecked }) => {
          return (
            <>
              {value === 'other' ? (
                <div
                  onClick={() => onClick(value)}
                  key={key}
                  className={!isChecked ? styles.box : styles.boxOnclick}
                >
                  <div className={styles.content}>{key}</div>
                </div>
              ) : (
                <div
                  onClick={() => onClick(value)}
                  key={key}
                  className={!isChecked ? styles.box : styles.boxOnclick}
                >
                  <div className={styles.content}>
                    {icon} {key}
                  </div>
                </div>
              )}
            </>
          )
        })}
      </Space>
    </div>
  )
}
