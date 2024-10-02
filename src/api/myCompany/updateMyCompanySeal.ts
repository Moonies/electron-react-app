import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'
export interface UpdateMyCompanySeal {
  id: number
  seal: File
}
export default async function updateMyCompanySeal({
  id,
  seal,
}: UpdateMyCompanySeal): Promise<ApiResponse<{}>> {
  // when use real API
  try {
    const response = await axiosInstance.put('/api/company/' + id + '/seal', seal, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return { code: 200, message: 'success', data: response.data.data }
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
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: { seal: mockData },
  // }
}
