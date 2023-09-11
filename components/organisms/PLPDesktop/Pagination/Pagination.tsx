import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { itemLimit, pageLimit } from 'utils/helpers/const'
import { FastForward } from 'components/atoms/icon/FastForward'
import { FastPrevious } from 'components/atoms/icon/FastPrevious'
import { Forward } from 'components/atoms/icon/Forward'
import { Previous } from 'components/atoms/icon/Previous'

interface PaginationProps {
  onChangePage: (page: number) => void
  length: number
  searchRender: string
}

export const Pagination = (props: PaginationProps) => {
  const pages = Math.ceil(props.length / itemLimit)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const goToNextPage = () => {
    if (currentPage === pages) return
    setCurrentPage((page) => page + 1)
  }

  const gotToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToPreviousPage = () => {
    if (currentPage === 1) return
    setCurrentPage((page) => page - 1)
  }

  const goToLastPage = () => {
    setCurrentPage(pages)
  }

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit
    return new Array(pageLimit)
      .fill(pages)
      .map((_, idx) => start + idx + 1)
      .filter((item) => item <= pages)
  }

  useEffect(() => {
    props.onChangePage(currentPage)
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [props.searchRender, props.length])

  if (props.length === 0 || pages <= 1) return <></>

  return (
    <StyledPagination className={'pagination-element'}>
      <StyledControlButton
        className={'pagination-first-button-element'}
        onClick={gotToFirstPage}
      >
        <FastPrevious />
      </StyledControlButton>
      <StyledControlButton
        className={'pagination-previous-button-element'}
        onClick={goToPreviousPage}
      >
        <Previous />
      </StyledControlButton>
      {getPaginationGroup().map((item, index) => {
        return (
          <StyledPaginationItem
            key={index}
            onClick={() => changePage(item)}
            isActive={currentPage === item}
            className={'pagination-number-button-element'}
          >
            {item}
          </StyledPaginationItem>
        )
      })}
      <StyledControlButton
        className={'pagination-next-button-element'}
        onClick={goToNextPage}
      >
        <Forward />
      </StyledControlButton>
      <StyledControlButton
        className={'pagination-last-button-element'}
        onClick={goToLastPage}
      >
        <FastForward />
      </StyledControlButton>
    </StyledPagination>
  )
}

interface StylePaginationItemProps {
  isActive: boolean
}

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 88px;
  margin-bottom: 104px;
  @media (max-width: 1024px) {
    margin-top: 32px;
    margin-bottom: 48px;
  }
`

const StyledPaginationItem = styled.button<StylePaginationItemProps>`
  width: 64px;
  height: 64px;
  background: ${(props) => (props.isActive ? '#E6E9F1' : colors.white)};
  border: 1.5px solid
    ${(props) => (props.isActive ? colors.primary1 : '#E4E9F1')};
  box-sizing: border-box;
  border-radius: 16px;
  margin: 0 10px;
  display: flex;
  font-family: var(--kanyon-bold);
  font-size: 16px;
  align-items: center;
  justify-content: center;
  @media (max-width: 1024px) {
    margin: 0 5.5px;
    font-size: 12px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
`

const StyledControlButton = styled.button`
  width: 64px;
  height: 64px;
  background: #ffffff;
  border: 1.5px solid #e4e9f1;
  box-sizing: border-box;
  border-radius: 16px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1024px) {
    margin: 0 4px;
    font-size: 12px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
`
