import clsx from 'clsx'
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styles from '/styles/components/molecules/searchWidget/selectWidget.module.scss'
import { filterNonDigitCharacters } from 'utils/handler/stringManipulation'
import { Currency } from 'utils/handler/calculation'
import { MinAmount } from 'utils/types/models'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

interface InputWidgetProps {
  title: string
  placeholder: string
  name: 'downPaymentAmount' | 'monthlyIncome'
  value: string | number
  icon: JSX.Element
  errorText?: string | JSX.Element
  datatestid?: string
}

const InputWidget = ({
  title,
  icon,
  placeholder,
  name,
  errorText,
  value,
  datatestid,
}: InputWidgetProps) => {
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const initialValue = {
    raw: value,
    formatted: Currency(value),
  }
  const [inputValue, setValue] = useState<any>(initialValue)
  const [focus, setFocus] = useState(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    const rawVal = filterNonDigitCharacters(val)

    if (val === '0') return

    saveFunnelWidget({ ...funnelWidget, [name]: rawVal })
  }

  const enableShake = useMemo(() => {
    if (inputValue.raw < MinAmount[name]) return false
    return true
  }, [inputValue.raw])

  const getFilterType = () => {
    if (name === 'downPaymentAmount') {
      return 'DP'
    } else if (name === 'monthlyIncome') {
      return 'Income'
    }
  }

  const onFocus = () => {
    setFocus(true)
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_SMART_SEARCH_FIELD_CLICK, {
      FILTER_TYPE: getFilterType(),
    })
  }

  const onBlur = () => {
    setFocus(false)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [funnelWidget[name]])

  return (
    <div className={clsx({ ['shake-animation-X']: errorText && enableShake })}>
      <div className={styles.container}>
        <div className={styles.fieldContainer}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.fieldWrapper}>
            <span className={styles.title}>{title}</span>
            <div className={styles.prefixInputWrapper}>
              {(focus || (initialValue.raw as number) > 0) && (
                <span
                  className={clsx({
                    [styles.placeholder]: true,
                    [styles.focused]: focus,
                  })}
                >
                  Rp
                </span>
              )}
              <input
                type="tel"
                maxLength={13}
                value={inputValue.formatted}
                className={styles.inputWrapper}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                data-testid={datatestid}
              />
            </div>
          </div>
        </div>
        <div
          className={clsx({
            [styles.line]: true,
            [styles.error]: errorText,
            [styles.active]: focus && !errorText,
          })}
        />
        {errorText && <span className={styles.errorText}>{errorText}</span>}
      </div>
    </div>
  )
}

export default InputWidget
