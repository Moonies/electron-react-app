import React from 'react'
import { ApiResponse } from 'api'

type prefectureDetail = {
  city: string
  prefeucture: string
  postalCode: string
}

export default async function getPrefectureDetail(
  postalCode: string
): Promise<ApiResponse<{ prefectureDetail: prefectureDetail }>> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      prefectureDetail: {
        city: '',
        postalCode: '',
        prefeucture: '',
      },
    },
  }
  // when use real API
  // try {
  //     const response = await axios.post<ApiResponse<AuthData>>('/api/auth', { username, password });
  //     return response.data;
  // } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //         return {
  //             code: error.response.status,
  //             message: error.response.data.message || 'An error occurred during authentication',
  //             data: null
  //         };
  //     }
  //     return {
  //         code: 500,
  //         message: 'An unexpected error occurred',
  //         data: null
  //     };
  // }
}
