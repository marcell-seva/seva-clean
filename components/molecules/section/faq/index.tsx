import React, { useState } from 'react'
import styles from 'styles/components/molecules/faq.module.scss'
import { IconQuestion } from 'components/atoms/icon'
import { IconChevronDown, IconChevronUp } from 'components/atoms'
import {
  CarVariantFAQParam,
  trackFAQExpandClick,
} from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import elementId from 'helpers/elementIds'
import { useCar } from 'services/context/carContext'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

type FaqProps = {
  question: string
  answer: string
  testid: string
}
export interface PropsInfo {
  isWithIcon?: boolean
  headingText: string
  descText: FaqProps[]
}

export const Faq: React.FC<PropsInfo> = ({
  isWithIcon,
  headingText,
  descText,
}): JSX.Element => {
  const { carModelDetails } = useCar()
  const [collIndex, setCollIndex] = useState<number[]>([-1]) //collection index
  const [expandItem, setExpandItem] = useState<number[]>([-1]) //collection expand item
  const [expandList, setExpandList] = useState(false) //expand "lihat pertanyaan lainnya"
  // const [isOpenFaq, setIsOpenFaq] = useState(false)
  // const expandRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const trackExpandFaq = (order: string, expand: boolean) => {
    const originationUrl = window.location.href.replace('https://www.', '')
    const trackProperties: CarVariantFAQParam = {
      Car_Brand: carModelDetails?.brand,
      Car_Model: carModelDetails?.model,
      FAQ_Order: order,
      Page_Origination_URL: originationUrl,
    }
    trackFAQExpandClick(
      expand
        ? TrackingEventName.WEB_PDP_FAQ_CLICK_EXPAND
        : TrackingEventName.WEB_PDP_FAQ_CLICK_CLOSE,
      trackProperties,
    )
  }

  const onChooseItem = (index: number) => {
    if (collIndex.includes(index)) {
      const removeItem = collIndex.filter((item) => item !== index)
      setCollIndex([...removeItem])
      trackExpandFaq(String(index + 1), false)
      return setTimeout(() => {
        setExpandItem([...removeItem])
      }, 450)
    }
    // setIsOpenFaq(!isOpenFaq)
    setCollIndex([...collIndex, index])
    trackExpandFaq(String(index + 1), true)
    setExpandItem([...expandItem, index])
    trackEventCountly(CountlyEventNames.WEB_PDP_FAQ_CLICK, {
      FAQ_ORDER: index + 1,
      CAR_BRAND: carModelDetails?.brand,
      CAR_MODEL: carModelDetails?.model,
    })
  }

  // useEffect(() => {
  //   if (isOpenFaq) {
  //     setTimeout(() => {
  //       expandRef.current?.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center',
  //       })
  //     }, 500)
  //   }
  // }, [isOpenFaq])

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        {isWithIcon && (
          <div className={styles.iconInfo}>
            <IconQuestion
              width={24}
              height={24}
              color="#B4231E"
              alt="SEVA Tanda Tanya Icon"
            />
          </div>
        )}
        <h3
          className={styles.textHeading}
          data-testid={elementId.Text + 'pertanyaan'}
        >
          {headingText}
        </h3>
      </div>
      <div className={styles.desc}>
        {expandList
          ? descText.map((item: FaqProps, index: any) => (
              <div
                className={styles.BoxFQ}
                style={{
                  maxHeight: collIndex.includes(index) ? '340px' : '70px',
                  transition: collIndex.includes(index)
                    ? '500ms ease-in-out'
                    : '500ms ease-out',
                }}
                key={index}
                onClick={() => onChooseItem(index)}
                data-testid={item.testid}
              >
                <div className={styles.QuestionRow}>
                  <span>{item.question}</span>
                  <div
                    className={styles.iconTransition}
                    style={{
                      transform: collIndex.includes(index)
                        ? 'rotate(180deg)'
                        : '',
                    }}
                  >
                    <IconChevronDown
                      width={16}
                      height={16}
                      alt="SEVA Dropdown Icon"
                    />
                  </div>
                </div>
                {/* <div ref={expandRef}> */}
                {expandItem.includes(index) && (
                  <div className={styles.answerBox}>
                    <p>{item.answer}</p>
                  </div>
                )}
                {/* </div> */}
                <div className={styles.divider} />
              </div>
            ))
          : descText.slice(0, 8).map((item: FaqProps, index: any) => (
              <div
                className={styles.BoxFQ}
                style={{
                  maxHeight: collIndex.includes(index) ? '340px' : '70px',
                  transition: collIndex.includes(index)
                    ? '500ms ease-in-out'
                    : '500ms ease-out',
                }}
                key={index}
                onClick={() => onChooseItem(index)}
                data-testid={item.testid}
              >
                <div className={styles.QuestionRow}>
                  <span>{item.question}</span>
                  <div
                    className={styles.iconTransition}
                    style={{
                      transform: collIndex.includes(index)
                        ? 'rotate(180deg)'
                        : '',
                    }}
                  >
                    <IconChevronDown
                      width={16}
                      height={16}
                      alt="SEVA Dropdown Icon"
                    />
                  </div>
                </div>
                {/* <div ref={expandRef}> */}
                {expandItem.includes(index) && (
                  <div className={styles.answerBox}>
                    <p>{item.answer}</p>
                  </div>
                )}
                <div className={styles.divider} />
                {/* </div> */}
              </div>
            ))}
      </div>
      {descText.length > 3 && (
        <div
          className={styles.expand}
          onClick={() => setExpandList(!expandList)}
        >
          <span>{expandList ? 'Tutup' : 'Muat lebih banyak lagi'}</span>
          <div className={styles.spacingLeft}>
            {expandList ? (
              <IconChevronUp width={16} height={16} alt="SEVA Dropdown Icon" />
            ) : (
              <IconChevronDown
                width={16}
                height={16}
                alt="SEVA Dropdown Icon"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
