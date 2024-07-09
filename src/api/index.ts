export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
}

export * from './users/auth'
