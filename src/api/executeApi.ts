// api/apiExecutor.ts
import { ApiResponse } from 'api' // Assuming ApiResponse is in a shared types file
import axios, { AxiosResponse } from 'axios'
import { handleApiError } from './errorHandler'

export async function executeApi<T>(
  apiFunction: () => Promise<AxiosResponse<T>>
): Promise<T | null | undefined> {
  try {
    const response: AxiosResponse<T> = await apiFunction()

    // return {
    //   code: 200,
    //   message: 'Success',
    //   data: response.data as T, // Safely cast the response to type T
    // }
    return response.data
  } catch (error) {
    // Handle the error using the centralized error handler
    // const handledError = handleApiError(error)
    handleApiError(error)
    if (axios.isAxiosError(error) && error.response) {
      handleApiError(error)
    }
  }
}
