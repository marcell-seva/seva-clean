import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/organisms/refinancingLandingPageContent.module.scss'
import clsx from 'clsx'
import { colors } from 'utils/helpers/style/colors'
import {
  DescriptionRefinancing,
  DiscussionRefiForm,
  DocumentRefinancing,
  FaqRefinancing,
  FooterMobile,
  HeaderRefinancing,
  RefinancingInsuranceWidget,
  RefinancingLocationWidget,
  RefinancingQuestionWidget,
  RefinancingTutorial,
} from 'components/molecules'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useUtils } from 'services/context/utilsContext'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { TemanSevaPageHeader } from '../temanSevaPageHeader'
import { RefinancingUsp } from 'components/molecules/refinancingUsp'
import { CSAButton } from 'components/atoms'
import { useInView } from 'react-intersection-observer'

export const RefinancingLandingPageContent = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isButtonClick, setIsButtonClick] = useState(false)
  const scrollToFirstForm = useRef<null | HTMLDivElement>(null)
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const { cities, dataAnnouncementBox } = useUtils()
  const {
    ref: landingPageLeadsFormSectionRef,
    inView: isLeadsFormSectionVisible,
  } = useInView({
    threshold: 0.5,
  })

  const scrollToLeadsForm = () => {
    setIsButtonClick(true)
    const destinationElm = document.getElementById(
      'refinancing-page-leads-form-section',
    )
    if (destinationElm) {
      destinationElm.scrollIntoView({
        inline: 'center',
        block: 'center',
      })
    }
  }

  useEffect(() => {
    if (isSubmit) {
      scrollToFirstForm.current?.scrollIntoView({ behavior: 'smooth' })
      setIsSubmit(false)
    }
  }, [isSubmit])

  useAfterInteractive(() => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }, [dataAnnouncementBox])

  return (
    <>
      <div className={styles.container}>
        <TemanSevaPageHeader
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          showAnnouncementBox={showAnnouncementBox}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          cities={cities}
          pageOrigination="Fasilitas Dana - Landing"
        />
        <div
          className={clsx({
            [styles.wrapper]: true,
            [styles.marginTop54]: showSidebar && !showAnnouncementBox,
            [styles.marginTop115]: showSidebar && showAnnouncementBox,
          })}
        >
          <HeaderRefinancing
            onButtonClick={setIsButtonClick}
            onSubmitted={setIsSubmit}
          />
          <DescriptionRefinancing />
          <RefinancingUsp />
          <RefinancingTutorial />
          <DocumentRefinancing />
          <div ref={scrollToFirstForm}></div>
          <div
            ref={landingPageLeadsFormSectionRef}
            id="refinancing-page-leads-form-section"
          >
            <DiscussionRefiForm onButtonClick={isButtonClick} />
          </div>
          <div className={styles.backgroundFaq}>
            <h3
              className={styles.titleFaq}
              style={{
                margin: '0 16px',
                color: colors.body2,
                fontSize: 14,
                lineHeight: '20px',
              }}
            >
              Punya pertanyaan? Cek di sini!
            </h3>
            <FaqRefinancing />
          </div>
          <RefinancingQuestionWidget />
          <div className={styles.widgetSeparator}></div>
          <RefinancingInsuranceWidget />
          <div className={styles.widgetSeparator}></div>
          <RefinancingLocationWidget />
          <FooterMobile pageOrigination="Fasilitas Dana - Landing" />
        </div>

        {!isLeadsFormSectionVisible && (
          <CSAButton
            onClick={scrollToLeadsForm}
            additionalstyle={'csa-button-homepage'}
          />
        )}
      </div>
    </>
  )
}
