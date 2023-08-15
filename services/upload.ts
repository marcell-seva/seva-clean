import { AxiosRequestConfig } from 'axios'
import { DocumentFileNameKey, DocumentType, UploadDataKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { api } from './api'

export const buildFileUploadData = (
  file: File,
  fileKey: DocumentFileNameKey,
  fileType: DocumentType,
) => {
  const formData = new FormData()
  formData.append(UploadDataKey.File, file)
  formData.append(UploadDataKey.FileKey, fileKey)
  formData.append(UploadDataKey.FileType, fileType)
  return formData
}
export const buildFileKTPData = (file: File, fileType: DocumentType) => {
  const formData = new FormData()
  console.log('qweee file : ', file)
  formData.append(UploadDataKey.File, file)
  formData.append(UploadDataKey.FileType, fileType)
  return formData
}

export const uploadImageFile = ({ data, ...restProps }: AxiosRequestConfig) => {
  return api.postUploadFile(data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: getToken()?.idToken,
    },
    ...restProps,
  })
}

export const uploadKTPFile = ({ data, ...restProps }: AxiosRequestConfig) => {
  return api.postUploadKTPFile(data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: getToken()?.idToken,
    },
    ...restProps,
  })
}

export const uploadImageFileNew = ({
  data,
  ...restProps
}: AxiosRequestConfig) => {
  return api.postUploadFileNew(data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: getToken()?.idToken,
    },
    ...restProps,
  })
}
