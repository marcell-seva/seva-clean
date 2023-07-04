import { useEffect, useState } from 'react'
import { prefixWithZero } from 'utils/handler/stringManipulation'

interface Time {
  hours: string
  minutes: string
  seconds: string
}
interface CountDownTimerProps {
  countDownTimeInMilliseconds: number
  onEndOfTime?: () => void
}

export const useCountDownTimer = ({
  countDownTimeInMilliseconds,
  onEndOfTime,
}: CountDownTimerProps) => {
  const millisecond = 1000
  const timeUnit = 60
  const [countDownTime, setCountDownTime] = useState<number>(
    countDownTimeInMilliseconds,
  )
  const [isStart, setIsStart] = useState(false)

  const startCountDownTime = () => setIsStart(true)

  const setCountDownTimeInMilliseconds = (
    countDownTimeInMillisecondsParam: number,
  ) => setCountDownTime(countDownTimeInMillisecondsParam)

  const getCountdownData = (timePeriod: number): Time => {
    const hours = Math.floor(timePeriod / (millisecond * timeUnit * timeUnit))
    const minutes = Math.floor(
      (timePeriod % (millisecond * timeUnit * timeUnit)) /
        (millisecond * timeUnit),
    )
    const seconds = Math.floor(
      (timePeriod % (millisecond * timeUnit)) / millisecond,
    )
    return {
      hours: prefixWithZero(hours),
      minutes: prefixWithZero(minutes),
      seconds: prefixWithZero(seconds),
    }
  }

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout
    if (isStart) {
      countdownInterval = setInterval(() => {
        setCountDownTime((count) => {
          if (count <= millisecond) {
            clearInterval(countdownInterval)
            setIsStart(false)
            onEndOfTime && onEndOfTime()
            return 0
          } else {
            return count - millisecond
          }
        })
      }, millisecond)
    }
    return () => {
      isStart && clearInterval(countdownInterval)
    }
  }, [isStart])

  return {
    countDownTime: getCountdownData(countDownTime),
    startCountDownTime,
    setCountDownTimeInMilliseconds,
  }
}
