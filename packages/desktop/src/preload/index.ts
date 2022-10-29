import { ipcRenderer } from 'electron'
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { store, storeType } from '../main/store'

// Custom APIs for renderer
const api = {
  store: {
    get: (key: string) => store.get(key),
    set: (key: string, value: unknown) => store.set(key, value),
    clear: () => store.clear(),
    delete: (key: keyof storeType) => store.delete(key)
  },
  clipboard: {
    start: () => ipcRenderer.send('clipboard:start', 'start'),
    stop: () => ipcRenderer.send('clipboard:stop', 'stop'),
    getClipboardData: (callback) => ipcRenderer.on('clipboard:data', callback),
    saveToClipboard: (data: string) => ipcRenderer.send('clipboard:save', data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
