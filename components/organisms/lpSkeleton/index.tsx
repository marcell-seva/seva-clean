import React from 'react'
import styles from 'styles/components/organisms/lpSkeleton.module.scss'
import MainHeroSkeleton from 'assets/illustration/car-main-hero-skeleton.webp'
import HeaderMobile from '../headerMobile'
import { CardShadow, Skeleton } from 'components/atoms'
import Image from 'next/image'

const LpSkeleton = () => {
  return (
    <>
      <HeaderMobile
        emitClickCityIcon={() => null}
        isActive={false}
        setIsActive={() => null}
      />
      <div className={styles.container}>
        <div className={styles.mainHero}>
          <Skeleton
            width={263}
            height={27}
            style={{ marginBottom: 10, borderRadius: 8 }}
          />
          <Skeleton
            width={340}
            height={27}
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
          <Skeleton
            width={330}
            height={35}
            style={{ marginBottom: 49, borderRadius: 8 }}
          />
          <Skeleton width={190} height={44} style={{ borderRadius: 8 }} />
        </div>
        <div className={styles.mainHeroWrapper}>
          <Image
            src={MainHeroSkeleton}
            alt="car skeleton"
            className={styles.mainHeroImg}
          />
        </div>
        <div className={styles.cardWrapper}>
          <CardShadow className={styles.cardShadow}>
            {Array.from(Array(8)).map((_, index) => (
              <>
                <Skeleton width={84} height={15} style={{ marginBottom: 16 }} />
                <Skeleton
                  width={266}
                  height={15}
                  style={{ marginBottom: 16 }}
                />
                {index !== 7 && <div className={styles.line} />}
              </>
            ))}
          </CardShadow>
          <Skeleton className={styles.buttonShadow} height={44} width={200} />
        </div>
      </div>
    </>
  )
}

export default LpSkeleton
