import React, { useState } from 'react'
import { HeaderMobile } from '../headerMobile'
import { CitySelectorModal } from 'components/molecules'
import { CityOtrOption } from 'utils/types'

type TemanSevaPageHeaderProps = {
  showSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  showAnnouncementBox: boolean | null
  setShowAnnouncementBox: (value: boolean) => void
  cities: CityOtrOption[]
  pageOrigination?: string
}

export const TemanSevaPageHeader = ({
  showSidebar,
  setShowSidebar,
  showAnnouncementBox,
  setShowAnnouncementBox,
  cities,
  pageOrigination,
}: TemanSevaPageHeaderProps) => {
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)

  return (
    <>
      <HeaderMobile
        isActive={showSidebar}
        setIsActive={setShowSidebar}
        emitClickCityIcon={() => setOpenCitySelectorModal(true)}
        setShowAnnouncementBox={setShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
        pageOrigination={pageOrigination}
      />
      <CitySelectorModal
        isOpen={openCitySelectorModal}
        onClickCloseButton={() => {
          setOpenCitySelectorModal(false)
        }}
        cityListFromApi={cities}
        pageOrigination={pageOrigination}
      />
    </>
  )
}
