import { Divider, Select, Space, ConfigProvider } from 'antd'
import type { SelectProps } from 'antd'
import { useEffect, useState, useContext } from 'react'
import styles from 'styles/components/molecules/form/formSearchModel.module.scss'
import { CloseOutlined2 } from 'components/atoms/icon/CloseOutlined2'
import { IconChevronDown, IconChevronUp, IconSearch } from 'components/atoms'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
} from 'services/context'
import { getModelUsedCar } from 'services/api'

const { Option } = Select

interface CarLocationProps {
  modelList: any
  setLocationSelected?: any
  isResetFilter?: boolean
}

interface Option {
  brandName: string
  modelName: string
  modelCode: string
}

export const FormSearchModel = ({
  modelList,
  setLocationSelected,
  isResetFilter,
}: CarLocationProps) => {
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType
  const [chosen, setChosen] = useState(
    funnelWidget.model ? funnelWidget.model : [],
  )
  const [selectedBrand, setSelectedBrand] = useState([])
  const [totalChosen, setTotalChosen] = useState(0)
  const [changeIcon, setChangeIcon] = useState(false)
  const [options, setOptions] = useState(modelList)

  const distinctData = options.filter((value: any, index: any, self: any) => {
    const indexOfItem = self.findIndex(
      (item: any) =>
        item.brandName === value.brandName &&
        item.modelName === value.modelName &&
        item.modelCode === value.modelCode,
    )
    return indexOfItem === index
  })

  const formattedData = distinctData.map((item: any) => ({
    brandName: item.brandName.charAt(0) + item.brandName.slice(1).toLowerCase(),
    modelName: item.modelName,
    modelCode: item.modelCode,
  }))

  const onBlurAction = (value: any) => {
    const temp = distinctData.filter((data: any) =>
      value.includes(data.modelCode),
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
            placeholder="Cari mobil bekas"
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
            dropdownStyle={{ padding: '4px 0' }}
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
            {distinctData.map((item: Option, index: number) => (
              <Option
                key={index}
                value={item.modelCode}
                label={item.brandName + ' ' + item.modelName}
                style={{
                  padding: '18px 16px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: '400',
                }}
              >
                {item.brandName} {item.modelName}
              </Option>
            ))}
          </Select>
        </Space>
      </ConfigProvider>
    </div>
  )
}
