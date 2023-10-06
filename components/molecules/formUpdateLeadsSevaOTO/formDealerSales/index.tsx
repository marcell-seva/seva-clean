import Fuse from 'fuse.js'
import elementId from 'helpers/elementIds'
import React, { useEffect, useRef, useState } from 'react'
import {
  IconChevronDown,
  IconRemove,
  InputSelect,
  Label,
} from 'components/atoms'
import { LabelWithTooltip } from 'components/molecules'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { FormControlValue, Location, Option } from 'utils/types'
import { LocalStorageKey } from 'utils/enum'
import styles from 'styles/components/molecules/formUpdateLeadsSevaOTO/formDealerSales.module.scss'
import { SalesAgent } from 'utils/types/utils'
import { getAgent } from 'services/agents'

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.1,
}

type FormSelectAgentProps = {
  name: string
  handleChange: (value: any) => void
  isError?: boolean
  onShowDropdown?: () => void
}

export default function FormDealerSales({
  handleChange,
  name,
  isError = false,
  onShowDropdown,
}: FormSelectAgentProps) {
  const [agentListApi, setAgentListApi] = useState<Array<SalesAgent>>([])
  const [inputValue, setInputValue] = useState('')
  const [lastChoosenValue, setLastChoosenValue] = useState('')

  const [agentListOptionsFull, setAgentListOptionsFull] = useState<
    Option<string>[]
  >([])
  const [suggestionsLists, setSuggestionsLists] = useState<any>([])
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const fetchAgent = async () => {
    const response = await getAgent()
    setAgentListApi(response.data)
  }

  useEffect(() => {
    fetchAgent()
  }, [])

  useEffect(() => {
    const options = getAgentListOption(agentListApi)
    setAgentListOptionsFull(options)
  }, [agentListApi])

  const getAgentListOption = (agentList: SalesAgent[]) => {
    const tempArray: Option<string>[] = []
    for (const item of agentList) {
      const tempObj: Option<string> = {
        label: '',
        value: '',
      }
      tempObj.value = item?.salesName
      tempObj.label = `${item?.salesName} - ${item?.branchName}`
      tempArray.push(tempObj)
    }
    return tempArray
  }

  const onChangeInputHandler = (value: string) => {
    setInputValue(
      value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    )
  }

  const onBlurHandler = (e: any) => {
    if (e.target.value === '') {
      setLastChoosenValue('')
      handleChange(0)
      setInputValue('')
    } else {
      setInputValue(lastChoosenValue)
    }
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  const onChooseHandler = (item: Option<FormControlValue>) => {
    setLastChoosenValue(item.label)

    const selectedAgent = agentListApi.find(
      (agent) => agent.salesName + ' - ' + agent.branchName === item.label,
    )
    if (selectedAgent) {
      handleChange(selectedAgent.id)
      window.dispatchEvent(new Event('storage'))
    }
  }

  const onResetHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()

    setInputValue('')
  }

  useEffect(() => {
    if (inputValue === '') {
      setSuggestionsLists(agentListOptionsFull)

      return
    }

    const fuse = new Fuse(agentListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue)
    const result = suggestion.map((obj) => obj.item)

    // sort alphabetically
    // result.sort((a: any, b: any) => a.label.localeCompare(b.label))

    // sort based on input
    const sorted = result.sort((a: any, b: any) => {
      if (a.label.startsWith(inputValue) && b.label.startsWith(inputValue))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(inputValue)) return -1
      else if (b.label.startsWith(inputValue)) return 1

      return a.label.localeCompare(b.label)
    })

    setSuggestionsLists(sorted)
  }, [inputValue, agentListOptionsFull])

  return (
    <>
      <div className={styles.labelWrapper}>
        <Label name="agent">Dealer & Sales Agent</Label>
      </div>

      <InputSelect
        ref={inputRef}
        value={inputValue}
        options={suggestionsLists}
        onChange={onChangeInputHandler}
        placeholderText="Choose Sales Agent"
        noOptionsText="Agent tidak ditemukan"
        onBlurInput={onBlurHandler}
        onChoose={onChooseHandler}
        isClearable={false}
        disableIconClick={false}
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
                <IconChevronDown width={25} height={25} color={'#13131B'} />
              </div>
            )
          }
        }}
        isError={isError}
        onShowDropdown={onShowDropdown}
      />
    </>
  )
}
