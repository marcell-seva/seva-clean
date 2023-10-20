import React, { useContext, useEffect, useState, MouseEvent } from 'react'
import styles from '/styles/components/molecules/form/formSelectBrandCar.module.scss'
import stylec from '/styles/components/molecules/searchWidget/gridOptionWidget.module.scss'
import { Space } from 'antd'
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
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { initDataWidget } from 'components/organisms/searchWidget'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
}

const brandList: CarButtonProps[] = [
  {
    key: 'Toyota',
    icon: (
      <Image src={LogoToyota} alt="Toyota" style={{ width: 21, height: 18 }} />
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
      />
    ),
    value: 'Daihatsu',
  },
  {
    key: 'Isuzu',
    icon: (
      <Image src={Isuzu} alt="Isuzu" style={{ width: 21.6, height: 7.2 }} />
    ),
    value: 'Isuzu',
  },
  {
    key: 'BMW',
    icon: (
      <Image src={LogoBmw} alt="BMW" style={{ width: 19.2, height: 19.2 }} />
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
      />
    ),
    value: 'Peugeot',
  },
]

const typeList = [
  {
    key: 'MPV',
    icon: <IconMPV width={24} height={24} />,
    value: 'MPV',
  },
  {
    key: 'SUV',
    icon: <IconSUV width={24} height={24} />,
    value: 'SUV',
  },
  {
    key: 'Sedan',
    icon: <IconSedan width={24} height={24} />,
    value: 'Sedan',
  },
  {
    key: 'Hatchback',
    icon: <IconHatchback width={24} height={24} />,
    value: 'Hatchback',
  },
  {
    key: 'Sport',
    icon: <IconSport width={24} height={24} />,
    value: 'Sport',
  },
]

type GridOptionWidgetProps = {
  type: 'brand' | 'bodyType'
  errorToastMessage: string
  onClose: () => void
  trackCountlyOnSubmit?: (checkedOption: string[]) => void
  trackCountlyOnReset?: () => void
}

const GridOptionWidget = ({
  type,
  onClose,
  errorToastMessage,
  trackCountlyOnSubmit,
  trackCountlyOnReset,
}: GridOptionWidgetProps) => {
  const optionslist =
    type === 'bodyType' ? typeList : type === 'brand' ? brandList : []

  const testId =
    type === 'bodyType'
      ? elementId.Type
      : type === 'brand'
      ? elementId.Logo
      : ''

  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const [checkedOption, setCheckedOption] = useState<string[]>(
    funnelWidget[type].length > 0 ? funnelWidget[type] : initDataWidget[type],
  )
  const [disableActionButton, setDisableActionButton] = useState(true)
  const [showToast, setShowToast] = useState<'error' | ''>('')

  const onChooseOption = (value: string) => {
    if (checkedOption.includes(value)) {
      if (checkedOption.length === 1) {
        return setShowToast('error')
      }
      setCheckedOption(checkedOption.filter((x) => x !== value))
    } else {
      setCheckedOption((prev) => [...prev, value])
    }
  }

  const clear = () => {
    trackCountlyOnReset && trackCountlyOnReset()
    setCheckedOption(initDataWidget[type])
  }

  const submit = () => {
    trackCountlyOnSubmit && trackCountlyOnSubmit(checkedOption)
    saveFunnelWidget({ ...funnelWidget, [type]: checkedOption })
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
    if (funnelWidget[type].length > 0 || checkedOption.length < 5) {
      setDisableActionButton(false)
    } else {
      setDisableActionButton(true)
    }
  }, [checkedOption])

  return (
    <>
      <div className={styles.container}>
        <Space size={[16, 16]} wrap>
          {optionslist.map(({ key, icon, value }) => {
            const styleClassname = !checkedOption.includes(key)
              ? styles.box
              : styles.boxOnclick

            return (
              <div
                role="button"
                onClick={() => {
                  onChooseOption(value)
                }}
                key={key}
                className={styleClassname}
                data-testid={`${testId}${
                  key === 'BMW' ? key : key.toLowerCase()
                }`}
              >
                <div className={styles.content}>
                  {icon} <span>{key}</span>
                </div>
              </div>
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
        <Toast
          typeToast="error"
          text={errorToastMessage}
          visible={showToast === 'error'}
          onCancel={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            setShowToast('')
          }}
        />
      </div>
    </>
  )
}

export default GridOptionWidget
