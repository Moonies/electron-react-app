import { default as checkAuth } from './checkAuth'
import { default as getUserList } from './getUserList'
import { default as addNewUser } from './addNewUser'
import { default as deleteUser } from './deleteUser'
import { default as updateUser } from './updateUser'
export default function user() {
  return { checkAuth, getUserList, addNewUser, deleteUser, updateUser }
}
