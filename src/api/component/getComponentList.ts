import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface SearchCriteriaComponentList {
  category: string
  keyword: string
}

export interface ComponentData {
  id: string
  componentNumber: string
  componentName: string
  lastestPriceDate: string | dayjs.Dayjs
  price: number
  // productId: string
  inStock: number
}

export default async function getComponentList(): Promise<ApiResponse<ComponentData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: [
      {
        id: '157143',
        componentNumber: 'TG-DM18-30-BL',
        componentName: 'No.14 DOUBLE MUG (BLACK)',
        lastestPriceDate: '1983-06-25T21:19:48.183Z',
        price: 6818,
        // productId: '66b4118dcb5d152039f74148',
        inStock: 0,
      },
      {
        id: '66b4118dcb5d152039f74149',
        componentNumber: '66b4118dcb5d152039f74149',
        componentName: 'Gleason - Schimmel',
        lastestPriceDate: '1985-09-15T08:16:17.251Z',
        price: 510.0,
        // productId: '66b4118dcb5d152039f7414a',
        inStock: 0,
      },
      {
        id: '66b4118dcb5d152039f7414b',
        componentNumber: '66b4118dcb5d152039f7414b',
        componentName: 'Mayer - Mohr',
        lastestPriceDate: '1972-11-20T16:29:05.736Z',
        price: 114.0,
        // productId: '66b4118dcb5d152039f7414c',
        inStock: 0,
      },
      {
        id: '66b4118dcb5d152039f7414d',
        componentNumber: '66b4118dcb5d152039f7414d',
        componentName: 'Brekke Group',
        lastestPriceDate: '1982-11-15T03:50:33.006Z',
        price: 854.0,
        // productId: '66b4118dcb5d152039f7414e',
        inStock: 0,
      },
      {
        id: '66b4118dcb5d152039f7414f',
        componentNumber: '66b4118dcb5d152039f7414f',
        componentName: 'Kessler Group',
        lastestPriceDate: '1992-09-25T13:28:27.957Z',
        price: 959.0,
        // productId: '66b4118dcb5d152039f74150',
        inStock: 0,
      },
    ],
  }
  // when use real API
  // try {
  //     const response = await axios.post<ApiResponse<AuthData>>('/api/component?'+category+'.contains='+keyword, { username, password });
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
