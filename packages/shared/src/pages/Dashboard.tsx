import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { produce } from 'solid-js/store';
import ThemeChange from '../components/ThemeChange';
import { useGlobalStore } from '../stores/StoreContext';
import { Client, ConnectedClient, HtmlEvent } from '../Types/Types';
import { useMqtt } from '../stores/MqttContext';
import MqttHome from '../components/MqttHome';
import ClientList from '../components/ClientList';

export enum Tab {
  Home = 'Home',
  Clients = 'Clients',
}

const Dashboard: Component = () => {
  const [state, setState] = useGlobalStore();
  const [mqttClient, { connect, disconnect, publish }] = useMqtt();
  const [tab, setTab] = createSignal(
    state.client === Client.Desktop ? Tab.Clients : Tab.Home
  );

  onMount(() => {
    connect();
  });

  onCleanup(() => {
    disconnect();
  });

  const logOutHandler = (event: HtmlEvent) => {
    event.preventDefault();
    setState(
      produce((s) => {
        s.accessToken = '';
        s.refreshToken = '';
        s.isLoggedIn = false;
      })
    );
  };

  return (
    <div class="flex flex-col">
      <div class="flex gap-2 justify-between lg:w-2/3 w-full self-center">
        <button
          class={`btn font-semibold antialiased border rounded-lg border-opacity-100 ${
            mqttClient.mqttStatus === 'connected' ? 'btn-success' : 'btn-error '
          }`}
        >
          {mqttClient.mqttStatus.toLocaleUpperCase()}
        </button>
        <div class="flex justify-end gap-2 flex-wrap">
          <Show when={mqttClient.mqttStatus === 'disconnected'}>
            <button
              class="btn btn-sucess btn-outline"
              onClick={(e) => {
                e.preventDefault();
                connect();
              }}
            >
              CONNECT
            </button>
          </Show>

          <button class="btn btn-error" onClick={logOutHandler}>
            Logout
          </button>

          <ThemeChange />
        </div>
      </div>
      <div class="grid justify-items-center mt-4">
        <div class="tabs tabs-boxed">
          <a
            onClick={(e) => {
              e.preventDefault();
              setTab(Tab.Home);
            }}
            class={`tab ${tab() === Tab.Home ? 'tab-active' : ''}`}
          >
            Home
          </a>
          <a
            onClick={(e) => {
              e.preventDefault();
              setTab(Tab.Clients);
            }}
            class={`tab ${tab() === Tab.Clients ? 'tab-active' : ''}`}
          >
            Clients
          </a>
        </div>
        <Show when={Tab.Home === tab()} fallback={<ClientList />}>
          <MqttHome />
        </Show>
      </div>
    </div>
  );
};

export default Dashboard;
