import React, { useContext } from 'react'
import styles from 'styles/components/molecules/dealerBrand.module.scss'
import Image from 'next/image'
import { dealerBrandUrl } from 'utils/helpers/routes'
import { useRouter } from 'next/router'
import { useUtils } from 'services/context/utilsContext'
import { BrandList } from 'utils/types/utils'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'

const LogoToyota = '/revamp/icon/logo-toyota.webp'
const LogoDaihatsu = '/revamp/icon/logo-daihatsu.webp'
const Isuzu = '/revamp/icon/logo-isuzu.webp'
const LogoBmw = '/revamp/icon/logo-bmw.webp'
const Peugeot = '/revamp/icon/logo-peugeot.webp'
const Hyundai = '/revamp/icon/logo-hyundai.webp'

export interface DealerBrandProps {
  isButtonClick?: boolean | undefined
}

interface BrandProps {
  key: string
  icon: JSX.Element
  value: string
}

interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
}

export const DealerBrands = ({ isButtonClick }: DealerBrandProps) => {
  const router = useRouter()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const { brand } = useUtils()

  const logoList = {
    Toyota: LogoToyota,
    Daihatsu: LogoDaihatsu,
    Isuzu: Isuzu,
    BMW: LogoBmw,
    Peugeot: Peugeot,
    Hyundai: Hyundai,
  }

  const sizeLogo = {
    Toyota: '21,18',
    Daihatsu: '21.6,15',
    Isuzu: '21.6,7.2',
    BMW: '19.2,19.2',
    Peugeot: '17.49,19.2',
    Hyundai: '18,18',
  }

  const carList: CarButtonProps[] = brand.map((obj: BrandList) => {
    return {
      key: obj.makeName,
      icon: (
        <Image
          src={logoList[obj.makeName as keyof typeof logoList]}
          alt={obj.makeName}
          width={parseInt(
            sizeLogo[obj.makeName as keyof typeof sizeLogo]?.split(',')[0],
          )}
          height={parseInt(
            sizeLogo[obj.makeName as keyof typeof sizeLogo]?.split(',')[1],
          )}
        />
      ),
      value: obj.makeCode,
    }
  })

  const onClick = (key: string) => {
    const brandCarRoute = dealerBrandUrl.replace(':brand', key).toLowerCase()

    window.location.href = brandCarRoute
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dealer Mobil berdasarkan Merek</h2>
      <div className={styles.wrapperContainer}>
        {carList.map(({ key, icon, value }) => {
          return (
            <div
              onClick={() => onClick(value)}
              key={key}
              className={styles.boxFilter}
            >
              <div className={styles.content}>
                {icon} {key}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
