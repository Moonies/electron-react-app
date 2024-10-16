import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

export interface AuthData {
  id: string
  mail: string
  name: string
  number: string
  roles: string
  password: string
}

export default async function CheckAuth(
  mail: string,
  password: string
): Promise<ApiResponse<AuthData>> {
  // when use real API
  // try {
  //   const response = await axiosInstance.post('/api/users/login', { mail, password })
  //   return { code: 200, message: 'success', data: response.data }
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
        id: 'asdasdjj12345',
        name: 'admin',
        roles: 'Administator',
        // token: 'abcd001',
        // id:number
        // userId: '',
        // fullName: '',
        // indetifier: '',
        number: '',
        mail: '',
        password: 'abc11011',
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
