export const isShrink = (value: number | undefined | string | null): boolean =>
  !!value || value === 0

export const isValidNumber = (result: number): boolean => {
  return Number.isFinite(result) && !isNaN(result)
}
