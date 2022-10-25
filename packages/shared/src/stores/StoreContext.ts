/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'solid-js';
import { Client, GlobalStoreContextType } from '../Types/Types';

export const GlobalStoreContext = createContext<GlobalStoreContextType>([
  {
    email: '',
    password: '',
    refreshToken: '',
    accessToken: '',
    isLoggedIn: false,
    isValidate: false,
    serverUrl: '',
    client: Client.Web,
  },
  () => {},
  {
    updateFormField: () => () => {},
  },
]);

export function useGlobalStore() {
  return useContext(GlobalStoreContext);
}
