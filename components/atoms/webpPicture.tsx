import React, { HTMLAttributes, ReactElement } from 'react'
import { FileFormat } from 'utils/models/models'
import { replaceSuffixWith } from 'utils/stringUtils'

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
