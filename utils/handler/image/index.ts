import { DocumentType, frameMargins, frameRatios, FrameType } from 'utils/enum'
import { getClientWidth } from '../component'

export const getFrameSize = (
  docTypeKey: DocumentType,
  frameType: FrameType,
) => {
  const verticalMargin = frameMargins[docTypeKey][frameType][0]
  const horizontalMargin = frameMargins[docTypeKey][frameType][1]
  const width = getClientWidth() - horizontalMargin * 2
  return {
    width,
    height: Math.floor(frameRatios[docTypeKey][frameType] * width),
    verticalMargin,
    horizontalMargin,
  }
}

export const getImageBase64ByFile = (
  file: File,
  callback: (value: string | ArrayBuffer | null) => void,
) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    if (!!reader.result) {
      callback(reader.result)
    } else {
      callback(null)
    }
  }
  reader.onerror = () => {
    callback(null)
  }
}
