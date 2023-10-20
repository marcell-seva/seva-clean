import { Divider, Select, Space, ConfigProvider } from 'antd'
import type { SelectProps } from 'antd'
import { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/form/formCarLocation.module.scss'
import { CloseOutlined2 } from 'components/atoms/icon/CloseOutlined2'
import { IconChevronDown, IconChevronUp } from 'components/atoms'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'

const { Option } = Select

interface CarLocationProps {
  cityList: any
  setLocationSelected: any
  isResetFilter: boolean
  isApplied: boolean
}

interface Option {
  cityId: number
  cityName: string
  province?: string
}

export const FormCarLocation = ({
  cityList,
  setLocationSelected,
  isResetFilter,
  isApplied,
}: CarLocationProps) => {
  const { funnelQuery } = useFunnelQueryUsedCarData()
  const [chosen, setChosen] = useState(
    funnelQuery.city_id ? funnelQuery.city_id : [],
  )
  const [totalChosen, setTotalChosen] = useState(0)
  const [changeIcon, setChangeIcon] = useState(false)
  const handleChange = (value: any) => {
    setTotalChosen(value.length)
    setChosen(value)
    setLocationSelected(value)
  }

  const handleClearFilter = () => {
    setChosen([])
    setTotalChosen(0)
    setLocationSelected([])
    return
  }

  useEffect(() => {
    if (isResetFilter) {
      handleClearFilter()
    }
    // if (funnelQuery.location && !isApplied) {
    //   setChosen(funnelQuery.location)
    // }
  }, [isResetFilter, isApplied])

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
            placeholder="Pilih lokasi mobil"
            onChange={(e) => handleChange(e)}
            onDropdownVisibleChange={() => {
              setChangeIcon(!changeIcon)
            }}
            className={styles.inputStyle}
            notFoundContent={
              <div className={styles.notFound}>Kota tidak ditemukan</div>
            }
            size="large"
            value={chosen}
            suffixIcon={
              changeIcon ? (
                <IconChevronUp color="#13131B" width={33} height={27} />
              ) : (
                <IconChevronDown color="#13131B" width={33} height={27} />
              )
            }
            optionFilterProp="value"
            dropdownStyle={{ padding: '4px 0' }}
            getPopupContainer={() =>
              document.getElementById('formCarLocation')!
            }
            removeIcon={
              <div className={styles.removeIcon}>
                <CloseOutlined2 color="#F5F6F6" width={4.59} height={4.59} />
              </div>
            }
            listItemHeight={36}
            dropdownRender={(menu) => (
              <>
                <div className={styles.dropdownDivider}>
                  <div>{totalChosen} Kota dipilih</div>
                  <div
                    onClick={() => {
                      handleClearFilter()
                    }}
                    className={styles.clearSelect}
                  >
                    Hapus Pilihan
                  </div>
                </div>
                <Divider style={{ margin: '0' }} />
                {menu}
              </>
            )}
          >
            {cityList.map((item: Option) => (
              <Option
                key={item.cityId}
                value={item.cityId}
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
