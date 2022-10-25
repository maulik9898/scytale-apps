import { storeType } from './../main/store'
import { ElectronAPI } from '@electron-toolkit/preload'
import Store from 'electron-store'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      store: Store<storeType>
    }
  }
}
