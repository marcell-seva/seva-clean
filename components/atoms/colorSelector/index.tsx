import React, { useRef } from 'react'
import styles from 'styles/components/atoms/colorSelector.module.scss'
import {
  CarColorItem,
  IconChevronLeft,
  IconChevronRight,
} from 'components/atoms'
import elementId from 'helpers/elementIds'

interface Props {
  colorList: (string | string[])[]
  dataTestId: string
}

export const ColorSelector = ({ colorList, dataTestId }: Props) => {
  const colorGroupRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const scroll = (scrollOffset: number) => {
    if (colorGroupRef && colorGroupRef.current) {
      colorGroupRef.current.scrollTo({
        left: (colorGroupRef.current.scrollLeft += scrollOffset),
        behavior: 'smooth',
      })
    }
  }

  const scrollLeft = () => {
    scroll(-36)
  }

  const scrollRight = () => {
    scroll(36)
  }

  return (
    <div className={styles.container} data-testid={dataTestId}>
      <button
        className={`${
          colorList.length > 8 ? styles.arrowWrapper : styles.arrowHidden
        }`}
        onClick={scrollLeft}
        data-testid={elementId.PDP.WarnaTab.ColorSelectorLeftArrow}
      >
        <IconChevronLeft width={16} height={16} />
      </button>
      <div
        ref={colorGroupRef}
        className={`${styles.colorGroup} ${
          colorList.length <= 8 && styles.centerColorGroup
        }`}
      >
        {colorList.map((item, index) => (
          <CarColorItem color={item} key={index} />
        ))}
      </div>
      <button
        className={`${
          colorList.length > 8 ? styles.arrowWrapper : styles.arrowHidden
        }`}
        onClick={scrollRight}
        data-testid={elementId.PDP.WarnaTab.ColorSelectorRightArrow}
      >
        <IconChevronRight width={16} height={16} />
      </button>
    </div>
  )
}
