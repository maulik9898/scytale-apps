import Store from 'electron-store'

export type storeType = {
  email: string
  refreshToken: string
  accessToken: string
  serverUrl: string
  isLoggedIn: boolean
}
export const store = new Store<storeType>({
  defaults: {
    email: '',
    refreshToken: '',
    accessToken: '',
    serverUrl: '',
    isLoggedIn: false
  }
})
