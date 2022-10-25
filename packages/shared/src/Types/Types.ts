import { SetStoreFunction } from 'solid-js/store';

export type GlobalStoreType = {
  email: string;
  password: string;
  refreshToken: string;
  accessToken: string;
  serverUrl: string;
  isLoggedIn: boolean;
  readonly isValidate: boolean;
  readonly client: Client
};

export enum Client {
    Desktop = 'desktop',
    Web = 'web',
}

export type LoginResponse = {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: Role;
    id: number;
  };
};

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export type ErrorResponse = {
  status: string;
  message: string;
  statusCode: number;
};

export type HtmlEvent = MouseEvent & {
  currentTarget: HTMLButtonElement;
  target: Element;
};

export type GlobalStoreContextType = [
  state: GlobalStoreType,
  setState: SetStoreFunction<GlobalStoreType>,
  actions: {
    updateFormField: (fieldName: string) => (event: Event) => void;
  }
];
