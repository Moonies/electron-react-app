export const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
  // If the input is null or undefined, return an empty string
  if (phoneNumber == null) {
    return ''
  }

  // Remove any non-digit characters from the input
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Check if the cleaned number has the correct length
  if (cleaned.length !== 11) {
    return phoneNumber // Return original if not valid
  }

  // Format the number
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
}

export const formatPostcode = (postcode: string | null | undefined): string => {
  if (postcode == null) {
    return ''
  }

  const cleaned = postcode.replace(/\D/g, '')

  if (cleaned.length !== 7) {
    return postcode
  }

  return `〒${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
}

export const formatJPY = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

export const deConvertPostalCode = (postalCode: string) => {
  return postalCode.replace(/[〒\-]/g, '')
}

export const addCommasToNumber = (num: number | string): string => {
  const numStr = String(num)
  const [integerPart, decimalPart] = numStr.split('.')

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

export const removeCommasToNumber = (formattedNum: string): number => {
  // Remove commas and convert to number
  return Number(formattedNum.replace(/,/g, ''))
}
