/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'solid-js';
import { MqttContextType } from '../Types/Types';

export const MqttContext = createContext<MqttContextType>([
  {
    client: null,
    clipMessage: null,
    connectedClients: [],
    mqttStatus: 'disconnected',
    clientId: '',
  },
  {
    connect: () => {},
    disconnect: () => {},
    publish: (message) => {},
    copyToClipboard: (message) => {},
  },
]);

export function useMqtt() {
  return useContext(MqttContext);
}
