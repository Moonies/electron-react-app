import axios from 'axios'
import { ApiResponse } from 'api'

export interface AuthData {
  id: number
  username: string
  name: string
  lastname: string
  email?: string
  role: string
  token: string
}

export default async function checkAuth(
  username: string,
  password: string
): Promise<ApiResponse<AuthData>> {
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

  //for beta:test
  return new Promise<ApiResponse<AuthData>>((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        let data = {
          id: 1,
          username: 'admin',
          name: 'Admin',
          lastname: 'eiei',
          role: 'Administator',
          token: 'abcd001',
        }
        resolve({ code: 200, message: 'success', data: data })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 1000)
  })
}
