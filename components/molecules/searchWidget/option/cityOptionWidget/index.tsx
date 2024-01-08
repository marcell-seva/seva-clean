import { Divider, Select, Space, ConfigProvider } from 'antd'
import type { SelectProps } from 'antd'
import { useEffect, useState, useContext, useRef } from 'react'
import styles from 'styles/components/molecules/form/formSearchModel.module.scss'
import { CloseOutlined2 } from 'components/atoms/icon/CloseOutlined2'
import { IconChevronDown, IconChevronUp, IconSearch } from 'components/atoms'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
} from 'services/context'
import { getModelUsedCar } from 'services/api'
import { isMobileDevice } from 'utils/window'
import { capitalizeWords } from 'utils/stringUtils'
import { useUtils } from 'services/context/utilsContext'
import { CityOtrOption } from 'utils/types'

const { Option } = Select

interface CarLocationProps {
  modelList?: any
  setLocationSelected?: any
  isResetFilter?: boolean
}

export const CityOptionWidget = ({
  modelList,
  setLocationSelected,
  isResetFilter,
}: CarLocationProps) => {
  const { cities } = useUtils()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType
  const [chosen, setChosen] = useState(
    funnelWidget.model ? funnelWidget.model : [],
  )
  const [selectedBrand, setSelectedBrand] = useState([])
  const [totalChosen, setTotalChosen] = useState(0)
  const [changeIcon, setChangeIcon] = useState(false)
  const [options, setOptions] = useState(cities)

  const distinctData = options.filter((value: any, index: any, self: any) => {
    const indexOfItem = self.findIndex(
      (item: any) =>
        item.brandName === value.brandName &&
        item.modelName === value.modelName &&
        item.modelCode === value.modelCode,
    )
    return indexOfItem === index
  })

  const onBlurAction = (value: any) => {
    const temp = distinctData.filter((data: any) =>
      value.includes(data.modelName),
    )

    const mappingTemp = temp.map((data: any) =>
      data.isAstra ? data.brandName.toLowerCase() : 'other',
    )

    const filteredTemp = mappingTemp.filter(
      (value: any, index: any, self: any) => {
        const indexOfItem = self.findIndex((item: any) => item === value)
        return indexOfItem === index
      },
    )

    saveFunnelWidget({ ...funnelWidget, brand: filteredTemp })
  }

  const handleChange = (value: any) => {
    setTotalChosen(value.length)
    setChosen(value)
    setLocationSelected(value)
  }

  const handleClearFilter = () => {
    setChosen([])
    setTotalChosen(0)
    setLocationSelected([])
    setSelectedBrand([])
    return
  }

  useEffect(() => {
    if (isResetFilter) {
      handleClearFilter()
    }
  }, [isResetFilter])

  return (
    <div className={styles.container} id="formCarLocation">
      <ConfigProvider
        theme={{
          components: {
            Select: {
              optionPadding: '0',
              optionSelectedBg: 'white',
            },
          },
        }}
      >
        <Space style={{ width: '100%' }} direction="vertical">
          <Select
            mode="multiple"
            placeholder="Cari model mobil bekas"
            placement={isMobileDevice ? 'topLeft' : 'bottomLeft'}
            onChange={(e) => {
              handleChange(e)
              onBlurAction(e)
            }}
            onDropdownVisibleChange={() => {
              setChangeIcon(!changeIcon)
            }}
            className={styles.inputStyle}
            notFoundContent={
              <div className={styles.notFound}>Model tidak ditemukan</div>
            }
            size="large"
            value={chosen}
            suffixIcon={
              <IconSearch color="#13131B" width={33} height={27} />
              // changeIcon ? (
              //   <IconChevronUp color="#13131B" width={33} height={27} />
              // ) : (
              //   <IconChevronDown color="#13131B" width={33} height={27} />
              // )
            }
            optionFilterProp="label"
            dropdownStyle={{
              padding: '4px 0',
            }}
            removeIcon={
              <div className={styles.removeIcon}>
                <CloseOutlined2 color="#F5F6F6" width={4.59} height={4.59} />
              </div>
            }
            listItemHeight={36}
            dropdownRender={(menu) => (
              <>
                <Divider style={{ margin: '0' }} />
                {menu}
              </>
            )}
          >
            {distinctData.map((item: CityOtrOption, index: number) => (
              <Option
                key={index}
                value={item.cityName}
                label={item.cityName}
                style={{
                  padding: '18px 16px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: '400',
                }}
              >
                {item.cityName}
              </Option>
            ))}
          </Select>
        </Space>
      </ConfigProvider>
    </div>
  )
}
