// api/errorHandler.ts
import useNotification from 'hooks/useNotification'

export function handleApiError(error: any) {
  const { notificationSnackbar } = useNotification()

  let errorMessage = 'An unexpected error occurred'
  let errorCode = 500

  if (error.response) {
    errorCode = error.response.status
    errorMessage = error.response.data?.message || 'Error occurred on the server'
  } else if (error.request) {
    errorMessage = 'No response from server'
  } else {
    errorMessage = error.message
  }

  // showNotification(errorMessage);

  return { code: errorCode, message: errorMessage }
}
