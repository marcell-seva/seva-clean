import React, { useContext, useEffect, useState, MouseEvent } from 'react'
import styles from '/styles/components/molecules/form/formSelectBrandCarFilter.module.scss'
import stylec from '/styles/components/molecules/searchWidget/gridOptionWidget.module.scss'
import Space from 'antd/lib/space'
import Image from 'next/image'
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
import { getBrandList, getDealer, getNewCarBrand } from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import { capitalizeWords } from 'utils/stringUtils'

const LogoToyota = '/revamp/icon/logo-toyota.webp'
const LogoDaihatsu = '/revamp/icon/logo-daihatsu.webp'
const Isuzu = '/revamp/icon/logo-isuzu.webp'
const LogoBmw = '/revamp/icon/logo-bmw.webp'
const Peugeot = '/revamp/icon/logo-peugeot.webp'
const Honda = '/revamp/icon/honda.webp'
const Hyundai = '/revamp/icon/hyundai.webp'
const Suzuki = '/revamp/icon/suzuki.webp'
const Mitsubishi = '/revamp/icon/mitsubishi.webp'

interface BrandList {
  makeId: number | null
  makeCode: string
  makeName: string
  logoUrl: string | null
}

interface FilterMobileProps {
  isDealer?: boolean
  onClose: () => void
  brandSelected?: string
  setBrandSelected?: any
}

const BrandUsedCarWidget = ({
  onClose,
  isDealer,
  brandSelected,
  setBrandSelected,
}: FilterMobileProps) => {
  const { brand, saveDealerBrand } = useUtils()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType

  const [isCheckedBrandQuery, setIsCheckedBrandQuery] = useState<string[]>(
    isDealer
      ? brandSelected
        ? brandSelected.split('#')
        : []
      : funnelWidget.brand
      ? funnelWidget.brand
      : [],
  )
  const [brandList, setBrandList] = useState([])
  const [newCarBrandList, setNewCarBrandList] = useState([])

  const getListBrand = async () => {
    const response = await getBrandList('')
    setBrandList(response.data)
  }

  const getListNewBrand = async () => {
    const response = await getNewCarBrand()
    setNewCarBrandList(response)
  }

  useEffect(() => {
    getListBrand()
    getListNewBrand()
  }, [])

  const logoList = {
    Daihatsu: LogoDaihatsu,
    Toyota: LogoToyota,
    Isuzu: Isuzu,
    BMW: LogoBmw,
    Peugeot: Peugeot,
    Honda: Honda,
    Hyundai: Hyundai,
    Mitsubishi: Mitsubishi,
    Suzuki: Suzuki,
  }
  const sizeLogo = {
    Toyota: '21,18',
    Daihatsu: '21.6,15',
    Isuzu: '21.6,7.2',
    BMW: '19.2,19.2',
    Peugeot: '17.49,19.2',
    Honda: '27,14.25',
    Hyundai: '18,18',
    Mitsubishi: '26,15',
    Suzuki: '21,14.25',
  }
  const carList: CarButtonProps[] = (
    isDealer ? newCarBrandList : brandList
  ).map((obj: BrandList) => {
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
      setIsCheckedBrandQuery([value])
    }
  }

  const reset = () => {
    if (funnelWidget.brand.length > 0) {
      return
    } else {
      setIsCheckedBrandQuery([])
      setDisableActionButton(true)
    }
  }

  const clear = () => {
    if (isDealer) {
      setBrandSelected('')
      setIsCheckedBrandQuery([])
      setDisableActionButton(true)
      return
    }
    if (funnelWidget.brand.length > 0) {
      saveFunnelWidget({ ...funnelWidget, brand: [] })
      setIsCheckedBrandQuery([])
      setDisableActionButton(true)
    } else {
      setIsCheckedBrandQuery([])
      setDisableActionButton(true)
    }
  }

  const submit = () => {
    saveFunnelWidget({ ...funnelWidget, brand: isCheckedBrandQuery })
    if (isDealer) {
      setBrandSelected(isCheckedBrandQuery[0])
    }

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
      <div className={styles.container} onBlur={reset}>
        <div className={styles.wrapperContainer}>
          {carList.map(({ key, icon, value, isChecked }) => {
            return (
              <>
                {value === 'other' ? (
                  <div
                    onClick={() => onClick(value)}
                    key={key}
                    className={
                      !isChecked ? styles.boxFilter : styles.boxOnclickFilter
                    }
                  >
                    <div className={styles.content}>{key}</div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      isDealer ? onChooseOption(value) : onClick(value)
                    }}
                    key={key}
                    className={
                      !isChecked ? styles.boxFilter : styles.boxOnclickFilter
                    }
                  >
                    <div className={styles.content}>
                      {icon} {key}
                    </div>
                  </div>
                )}
              </>
            )
          })}
        </div>
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
