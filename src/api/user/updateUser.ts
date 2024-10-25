import { axiosInstance, ApiResponse } from 'api'
import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'

export interface UpdateUserData {
  username: string
  id: string
  password?: string
  name: string
  roleId: string
  number: string
  mail: string
}

export default async function updateUser(
  httpRequest: HttpRequest,
  newDataUser: UpdateUserData
): Promise<ApiResponse<null>> {
  // when use real API
  const response = await httpRequest(() =>
    axiosInstance.patch('/api/users/' + newDataUser.id, { ...newDataUser })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
  // try {
  //   const response = await axiosInstance.patch('/api/users', { ...newDataUser })
  //   return { code: 200, message: 'success', data: response.data.data }
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     return {
  //       code: error.response.status,
  //       message: error.response.data.message || 'An error occurred during authentication',
  //       data: null,
  //     }
  //   }
  //   return {
  //     code: 500,
  //     message: 'An unexpected error occurred',
  //     data: null,
  //   }
  // }

  //for beta:test
  // return new Promise<ApiResponse<null>>((resolve, reject) => {
  //   setTimeout(() => {
  //     //test only
  //     resolve({ code: 200, message: 'success', data: null })

  //     // if (username === 'admin' && password === 'password') {
  //     //   let data = {
  //     //     id: 1,
  //     //     username: 'admin',
  //     //     name: 'Admin',
  //     //     lastname: 'eiei',
  //     //     role: 'Administator',
  //     //     token: 'abcd001',
  //     //   }
  //     //   resolve({ code: 200, message: 'success', data: data })
  //     // } else {
  //     //   resolve({ code: 400, message: 'user or pass is not correct', data: null })

  //     //   // reject(new Error('Invalid credentials'))
  //     // }
  //   }, 1000)
  // })
}
