import React, { useMemo, useRef, useState } from 'react'
import styles from 'styles/components/organisms/cardVariantOptions.module.scss'
import clsx from 'clsx'
import { COMData, COMDataTracking } from 'utils/types/models'
import CardCarOfTheMonth from 'components/molecules/cardCarOfTheMonth'
import elementId from 'utils/helpers/trackerId'
import { CityOtrOption } from 'utils/types'
import { PageOriginationName } from 'utils/types/props'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'
import {
  FormSelectCarVariantProps,
  variantEmptyValue,
} from 'components/molecules/form/formSelectCarVariant'
import { FormSelectCarVariantV2 } from 'components/molecules/form/formSelectCarVariantV2'

interface CardVariantOptionsProps extends FormSelectCarVariantProps {
  carModelImage: string | undefined
  cityName: string
  onChangeInformation?: () => void
}

const CardVariantOptions = ({
  selectedModel,
  handleChange,
  name,
  carVariantList,
  value,
  modelError,
  onShowDropdown,
  isError = false,
  carModelImage,
  cityName,
  onChangeInformation,
}: CardVariantOptionsProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Simulasi Cicilan</h3>
      <div className={styles.cardContent}>
        <div className={styles.wrapperCard}>
          <span className={styles.textCarModel}>{selectedModel}</span>
          <span className={styles.textCityName}>{' di ' + cityName}</span>
          <div className={styles.wrapperOptions}>
            <img src={carModelImage} alt="" />
            <FormSelectCarVariantV2
              selectedModel={selectedModel || ''}
              handleChange={handleChange}
              name="variant"
              carVariantList={carVariantList}
              value={value || variantEmptyValue}
              modelError={modelError}
              onShowDropdown={onShowDropdown}
              isError={isError}
            />
          </div>
          <div className={styles.wrapperText} onClick={onChangeInformation}>
            <span className={styles.textChangeDP}>
              Ubah DP atau Informasi Lainnya
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardVariantOptions
