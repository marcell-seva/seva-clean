import React from 'react'
import styles from 'styles/components/molecules/searchModal.module.scss'
import { IconForward } from 'components/atoms/icons'
import HeaderVariant from '../headerVariant'
import { useModal } from 'components/atoms/ModalOld/Modal'

const useSearchModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const closeModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    hideModal()
  }

  const SearchModal = () => {
    return (
      <>
        <RenderModal blur={'0px'} transparent={false}>
          <div className={styles.styledWrapper}>
            <div className={styles.styledContent}>
              <div className={styles.searchWrapper}>
                <div onClick={closeModal} className={styles.forwardWrapper}>
                  <IconForward width={9} height={16} />
                </div>
                <HeaderVariant
                  overrideDisplay={'static'}
                  isOnModal={true}
                  suggestionListMobileWidth={'100%'}
                  closeModal={closeModal}
                  hideModal={hideModal}
                />
              </div>
            </div>
          </div>
        </RenderModal>
      </>
    )
  }

  return { SearchModal, hideModal, showModal }
}

export default useSearchModal
