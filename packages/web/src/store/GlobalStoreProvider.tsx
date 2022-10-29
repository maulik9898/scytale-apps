import { createEffect, ParentComponent } from 'solid-js';
import { createStore } from 'solid-js/store';
import {
  GlobalStoreType,
  GlobalStoreContext,
  GlobalStoreContextType,
  Client,
  Role,
} from '@scytale/shared';

const GlobalStoreProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<GlobalStoreType>({
    refreshToken: localStorage.getItem('refreshToken') || '',
    accessToken: localStorage.getItem('accessToken') || '',
    email: localStorage.getItem('email') || '',
    password: '',
    serverUrl: localStorage.getItem('serverUrl') || '',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
    get isValidate() {
      if (state.email && state.password && state.serverUrl) {
        return true;
      }
      return false;
    },
    get client() {
      return Client.Web;
    },
    id: parseInt(localStorage.getItem('id') || '-1'),
    role: (localStorage.getItem('role') as Role) || Role.USER,
  });
  const store: GlobalStoreContextType = [
    state,
    setState,
    {
      updateFormField: (fieldName: string) => (event: Event) => {
        const inputElement = event.currentTarget as HTMLInputElement;
        setState({
          [fieldName]: inputElement.value,
        });
      },
    },
  ];

  createEffect(() => {
    localStorage.setItem('isLoggedIn', state.isLoggedIn.valueOf().toString());
  });

  createEffect(() => {
    localStorage.setItem('serverUrl', state.serverUrl);
  });
  createEffect(() => {
    localStorage.setItem('refreshToken', state.refreshToken);
  });
  createEffect(() => {
    localStorage.setItem('accessToken', state.accessToken);
  });
  createEffect(() => {
    localStorage.setItem('email', state.email);
  });
  createEffect(() => {
    localStorage.setItem('id', state.id.toString());
  });
  createEffect(() => {
    localStorage.setItem('role', state.role);
  });

  return (
    <GlobalStoreContext.Provider value={store}>
      {props.children}
    </GlobalStoreContext.Provider>
  );
};

export default GlobalStoreProvider;
