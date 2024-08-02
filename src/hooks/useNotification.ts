import { useDispatch } from 'react-redux'
import { showNotification, clearNotification } from 'store/notificationSlice'

type NotificationType = 'snackbar' | 'modal'
type NotificationSeverity = 'error' | 'success' | 'info' | 'warning'

const useNotification = () => {
  const dispatch = useDispatch()

  const showNotificationHelper = (
    type: NotificationType,
    severity: NotificationSeverity,
    message: string
  ) => {
    dispatch(showNotification({ type, severity, message }))
  }

  const closeNotification = () => {
    dispatch(clearNotification())
  }

  const notificationModal = {
    error: (message: string) => showNotificationHelper('modal', 'error', message),
    success: (message: string) => showNotificationHelper('modal', 'success', message),
    info: (message: string) => showNotificationHelper('modal', 'info', message),
    warning: (message: string) => showNotificationHelper('modal', 'warning', message),
  }

  const notificationSnackbar = {
    error: (message: string) => showNotificationHelper('snackbar', 'error', message),
    success: (message: string) => showNotificationHelper('snackbar', 'success', message),
    info: (message: string) => showNotificationHelper('snackbar', 'info', message),
    warning: (message: string) => showNotificationHelper('snackbar', 'warning', message),
  }
  return {
    notificationModal,
    notificationSnackbar,
    closeNotification,
  }
}

export default useNotification
