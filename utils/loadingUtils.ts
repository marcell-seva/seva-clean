import { Dispatch, SetStateAction } from 'react'

const calculateProgress = (progressEvent: ProgressEvent) => {
  return Math.round((progressEvent.loaded * 100) / progressEvent.total)
}

export const handleProgressUpdate =
  (setProgress: Dispatch<SetStateAction<number>>) =>
  (progressEvent: ProgressEvent) => {
    setProgress(calculateProgress(progressEvent))
  }
