import { Location, Article } from './utils'

export interface PropsBrand {
  name: string
  src: string
  isActive: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export interface PropsCapsule {
  item: Location
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export interface PropsIcon {
  width: number
  height: number
  color?: string
}

export interface PropsTypeCar {
  name: string
  src: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isActive?: boolean
}

export interface PropsAnnouncementBox {
  data: any
  onCloseButton: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export interface PropsArticle {
  data: Array<Article>
}

export interface PropsCategory {
  name: string
  id: number
  isActive: boolean
}

export interface PropsHowToUse {
  title: string
  desc: string
  icon: string
}

export interface PropsFloatingSection {
  onClickImage: (e: React.MouseEvent<HTMLImageElement>) => void
}

export interface PropsSearchMobile {
  onSearchMobileClose: (e: React.MouseEvent<HTMLDivElement>) => void
}
