declare global {
  interface Window {
    Moengage: any
  }
}

export const setTrackEventMoEngageWithoutValue = (value: any): void => {
  console.log('VALUE : ', value)
  const moengage = window.Moengage
  moengage?.track_event(value)
}

export const destroySessionMoEngage = (): void => {
  const moengage = window.Moengage
  moengage.destroy_session()
}
