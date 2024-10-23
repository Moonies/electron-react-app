import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { executeApi } from 'api/executeApi'

export interface AddNewUserData {
  username: string
  password: string
  // identifier: string
  name: string
  role: string
  number: string
  mail: string
}

export default async function addNewUser(userData: AddNewUserData): Promise<ApiResponse<{}>> {
  // const response = await axiosInstance.post('/api/users', { ...newDataUser })
  const response = await executeApi(() => axiosInstance.post('/api/users', userData))
  return { code: 200, message: 'success', data: response.data }
}

// export default async function getUserList(newDataUser: AddNewUserData): Promise<ApiResponse<null>> {
// when use real API
// try {
//   const response = await axiosInstance.post('/api/users', { ...newDataUser })
//   return { code: 200, message: 'success', data: response.data.data }
// } catch (error) {
//   if (axios.isAxiosError(error) && error.response) {
//     return {
//       code: error.response.status,
//       message: error.message || 'An error occurred during authentication',
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
// }
