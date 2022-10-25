import { createEffect, ParentComponent } from 'solid-js'
import { createStore } from 'solid-js/store'
import {
  GlobalStoreType,
  GlobalStoreContext,
  GlobalStoreContextType,
  Client
} from '@scytale/shared'

const GlobalStoreProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<GlobalStoreType>({
    refreshToken: window.api.store.get('refreshToken') || '',
    accessToken: window.api.store.get('accessToken') || '',
    email: window.api.store.get('email') || '',
    password: '',
    serverUrl: window.api.store.get('serverUrl') || '',
    isLoggedIn: window.api.store.get('isLoggedIn') || false,
    get isValidate() {
      if (this.email && this.password && this.serverUrl) {
        return true
      }
      return false
    },
    get client() {
      return Client.Desktop
    }
  })
  const store: GlobalStoreContextType = [
    state,
    setState,
    {
      updateFormField: (fieldName: string) => (event: Event) => {
        const inputElement = event.currentTarget as HTMLInputElement
        setState({
          [fieldName]: inputElement.value
        })
      }
    }
  ]

  createEffect(() => {
    window.api.store.set('isLoggedIn', state.isLoggedIn)
  })

  createEffect(() => {
    window.api.store.set('serverUrl', state.serverUrl)
  })
  createEffect(() => {
    window.api.store.set('refreshToken', state.refreshToken)
  })
  createEffect(() => {
    window.api.store.set('accessToken', state.accessToken)
  })
  createEffect(() => {
    window.api.store.set('email', state.email)
  })

  return <GlobalStoreContext.Provider value={store}>{props.children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
