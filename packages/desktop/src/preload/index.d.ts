import { storeType } from './../main/store'
import { ElectronAPI } from '@electron-toolkit/preload'
import Store from 'electron-store'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      store: Store<storeType>
      clipboard: {
        start: () => void
        stop: () => void
        getClipboardData: (
          callback: (event: Electron.IpcRendererEvent, data: string) => void
        ) => void
        saveToClipboard: (data: string) => void
      }
    }
  }
}
