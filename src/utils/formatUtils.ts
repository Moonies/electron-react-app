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
