import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { isIphone, screenSize } from 'utils/window'
import elementId from 'helpers/elementIds'
import { FormControlValue, Option } from 'utils/types'
import { videoInput } from 'utils/helpers/const'
import { CameraType } from 'utils/types/models'
import { DownOutlined, InputSelect } from 'components/atoms'
import styles from 'styles/components/molecules/cameraSelect.module.scss'

interface CameraSelectProps {
  onSelected?: (value: string | null) => void
  isKtp?: boolean
}
export const CameraSelect = ({ onSelected, isKtp }: CameraSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<FormControlValue>('')
  const [options, setOptions] = useState<Option<FormControlValue>[]>([])

  const handleDevices = useCallback(
    (mediaDevices: any) => {
      if (!mediaDevices) {
        onSelected && onSelected(null)
        return
      }

      const devices = mediaDevices
        .filter((item: MediaDeviceInfo) => item.kind === videoInput)
        .sort((lhs: MediaDeviceInfo, rhs: MediaDeviceInfo) => {
          const lhsValue = isBackCamera(lhs.label)
          const rhsValue = isBackCamera(rhs.label)
          if (lhsValue === rhsValue) {
            return 0
          } else {
            // back camera will put in front of the list
            return lhsValue ? -1 : 1
          }
        })

      if (!devices || devices.length < 1) {
        onSelected && onSelected(null)
        return
      }

      createOptions(devices)
    },
    [setOptions],
  )

  const isBackCamera = (value: string) =>
    value.toLowerCase().includes(CameraType.BackEN) ||
    value.toLowerCase().includes(CameraType.BackBAHASA)

  const getCameraLabel = (next: MediaDeviceInfo) => {
    if (!next.label) {
      return 'Kamera'
    } else if (isBackCamera(next.label)) {
      return 'Kamera Belakang'
    } else {
      return 'Kamera Depan'
    }
  }

  const formatCameraLabelsSkipIOS = (
    acc: Option<FormControlValue>[],
    next: MediaDeviceInfo,
  ) => {
    if (isIphone) {
      acc.push({ label: next.label, value: next.deviceId })
      return acc
    }
    const label: string = getCameraLabel(next)
    const countedCamera = acc.filter((camera) =>
      camera.label.startsWith(label),
    ).length
    acc.push({ label: `${label} ${countedCamera + 1}`, value: next.deviceId })
    return acc
  }

  const createOptions = (devices: MediaDeviceInfo[]) => {
    const optionsTemp: Option<FormControlValue>[] = devices.reduce(
      formatCameraLabelsSkipIOS,
      [],
    )
    if (optionsTemp.length > 0) {
      const backCameras = optionsTemp.filter((item) => isBackCamera(item.label))
      // we presume the second back camera has better quality.
      const defaultItem =
        backCameras.length > 1
          ? backCameras[1]
          : backCameras[0] ?? optionsTemp[optionsTemp.length - 1]
      onSelected && onSelected(defaultItem.value?.toString() ?? null)
      setSelectedDevice(defaultItem.value?.toString() ?? '')
    } else {
      onSelected && onSelected(null)
    }
    setOptions(optionsTemp)
  }

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(handleDevices)
      .catch(() => onSelected && onSelected(null))
  }, [handleDevices])

  const onChoose = (optionValue: FormControlValue) => {
    setSelectedDevice(optionValue)
    onSelected && onSelected(optionValue as string)
  }

  return (
    <>
      {options && options.length > 1 && (
        <div
          className={styles.selectWrapper}
          data-testid={elementId.Profil.Dropdown.Camera}
        >
          <InputSelect
            value={String(selectedDevice)}
            options={options}
            onChange={onChoose}
            rightIcon={<DownOutlined />}
            isSearchable={false}
          />
        </div>
      )}
    </>
  )
}
