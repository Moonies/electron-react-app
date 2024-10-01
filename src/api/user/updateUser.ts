import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { UserData } from './getUserList'

// export interface UpdateUserData {
//   // username: string
//   id: number
//   password: string
//   identifier: string
//   name: string
//   roles: string
//   userNumber: string
// }

export default async function updateUser(newDataUser: UserData): Promise<ApiResponse<null>> {
  // when use real API
  try {
    const response = await axiosInstance.patch('/api/users', { ...newDataUser })
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
