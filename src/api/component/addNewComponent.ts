import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface AddNewComponentProps {
  price: number
  latestPriceDecisionDate: string | dayjs.Dayjs
  // purchaseId: string
  name: string
  number: string
}

export default async function addNewComponent(
  data: AddNewComponentProps
): Promise<ApiResponse<null>> {
  // when use real API
  try {
    const response = await axiosInstance.post('/api/components', { ...data })
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
