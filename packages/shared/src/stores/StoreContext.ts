/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'solid-js';
import { Client, GlobalStoreContextType, Role } from '../Types/Types';

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
    id: -1,
    role: Role.USER,
  },
  () => {},
  {
    updateFormField: () => () => {},
  },
]);

export function useGlobalStore() {
  return useContext(GlobalStoreContext);
}
