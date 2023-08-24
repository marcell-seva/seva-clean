import React, { HTMLAttributes, ReactElement } from 'react'
import { replaceSuffixWith } from 'utils/stringUtils'
import { FileFormat } from 'utils/types/models'

interface WebpPictureProps extends HTMLAttributes<HTMLPictureElement> {
  src: string
  fallbackImage?: ReactElement
}

export const WebpPicture = ({
  src,
  fallbackImage,
  ...restProps
}: WebpPictureProps) => {
  const webpUrl = encodeURI(replaceSuffixWith(src, FileFormat.Webp.toString()))
  return (
    <picture {...restProps}>
      <source srcSet={webpUrl} type="image/webp" />
      {fallbackImage}
    </picture>
  )
}
