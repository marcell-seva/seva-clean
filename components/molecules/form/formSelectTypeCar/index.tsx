import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formSelectBrandCar.module.scss'
import { Space } from 'antd'
import {
  IconMPV,
  IconSUV,
  IconSedan,
  IconHatchback,
  IconSport,
} from '../../../atoms'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import elementId from 'helpers/elementIds'

export interface FilterMobileProps {
  setIsCheckedType?: any
  isResetFilter?: boolean
  isApplied?: boolean
  bodyType?: any
  setResetTmp: any
  isButtonClick: boolean | undefined
}
interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
  isChecked: boolean
}

export const FormSelectTypeCar = ({
  setIsCheckedType,
  isResetFilter,
  bodyType,
  isApplied,
  // setResetTmp,
  isButtonClick,
}: FilterMobileProps) => {
  const { funnelQuery } = useFunnelQueryData()
  const [isCheckedTypeQuery, setIsCheckedTypeQuery] = useState<string[]>(
    funnelQuery.bodyType ? funnelQuery.bodyType : [],
  )
  // setIsCheckedType(isCheckedTypeQuery)
  const onClick = (key: string) => {
    if (isCheckedTypeQuery.includes(key)) {
      setIsCheckedTypeQuery(isCheckedTypeQuery.filter((item) => item !== key))
      setIsCheckedType(isCheckedTypeQuery.filter((item) => item !== key))
      paramQuery.bodyType = isCheckedTypeQuery.filter((item) => item !== key)
    } else {
      setIsCheckedTypeQuery(isCheckedTypeQuery.concat(key))
      setIsCheckedType(isCheckedTypeQuery.concat(key))
      paramQuery.bodyType = isCheckedTypeQuery.concat(key)
    }
  }
  const paramQuery = funnelQuery
  const carList: CarButtonProps[] = [
    {
      key: 'MPV',
      icon: <IconMPV width={24} height={24} />,
      value: 'MPV',
      isChecked: isCheckedTypeQuery.includes('MPV'),
    },
    {
      key: 'SUV',
      icon: <IconSUV width={24} height={24} />,
      value: 'SUV',
      isChecked: isCheckedTypeQuery.includes('SUV'),
    },
    {
      key: 'Sedan',
      icon: <IconSedan width={24} height={24} />,
      value: 'SEDAN',
      isChecked: isCheckedTypeQuery.includes('SEDAN'),
    },
    {
      key: 'Hatchback',
      icon: <IconHatchback width={24} height={24} />,
      value: 'HATCHBACK',
      isChecked: isCheckedTypeQuery.includes('HATCHBACK'),
    },
    {
      key: 'Sport',
      icon: <IconSport width={24} height={24} />,
      value: 'SPORT',
      isChecked: isCheckedTypeQuery.includes('SPORT'),
    },
  ]

  useEffect(() => {
    if (isResetFilter) {
      setIsCheckedTypeQuery([])
      // setResetTmp(false)
      // setIsCheckedType([])
      // paramQuery.bodyType = []
    }

    if (!isApplied && bodyType && bodyType.length === 0) {
      setIsCheckedTypeQuery([])
    } else if (funnelQuery.bodyType && !isResetFilter && isApplied) {
      setIsCheckedType(funnelQuery.bodyType)
      paramQuery.bodyType = funnelQuery.bodyType
    }
    if (
      isButtonClick &&
      isCheckedTypeQuery.length === 0 &&
      bodyType &&
      bodyType.length > 0 &&
      !isApplied
    ) {
      setIsCheckedTypeQuery(bodyType.split(','))
      setIsCheckedType(bodyType.split(','))
    }
    if (isApplied) {
      setIsCheckedType(isCheckedTypeQuery)
    }
    if (
      !isButtonClick &&
      isCheckedTypeQuery.length > 0 &&
      funnelQuery.bodyType?.length === 0 &&
      !isApplied
    ) {
      setIsCheckedTypeQuery([])
    }
  }, [isResetFilter, isApplied, isButtonClick])

  return (
    <div className={styles.container}>
      <Space size={[16, 16]} wrap>
        {carList.map(({ key, value, icon, isChecked }) => {
          return (
            <>
              <div
                onClick={() => onClick(value)}
                key={key}
                className={!isChecked ? styles.box : styles.boxOnclick}
                data-testid={`${elementId.Type}${key}`}
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
