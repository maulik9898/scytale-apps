import { Component, For, Show } from 'solid-js';
import { useMqtt } from '../stores/MqttContext';
import Client from './Client';

const ClientList: Component = () => {
  const [mqttClient, { connect, disconnect, publish }] = useMqtt();
  const thisClient = () =>
    mqttClient.connectedClients.find((c) => c.id === mqttClient.clientId);
  return (
    <div class="flex flex-col gap-2 mt-4 w-full items-center">
      <Show when={thisClient()}>
        <p class="text-xl font-bold">This Device</p>
        <Client client={thisClient()!} />
      </Show>

      <p class="text-xl font-bold">Other Devices</p>
      <For
        each={mqttClient.connectedClients.filter(
          (s) => s.id !== mqttClient.clientId
        )}
      >
        {(client) => <Client client={client} />}
      </For>
    </div>
  );
};

export default ClientList;
