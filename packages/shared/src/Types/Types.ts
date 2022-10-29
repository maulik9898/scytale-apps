import { MqttClient } from 'mqtt';
import { Accessor } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';

export type GlobalStoreType = {
  email: string;
  password: string;
  refreshToken: string;
  accessToken: string;
  serverUrl: string;
  isLoggedIn: boolean;
  readonly isValidate: boolean;
  readonly client: Client;
  id: number;
  role: Role;
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

export interface ConnectedClient {
  id: string;
  username: string;
  userId: number;
  pubKey?: any;
}

export interface MqttMessage {
  topic: string;
  payload: string;
}

export interface MqttStoreType {
  client: MqttClient | null;
  clipMessage: string | null;
  connectedClients: ConnectedClient[];
  mqttStatus: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
  clientId: string;
}

export type MqttContextType = [
  mqttClient: MqttStoreType,
  action: {
    connect: () => void;
    disconnect: () => void;
    publish: (message: string) => void;
    copyToClipboard: (message: string) => void;
  }
];

export interface IMessage {
  clientId: string;
  message: string;
}
