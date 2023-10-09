import React, { useEffect, useRef } from 'react'
import styles from 'styles/components/molecules/searchModal.module.scss'
import HeaderVariant from '../headerVariant'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { Forward } from 'components/atoms/icon/Forward'
import { Modal } from 'antd'

interface Props {
  isOpen: boolean
  handleCloseModal: () => void
  isOTO?: boolean
  pageOrigination?: string
}

export const SearchModal = ({
  isOpen,
  handleCloseModal,
  isOTO = false,
  pageOrigination,
}: Props) => {
  const closeModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    handleCloseModal()
  }

  return (
    <>
      <Modal
        closable={false}
        className="search-custom-modal"
        open={isOpen}
        footer={null}
        maskStyle={{ background: 'rgba(19, 19, 27, 0.5)' }}
      >
        <div className={styles.styledWrapper}>
          <div className={styles.styledContent}>
            <div className={styles.searchWrapper}>
              <div onClick={closeModal} className={styles.forwardWrapper}>
                <Forward width={9} height={16} />
              </div>
              <HeaderVariant
                overrideDisplay={'static'}
                isOnModal={true}
                suggestionListMobileWidth={'100%'}
                closeModal={closeModal}
                hideModal={handleCloseModal}
                isOTO={isOTO}
                pageOrigination={pageOrigination}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
