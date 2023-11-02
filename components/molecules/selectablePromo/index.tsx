import clsx from 'clsx'
import React, { useMemo } from 'react'
import styles from 'styles/components/molecules/selectablePromo.module.scss'
import { articleDateFormat } from 'utils/handler/date'
import { PromoItemType } from 'utils/types/utils'
import { LanguageCode } from 'utils/enum'
import {
  IconLoading,
  IconSquareCheckBox,
  IconSquareCheckedBox,
  IconTime,
} from 'components/atoms/icon'
import { colors } from 'styles/colors'

type SelectablePromoProps = {
  item: PromoItemType
  selected?: boolean
  groupPromo: 'best-promo' | 'additional-promo' | ''
  onSelect?: (item: PromoItemType) => void
  onClickSnK?: () => void
  isLoading?: boolean
}

export const SelectablePromo = ({
  item,
  selected,
  onSelect,
  onClickSnK,
  isLoading = false,
}: // groupPromo,
SelectablePromoProps) => {
  const {
    is_Available,
    // parentPromoName,
    is_Best_Promo,
    // is_Almost_Expired,
    // is_Expired,
    // promoId,
    promoTitle,
    promoDesc,
    promo,
    promoFinishDate,
    // expiredDate,
    // url,
  } = item

  const isPromoClickable = useMemo(() => {
    return item.promoId !== 'CDS03' && item.promoId !== 'SDD01'
  }, [item])

  const formattedDate = promoFinishDate
    ? articleDateFormat(new Date(promoFinishDate), LanguageCode.id, {
        collapsedMonth: true,
      })
    : ''

  const almostExpired = () => {
    const oneDay = 1000 * 60 * 60 * 24
    const currentDate = new Date()
    const endDate = new Date(promoFinishDate as string)
    const rangeDate = endDate.getTime() - currentDate.getTime()
    const diffDate = Math.round(rangeDate / oneDay)

    if (diffDate <= 30) return true
    return false
  }

  // const disable =
  //   (groupPromo === 'best-promo' && !is_Best_Promo) ||
  //   (groupPromo === 'additional-promo' && is_Best_Promo)

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="rotateAnimation">
          <IconLoading width={16} height={16} />
        </div>
      )
    } else if (selected) {
      return <IconSquareCheckedBox width={16} height={16} />
    } else {
      return <IconSquareCheckBox width={16} height={16} />
    }
  }

  const enableSnK = false

  return (
    <div
      role="button"
      className={clsx({
        [styles.card]: true,
        [styles.active]: selected,
      })}
      onClick={() =>
        is_Available && isPromoClickable && onSelect && onSelect(item)
      }
    >
      <div
        className={clsx({
          [styles.titleWrapper]: true,
          // [styles.disable]: disable,
          [styles.unavailable]: !is_Available,
        })}
      >
        <span
          className={clsx({
            [styles.title]: true,
            // [styles.disable]: disable,
            [styles.unavailable]: !is_Available,
          })}
        >
          {promo}
        </span>
        {is_Best_Promo && !!is_Available && (
          <span className={styles.promoTerbaik}>Promo Terbaik</span>
        )}
      </div>
      <div
        className={clsx({
          [styles.contentWrapper]: true,
          [styles.unavailable]: !is_Available,
        })}
      >
        <div className={styles.contentInfoWrapper}>
          <span
            className={clsx({
              [styles.title]: true,
              // [styles.disable]: disable,
              [styles.unavailable]: !is_Available,
            })}
          >
            {promoTitle}
          </span>
          <span
            className={clsx({
              [styles.desc]: true,
              [styles.unavailable]: !is_Available,
            })}
          >
            {promoDesc}{' '}
            {enableSnK ? (
              <a
                // href={url}
                className={styles.snk}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  onClickSnK && onClickSnK()
                }}
              >
                Lihat S&K
              </a>
            ) : (
              <></>
            )}
          </span>
        </div>
        {is_Available && (
          <div className={styles.iconWrapper}>{renderIcon()}</div>
        )}
      </div>
      {is_Available && (
        <>
          <div className={styles.dashedLine}></div>
          <div className={styles.additionalWrapper}>
            {/* {disable ? (
              <span className={styles.info}>
                Tidak dapat digabung dengan promo yang sedang kamu pilih.
              </span>
            ) : ( */}
            <>
              <IconTime height={11} width={11} color={colors.shadesGrey50} />
              <span className={styles.info}>
                {`Promo berlangsung s.d. ${formattedDate}.`}{' '}
                {almostExpired() && (
                  <span className={styles.expireSoon}>Segera Berakhir!</span>
                )}
              </span>
            </>
            {/* )} */}
          </div>
        </>
      )}
    </div>
  )
}
