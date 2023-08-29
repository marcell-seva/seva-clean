import React from 'react'
import styles from 'styles/components/organisms/lpSkeleton.module.scss'
import CarSkeletonImage from '/public/revamp/illustration/car-skeleton.webp'
import Image from 'next/image'
import { CardShadow, Skeleton } from 'components/atoms'

const LPCRSkeleton = () => {
  return (
    <>
      <div className={styles.carRecommendationWrapper}>
        <Skeleton
          width={194}
          height={17.5}
          style={{ marginBottom: 18, borderRadius: 25 }}
        />
        <div className={styles.tabPlaceholder}>
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton
              key={index}
              width={77}
              height={18}
              style={{ minWidth: 77 }}
            />
          ))}
        </div>
        <div className={styles.carSkeletonContainer}>
          {[1, 2].map((_, index) => (
            <div className={styles.carSkeletonWrapper} key={index}>
              <Image
                className={styles.carImg}
                src={CarSkeletonImage}
                width={189}
                alt="car placeholder"
              />
              <CardShadow className={styles.cardCarRecommendation}>
                <Skeleton
                  width={142}
                  height={32}
                  style={{ borderRadius: '0px 8px 8px 0px', marginBottom: 20 }}
                />
                <Skeleton
                  width={123}
                  height={19}
                  style={{ marginLeft: 16, borderRadius: 20, marginBottom: 36 }}
                />
                <Skeleton
                  width={101}
                  height={12.25}
                  style={{
                    marginLeft: 16,
                    borderRadius: 17.5,
                    marginBottom: 7.75,
                  }}
                />
                <Skeleton
                  width={108}
                  height={12.25}
                  style={{
                    marginLeft: 16,
                    borderRadius: 17.5,
                    marginBottom: 32,
                  }}
                />
                <Skeleton
                  width={65}
                  height={12.25}
                  style={{
                    marginLeft: 16,
                    borderRadius: 17.5,
                    marginBottom: 22,
                  }}
                />
                <Skeleton
                  width={'auto'}
                  height={44}
                  style={{
                    margin: '0 16px 16px',
                  }}
                />
              </CardShadow>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default LPCRSkeleton
