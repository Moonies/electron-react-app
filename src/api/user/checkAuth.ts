import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

export interface AuthData {
  id: number
  username: string
  name: string
  lastname: string
  email?: string
  role: string
  token: string
}

export default async function CheckAuth(
  username: string,
  password: string
): Promise<ApiResponse<AuthData>> {
  // when use real API
  // try {
  //   const response = await axiosInstance.get<ApiResponse<AuthData>>('/api/users')
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
  return new Promise<ApiResponse<AuthData>>((resolve, reject) => {
    setTimeout(() => {
      //test only
      let data = {
        id: 1,
        username: 'admin',
        name: 'Admin',
        lastname: 'eiei',
        role: 'Administator',
        token: 'abcd001',
      }
      resolve({ code: 200, message: 'success', data: data })

      // if (username === 'admin' && password === 'password') {
      //   let data = {
      //     id: 1,
      //     username: 'admin',
      //     name: 'Admin',
      //     lastname: 'eiei',
      //     role: 'Administator',
      //     token: 'abcd001',
      //   }
      //   resolve({ code: 200, message: 'success', data: data })
      // } else {
      //   resolve({ code: 400, message: 'user or pass is not correct', data: null })

      //   // reject(new Error('Invalid credentials'))
      // }
    }, 1000)
  })
}
