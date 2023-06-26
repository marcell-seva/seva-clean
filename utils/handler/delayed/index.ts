export const delayedExec = (
  after: number | undefined,
  running: { (): void; (): void },
  execute: { (): void; (): void },
) => {
  let timer: string | number | NodeJS.Timeout | undefined
  return () => {
    if (timer) {
      clearTimeout(timer)
      running()
    }
    timer = setTimeout(execute, after)
  }
}
