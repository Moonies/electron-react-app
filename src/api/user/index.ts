import { default as checkAuth } from './checkAuth'
import { default as getUserList } from './getUserList'
import { default as addNewUser } from './addNewUser'

export default function user() {
  return { checkAuth, getUserList, addNewUser }
}
