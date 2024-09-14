import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

export interface UserData {
  // id:number
  userId: string
  username: string
  fullName: string
  password: string
  roles: string
}

export interface GetUserListProps {
  username?: string
}

export default async function getUserList(): Promise<ApiResponse<UserData[]>> {
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
          userId: 'AB1100',
          fullName: '平井昌司',
          username: 'Lenora-66b058a49973bc5b41e4eca0',
          password: '825h7Tmp4QCyIaZ',
          roles: 'normal',
        },
        {
          userId: '66b058a49973bc5b41e4eca1',
          fullName: 'Alf',
          username: 'Alf-66b058a49973bc5b41e4eca1',
          password: 'GEv2xZjf3NZZTLZ',
          roles: 'senior',
        },
        {
          userId: 'AA0011',
          fullName: '村田幸恵',
          username: 'Jensen-66b058a49973bc5b41e4eca2',
          password: 'GMSH3C0qBIMoQGN',
          roles: 'manager',
        },
        {
          userId: '66b058a49973bc5b41e4eca3',
          fullName: 'Karelle',
          username: 'Karelle-66b058a49973bc5b41e4eca3',
          password: 'ednHHCXywJzA0ej',
          roles: 'administator',
        },
        {
          userId: '66b058a49973bc5b41e4eca4',
          fullName: 'Ethyl',
          username: 'Ethyl-66b058a49973bc5b41e4eca4',
          password: 'ZewRPqNC4nuDiUB',
          roles: 'normal',
        },
      ]
      resolve({ code: 200, message: 'success', data: data })

      // if (username === 'admin' && password === 'password') {
      //   let data = {
      //     id: 1,
      //     username: 'admin',
      //     name: 'Admin',
      //     lastname: 'eiei',
      //     roles: 'Administator',
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
