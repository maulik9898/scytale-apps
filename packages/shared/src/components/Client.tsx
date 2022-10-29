import { Component, ComponentProps, Show } from 'solid-js';
import { ConnectedClient } from '../Types/Types';
import { VsWorkspaceTrusted, VsWorkspaceUntrusted } from 'solid-icons/vs';

interface ClientProps extends ComponentProps<any> {
  client: ConnectedClient;
}

const Client: Component<ClientProps> = (props) => {
  return (
    <div class="card shadow-md bg-neutral text-neutral-content w-[50%] min-w-[300px] flex flex-row">
      <div class="p-4 align-middle">
        <Show
          when={props.client.pubKey}
          fallback={
            <div
              class="tooltip tooltip-right tooltip-info"
              data-tip="Client is not Encrypted"
            >
              <VsWorkspaceUntrusted color="red" size={48} />
            </div>
          }
        >
          <div
            class="tooltip tooltip-right tooltip-info"
            data-tip="Client is Encrypted"
          >
            <VsWorkspaceTrusted color="green" size={48} />
          </div>
        </Show>
      </div>
      <div class="flex flex-col justify-center">
        <p class="text-lg">{props.client.username}</p>
        <p class="text-base font-light">{props.client.id}</p>
      </div>
    </div>
  );
};

export default Client;
