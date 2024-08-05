import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

export interface UserData {
  userId: string
  username: string
  fullName: string
  password?: string
  role: string
}

export interface GetUserListProps {
  username: string
}

export default async function getUserList({
  username,
}: GetUserListProps): Promise<ApiResponse<UserData[]>> {
  // when use real API
  // try {
  //   const response = await axiosInstance.get<ApiResponse<UserData[]>>('/api/users')
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
  return new Promise<ApiResponse<UserData[]>>((resolve, reject) => {
    setTimeout(() => {
      //test only
      let data = [
        {
          userId: '66b058a49973bc5b41e4eca0',
          fullName: 'Lenora',
          username: 'Lenora-66b058a49973bc5b41e4eca0',
          password: '825h7Tmp4QCyIaZ',
          role: 'normal',
        },
        {
          userId: '66b058a49973bc5b41e4eca1',
          fullName: 'Alf',
          username: 'Alf-66b058a49973bc5b41e4eca1',
          password: 'GEv2xZjf3NZZTLZ',
          role: 'senior',
        },
        {
          userId: '66b058a49973bc5b41e4eca2',
          fullName: 'Jensen',
          username: 'Jensen-66b058a49973bc5b41e4eca2',
          password: 'GMSH3C0qBIMoQGN',
          role: 'manager',
        },
        {
          userId: '66b058a49973bc5b41e4eca3',
          fullName: 'Karelle',
          username: 'Karelle-66b058a49973bc5b41e4eca3',
          password: 'ednHHCXywJzA0ej',
          role: 'administator',
        },
        {
          userId: '66b058a49973bc5b41e4eca4',
          fullName: 'Ethyl',
          username: 'Ethyl-66b058a49973bc5b41e4eca4',
          password: 'ZewRPqNC4nuDiUB',
          role: 'normal',
        },
      ]
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
