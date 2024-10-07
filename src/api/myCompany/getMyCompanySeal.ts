import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'
export interface MyCompnaSeal {
  seal: string
}

export default async function getMyCompanySeal(id: number): Promise<ApiResponse<MyCompnaSeal>> {
  // when use real API
  try {
    const response = await axiosInstance.get('/api/company/' + id + '/seal', {
      headers: {
        // 'Content-Type': 'image/png',
        // Accept: 'application/json',
        'response-Type': 'arraybuffer',
      },
    })
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([response.data], { type: 'image/png' })

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)
    console.log(url)
    return { code: 200, message: 'success', data: { seal: url } }
  } catch (error) {
    console.log(error)
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
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: { seal: mockData },
  // }
}
