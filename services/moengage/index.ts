declare global {
  interface Window {
    Moengage: {
      track_event: any
      destroy_session: any
    }
  }
}

export const setTrackEventMoEngageWithoutValue = (value: any): void => {
  const moengage = window.Moengage
  moengage.track_event(value)
}

export const destroySessionMoEngage = (): void => {
  const moengage = window.Moengage
  moengage.destroy_session()
}
