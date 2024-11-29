import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/index'
import { setLoading as setLoadingAction } from 'store/loadingSlice'

const useLoading = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingAction(loading))
    },
    [dispatch]
  )

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      setLoading(true)
      try {
        const result = await promise
        return result
      } finally {
        setLoading(false)
      }
    },
    [setLoading]
  )
  return { isLoading, withLoading, setLoading }
}

export default useLoading
