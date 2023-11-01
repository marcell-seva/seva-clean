import React, { useContext, useEffect, useState, MouseEvent } from 'react'
import styles from '/styles/components/molecules/form/formSelectBrandCar.module.scss'
import stylec from '/styles/components/molecules/searchWidget/gridOptionWidget.module.scss'
import Space from 'antd/lib/space'
import LogoToyota from '/public/revamp/icon/logo-toyota.webp'
import LogoDaihatsu from '/public/revamp/icon/logo-daihatsu.webp'
import Isuzu from '/public/revamp/icon/logo-isuzu.webp'
import LogoBmw from '/public/revamp/icon/logo-bmw.webp'
import Peugeot from '/public/revamp/icon/logo-peugeot.webp'
import Image from 'next/image'
import {
  IconHatchback,
  IconMPV,
  IconSUV,
  IconSedan,
  IconSport,
} from 'components/atoms/icon'
import elementId from 'utils/helpers/trackerId'
import { Button, Toast } from 'components/atoms'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
  SearchWidgetContext,
  SearchWidgetContextType,
} from 'services/context'
import { initDataWidget } from 'components/organisms/searchWidget'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import { CarButtonProps } from 'utils/types/context'
import { getBrandList } from 'services/api'

interface BrandList {
  makeId: number | null
  makeCode: string
  makeName: string
  logoUrl: string | null
}

interface FilterMobileProps {
  onClose: () => void
}

const BrandUsedCarWidget = ({ onClose }: FilterMobileProps) => {
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType
  const [isCheckedBrandQuery, setIsCheckedBrandQuery] = useState<string[]>(
    funnelWidget.brand ? funnelWidget.brand : [],
  )
  const [brandList, setBrandList] = useState([])

  const getListBrand = async () => {
    const response = await getBrandList('')
    setBrandList(response.data)
  }

  useEffect(() => {
    getListBrand()
  }, [])

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
      setIsCheckedBrandQuery(isCheckedBrandQuery.filter((item) => item !== key))
      // paramQuery.brand = isCheckedBrandQuery.filter((item) => item !== key)
    } else {
      setIsCheckedBrandQuery(isCheckedBrandQuery.concat(key))
      // paramQuery.brand = isCheckedBrandQuery.concat(key)
    }
  }

  const [disableActionButton, setDisableActionButton] = useState(false)
  const [showToast, setShowToast] = useState<'error' | ''>('')

  const onChooseOption = (value: string) => {
    if (isCheckedBrandQuery.includes(value)) {
      setIsCheckedBrandQuery(isCheckedBrandQuery.filter((x) => x !== value))
    } else {
      setIsCheckedBrandQuery((prev) => [...prev, value])
    }
  }

  const clear = () => {
    setIsCheckedBrandQuery([])
    setDisableActionButton(true)
  }

  const submit = () => {
    saveFunnelWidget({ ...funnelWidget, brand: isCheckedBrandQuery })
    onClose()
  }

  useEffect(() => {
    if (showToast === 'error') {
      setTimeout(() => {
        setShowToast('')
      }, 1200)
    }
  }, [showToast])

  useEffect(() => {
    if (isCheckedBrandQuery.length === 0) {
      setDisableActionButton(true)
    } else {
      setDisableActionButton(false)
    }
  }, [isCheckedBrandQuery])

  return (
    <>
      <div className={styles.container} onBlur={clear}>
        <Space size={[16, 16]} wrap>
          {carList.map(({ key, icon, value, isChecked }) => {
            return (
              <>
                {value === 'other' ? (
                  <div
                    onClick={() => onChooseOption(value)}
                    key={key}
                    className={!isChecked ? styles.box : styles.boxOnclick}
                  >
                    <div className={styles.content}>{key}</div>
                  </div>
                ) : (
                  <div
                    onClick={() => onChooseOption(value)}
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
        <div className={stylec.actionButtonWrapper}>
          <Button
            version={ButtonVersion.Secondary}
            size={ButtonSize.Big}
            disabled={disableActionButton}
            onClick={clear}
            data-testid={elementId.FilterButton.Reset}
          >
            Atur Ulang
          </Button>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            disabled={disableActionButton}
            onClick={submit}
            data-testid={elementId.FilterButton.Submit}
          >
            Terapkan
          </Button>
        </div>
        {/* <Toast
          typeToast="error"
          text={errorToastMessage}
          visible={showToast === 'error'}
          onCancel={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            setShowToast('')
          }}
        /> */}
      </div>
    </>
  )
}

export default BrandUsedCarWidget
