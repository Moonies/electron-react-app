import { useCallback } from 'react'
import { ApiResponse } from 'api'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/index'
import { setLoading } from 'store/loadingSlice'
import { showNotification } from 'store/notificationSlice'

const useLoadingRedux = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)

  const withLoading = useCallback(
    async <T>(promise: Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      dispatch(setLoading(true))
      try {
        const result = await promise
        if (result.code !== 200) {
          dispatch(
            showNotification({
              message: result.message,
              type: 'snackbar',
              severity: 'error',
            })
          )
        }
        return result
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch]
  )

  return { isLoading, withLoading }
}

export default useLoadingRedux
