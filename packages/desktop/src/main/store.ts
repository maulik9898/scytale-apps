import Store from 'electron-store'

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}
export type storeType = {
  email: string
  refreshToken: string
  accessToken: string
  serverUrl: string
  isLoggedIn: boolean
  id: number
  role: Role
}
export const store = new Store<storeType>({
  defaults: {
    email: '',
    refreshToken: '',
    accessToken: '',
    serverUrl: '',
    isLoggedIn: false,
    id: -1,
    role: Role.USER
  }
})
