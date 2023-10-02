import React, { useState, useMemo, useRef, useEffect } from 'react'
import { sendSMSGeneration, verifyOTPGeneration } from 'services/auth'
import { useCountDownTimer } from 'utils/hooks/useCountDownTimer/useCountDownTimer'
import { saveOtpIsSent, saveOtpTimerIsStart } from 'utils/otpUtils'
import { encryptValue } from 'utils/encryptionUtils'
import { IconLoading, Modal } from 'components/atoms'
import styles from '../../../styles/components/organisms/otp.module.scss'
import { getRecaptchaToken } from 'services/firebase'
import {
  trackOtpClose,
  trackOtpResendClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import {
  HTTPResponseStatusCode,
  LanguageCode,
  LocalStorageKey,
} from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { t } from 'config/localization/locales/id'
import { useUtils } from 'services/context/utilsContext'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

export const OTP = ({
  phoneNumber,
  isOpened,
  closeModal,
  isOtpVerified,
  onFailed,
  savedTokenAfterVerify,
  pageOrigination,
}: any): JSX.Element => {
  const { lastOtpSentTime, setLastOtpSentTime } = useUtils()
  const [otp, setOtp] = useState<string>(' ')
  const [isErrorInput, setIsErrorInput] = useState<boolean>(false)
  const [isInit, setIsInit] = useState(true)
  const [isCountDownEnd, setIsCountDownEnd] = useState(false)
  const [isError, setIsError] = useState(false)
  const [commonErrorMessage, setCommonErrorMessage] = useState('')
  const [tooManyRequestError, setTooManyRequestError] = useState('')

  const valueLength = 6
  const RE_DIGIT = new RegExp(/^\d+$/)
  const RECAPTCHA_CONTAINER = 'recaptcha-container'
  const RecaptchaNode = `<div id=${RECAPTCHA_CONTAINER}></div>`
  const recaptchaWrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const RESEND_OTP_INTERVAL = 1000 * 60 * 2
  const [, setLastOptSentPhoneNumber] = useLocalStorage<string>(
    LocalStorageKey.LastOtpSentPhoneNumber,
    '',
  )
  const [isFieldClicked, setIsFieldClicked] = useState(false)

  const { countDownTime, startCountDownTime, setCountDownTimeInMilliseconds } =
    useCountDownTimer({
      countDownTimeInMilliseconds: 0,
      onEndOfTime: () => {
        setIsCountDownEnd(true)
      },
    })

  const onChange = (value: string) => {
    setOtp(value)
    if (isInputQualified(value)) {
      handleSubmit(value)
    }
  }

  const isInputQualified = (payload: string): boolean => {
    const temp = payload.split('')
    return payload.length === valueLength && !temp.includes(' ')
  }

  const valueItems = useMemo(() => {
    const valueArray = otp.split('')
    const items: Array<string> = []

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i]

      if (RE_DIGIT.test(char)) {
        items.push(char)
      } else {
        items.push('')
      }
    }

    return items
  }, [otp, valueLength])

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const target = e.target
    let targetValue = target.value.trim()
    const isTargetValueDigit = RE_DIGIT.test(targetValue)

    if (!isTargetValueDigit && targetValue !== '') {
      return
    }

    targetValue = isTargetValueDigit ? targetValue : ' '

    const targetValueLength = targetValue.length

    if (targetValueLength === 1) {
      const newValue =
        otp.substring(0, idx) + targetValue + otp.substring(idx + 1)

      onChange(newValue)

      if (!isTargetValueDigit) {
        return
      }
      focusToNextInput(target)
      const nextElementSibling =
        target.nextElementSibling as HTMLInputElement | null

      if (nextElementSibling) {
        nextElementSibling.focus()
      }
    } else if (targetValueLength === valueLength) {
      onChange(targetValue)
      target.blur()
    }
  }

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e
    const target = e.target as HTMLInputElement
    const targetValue = target.value

    if (e.key === 'Backspace') setIsErrorInput(false)

    target.setSelectionRange(0, targetValue.length)

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault()
      return focusToNextInput(target)
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault()
      return focusToPrevInput(target)
    }

    if (e.key !== 'Backspace' || target.value !== '') {
      return
    }

    focusToPrevInput(target)

    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null

    if (previousElementSibling) {
      previousElementSibling.focus()
    }
  }

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null

    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus()
    }

    target.setSelectionRange(0, target.value.length)
    if (!isFieldClicked)
      trackEventCountly(CountlyEventNames.WEB_OTP_CLICK, {
        PAGE_ORIGINATION: pageOrigination,
      })
    setIsFieldClicked(true)
  }

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null

    if (nextElementSibling) {
      nextElementSibling.focus()
    }
  }
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null

    if (previousElementSibling) {
      previousElementSibling.focus()
    }
  }

  useEffect(() => {
    startTimer()
  }, [isError, isCountDownEnd])

  useEffect(() => {
    sessionStorage.removeItem('lastOtpSent')
    sessionStorage.removeItem('lastOtpSentPhoneNumber')
    sendOtpCode()
  }, [])

  const shouldShowTimer = (): boolean => {
    return !isCountDownEnd && !isError
  }

  const startTimer = (): void => {
    const countDownTimeInMilliSeconds =
      RESEND_OTP_INTERVAL - (Date.now() - lastOtpSentTime)
    if (
      countDownTimeInMilliSeconds >= 0 &&
      countDownTimeInMilliSeconds <= RESEND_OTP_INTERVAL
    ) {
      setCountDownTimeInMilliseconds(countDownTimeInMilliSeconds)
      setIsCountDownEnd(false)
      startCountDownTime()
    } else {
      setIsCountDownEnd(true)
    }
  }

  const getCaptchaToken = async (): Promise<any> => {
    try {
      if (recaptchaWrapperRef) {
        recaptchaWrapperRef.current.innerHTML = RecaptchaNode
      }
      const recaptchaToken = await getRecaptchaToken(
        LanguageCode.id,
        RECAPTCHA_CONTAINER,
      )
      return recaptchaToken
    } catch (error) {
      setCommonErrorMessage(t.common.errorMessage)
      throw error
    }
  }

  const handleSubmit = async (payload: string) => {
    try {
      const res: any = await verifyOTPGeneration(payload, `+62${phoneNumber}`)
      isOtpVerified()
      if (savedTokenAfterVerify)
        localStorage.setItem('token', JSON.stringify(res.data))
      sessionStorage.removeItem('lastOtpSent')
      sessionStorage.removeItem('lastOtpSentPhoneNumber')
    } catch (error: any) {
      if (
        (error.response?.status as HTTPResponseStatusCode) ===
        HTTPResponseStatusCode.BadRequest
      ) {
        setIsErrorInput(true)
      } else {
        setCommonErrorMessage(t.common.errorMessage)
        onFailed()
        setIsErrorInput(true)
      }
    }
  }

  const sendOtpCode = async () => {
    const captcha = await getCaptchaToken()
    try {
      await sendSMSGeneration(captcha, `+62${phoneNumber}`)
      setIsInit(false)
      setCountDownTimeInMilliseconds(0)
      setLastOtpSentTime(Date.now())
      setLastOptSentPhoneNumber(encryptValue(phoneNumber.toString()))
      saveOtpIsSent('true')
      saveOtpTimerIsStart('true')
      setIsCountDownEnd(false)
      setIsError(false)
      shouldShowTimer()
    } catch (error: any) {
      if (
        (error.response?.status as HTTPResponseStatusCode) ===
        HTTPResponseStatusCode.TooManyRequest
      ) {
        setTooManyRequestError(
          'Kamu sudah meminta OTP. Mohon tunggu beberapa saat sebelum meminta OTP baru.',
        )
        setIsInit(false)
        setCountDownTimeInMilliseconds(0)
        setLastOtpSentTime(Date.now())
        setLastOptSentPhoneNumber(encryptValue(phoneNumber.toString()))
        saveOtpIsSent('true')
        saveOtpTimerIsStart('true')
        setIsCountDownEnd(false)
        setIsError(false)
        shouldShowTimer()
      } else {
        setCommonErrorMessage(t.common.errorMessage)
      }
    }
  }

  const resendOtp = async () => {
    trackOtpResendClick({ Page_Origination: window.location.href })
    trackEventCountly(CountlyEventNames.WEB_OTP_RESEND_CLICK, {
      PAGE_ORIGINATION: pageOrigination,
    })
    const captcha = await getCaptchaToken()
    try {
      if (recaptchaWrapperRef) {
        recaptchaWrapperRef.current.innerHTML = RecaptchaNode
      }
      await sendSMSGeneration(captcha, `+62${phoneNumber}`)
      setLastOtpSentTime(Date.now())
      setLastOptSentPhoneNumber(encryptValue(phoneNumber.toString()))
      saveOtpTimerIsStart('true')
      setIsCountDownEnd(false)
      setIsError(false)
      shouldShowTimer()
    } catch (error: any) {
      if (
        (error.response?.status as HTTPResponseStatusCode) ===
        HTTPResponseStatusCode.TooManyRequest
      ) {
        setTooManyRequestError(
          'Kamu sudah meminta OTP. Mohon tunggu beberapa saat sebelum meminta OTP baru.',
        )
        setLastOtpSentTime(Date.now())
        setLastOptSentPhoneNumber(encryptValue(phoneNumber.toString()))
        saveOtpTimerIsStart('true')
        setIsCountDownEnd(false)
        setIsError(false)
        shouldShowTimer()
        onFailed()
      } else {
        setCommonErrorMessage(t.common.errorMessage)
      }
      onFailed()
    }
  }

  const handleCloseModal = (): void => {
    trackOtpClose({ Page_Origination: window.location.href })
    sessionStorage.removeItem('lastOtpSent')
    sessionStorage.removeItem('lastOtpSentPhoneNumber')
    closeModal()
  }

  const render = () => {
    if (isInit) {
      return (
        <div className={styles.iconWrapper}>
          <IconLoading width={14} height={14} color="#52627A" />
        </div>
      )
    } else if (!isInit && shouldShowTimer()) {
      return (
        <p className={styles.descText} data-testid={elementId.Login.TimerOTP}>
          Mohon tunggu {countDownTime.minutes}:{countDownTime.seconds} detik
          untuk kirim ulang
        </p>
      )
    } else {
      return (
        <button
          onClick={() => resendOtp()}
          className={styles.buttonResend}
          data-testid={elementId.Login.Button.Resend}
        >
          Kirim ulang kode verifikasi
        </button>
      )
    }
  }

  return (
    <div>
      <Modal
        width={343}
        open={isOpened}
        onCancel={() => handleCloseModal()}
        maskStyle={{
          background: 'rgba(19, 19, 27, 0.5)',
          maxWidth: '570px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div className={styles.content}>
          <h2
            className={styles.titleText}
            data-testid={elementId.Login.TitleTextOTP}
          >
            Verifikasi Nomor Kamu
          </h2>
          <p
            className={styles.subTitleText}
            data-testid={elementId.Login.SubtitleTextOTP}
          >
            Kode dikirimkan ke 0{phoneNumber}
          </p>
          {tooManyRequestError && (
            <p className={styles.textAlert}>{tooManyRequestError}</p>
          )}
          <div className={styles.otpGroup}>
            {valueItems.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{1}"
                maxLength={6}
                className={`${isErrorInput && styles.otpError} ${
                  styles.otpInput
                }`}
                value={digit}
                onChange={(e) => inputOnChange(e, idx)}
                onKeyDown={inputOnKeyDown}
                onFocus={inputOnFocus}
                data-testid={elementId.Input.OTP}
              />
            ))}
          </div>
          {commonErrorMessage ? (
            <p className={styles.textAlert}>{commonErrorMessage}</p>
          ) : (
            render()
          )}
          <div ref={recaptchaWrapperRef} className={styles.captcha}>
            {RecaptchaNode}
          </div>
        </div>
      </Modal>
    </div>
  )
}
