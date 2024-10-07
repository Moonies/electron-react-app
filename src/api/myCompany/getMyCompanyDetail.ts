import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'

export interface MyCompanyDetail {
  id: number
  companyInfo: {
    name: string
    buildingName: string
    address: {
      streetAddress: string
      city: string
      prefecture: string
      postalCode: string
    }
    phoneNumber: string
    email: string
    fax?: string
  }
  accountNumber: string
  corporationNumber: string
  tax: number
  // accountNumber: string
  // corporationNumber: string
  // tax: number

  // accountNumber: string
  // city: string
  // corporationNumber: string
  // email: string
  // fax?: string
  // id: number
  // name: string
  // phoneNumber: string
  // postalCode: string
  // prefecture: string
  // streetAddress: string
  // bildingName?: string
  // tax: number
}
export default async function getMyCompanyDetail(): Promise<ApiResponse<MyCompanyDetail>> {
  // when use real API
  try {
    const response = await axiosInstance.get('/api/company/1')
    return { code: 200, message: 'success', data: response.data }
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
  // return new Promise<ApiResponse<MyCompanyDetail>>((resolve, reject) => {
  //   setTimeout(() => {
  //     //test only
  //     let data = {
  //       accountNumber: '002004003',
  //       city: '伏見区',
  //       corporationNumber: '1234567890',
  //       email: 'info@sansenshimizu.com',
  //       fax: '07003151547',
  //       id: 0,
  //       name: '株式会社さんせん清水',
  //       phoneNumber: '0900000000',
  //       postalCode: '6110915',
  //       prefecture: '京都市',
  //       streetAddress: '淀際目町335-5',
  //       tax: 10,

  //     }

  //     resolve({ code: 200, message: 'success', data: data })

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
