import elementId from 'helpers/elementIds'
import React, { useRef, useState } from 'react'
import { Option } from 'utils/types/utils'
import { IconChevronDown, IconRemove, InputSelect } from 'components/atoms'
import styles from 'styles/components/atoms/input.module.scss'
import styles2 from 'styles/components/molecules/assuranceModal.module.scss'

interface Props {
  ageList: Option<string>[]
  name: string
  handleChange: (name: string, value: any) => void
  defaultValue: string
  onShowDropdown?: () => void
  isError?: boolean
  setIsAssuranceModal?: any
}

export const FormAsuransiCredit: React.FC<Props> = ({
  ageList,
  name,
  handleChange,
  defaultValue,
  onShowDropdown,
  setIsAssuranceModal,
  isError = false,
}) => {
  const [selectedAge, setSelectedAge] = useState<string>(defaultValue)
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  React.useEffect(() => {
    if (defaultValue) {
      setSelectedAge(defaultValue)
    }
  }, [defaultValue])

  const handleAgeChange = (value: string) => {
    setSelectedAge(value)
    handleChange(name, value)
  }

  const onResetHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
    // setLastChoosenValue('')
    handleChange(name, '')
    setSelectedAge('')
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  return (
    <>
      <p className={styles.titleText}>Asuransi</p>
      <p className={styles2.subtitle}>
        Untuk mengetahui perbedaan asuransi lebih lanjut, baca{' '}
        <span
          className={styles2.link}
          onClick={() => {
            setIsAssuranceModal(true)
          }}
        >
          di sini
        </span>
      </p>
      <InputSelect
        ref={inputRef}
        value={selectedAge}
        options={ageList}
        onChange={handleAgeChange}
        placeholderText="Pilih asuransi"
        isSearchable={false}
        rightIcon={(state) => {
          if (state.isOpen) {
            return (
              <div
                onMouseDown={onResetHandler}
                onClick={onResetHandler}
                style={{ cursor: 'pointer' }}
              >
                <IconRemove width={25} height={25} color={'#13131B'} />
              </div>
            )
          } else {
            return (
              <div
                onMouseDown={onClickArrowHandler}
                onClick={onClickArrowHandler}
                style={{ cursor: 'pointer' }}
              >
                <IconChevronDown
                  width={25}
                  height={25}
                  color={'#13131B'}
                  alt="SEVA Dropdown Icon"
                />
              </div>
            )
          }
        }}
        isClearable={false}
        datatestid={elementId.LoanCalculator.Button.Age}
        optionTestid={elementId.Field.Age}
        onShowDropdown={onShowDropdown}
        isError={isError}
      />
    </>
  )
}
