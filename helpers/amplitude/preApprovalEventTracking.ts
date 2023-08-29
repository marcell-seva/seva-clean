import { logAmplitudeEvent } from 'services/amplitude'
import { TrackingEventName } from './eventTypes'

export type PreApprovalTrackingEvent = {
  name: TrackingEventName.VIEW_PREAPPROVAL_KTP_UPLOAD_CAMERA
  data: null
}

export const trackViewPreapprovalKTPUploadCamera = () => {
  logAmplitudeEvent({
    name: TrackingEventName.VIEW_PREAPPROVAL_KTP_UPLOAD_CAMERA,
    data: null,
  })
}
