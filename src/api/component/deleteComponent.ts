import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs from 'dayjs'

// export interface deleteComponentProps {
//   id: string
// }

export default async function deleteComponent(componentId: string): Promise<ApiResponse<null>> {
  // when use real API
  try {
    const response = await axiosInstance.delete('/api/components/' + componentId)
    return { code: 200, message: 'success', data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.status,
        message: error.response.data.message || 'An error occurred during authentication',
        data: null,
      }
    }
    return {
      code: 500,
      message: 'An unexpected error occurred',
      data: null,
    }
  }

  //for beta:test
  // return new Promise<ApiResponse<null>>((resolve, reject) => {
  //   setTimeout(() => {
  //     //test only
  //     resolve({ code: 200, message: 'success', data: null })

  //     //   // reject(new Error('Invalid credentials'))
  //     // }
  //   }, 1000)
  // })
}
