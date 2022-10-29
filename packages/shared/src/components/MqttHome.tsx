import { Component, createSignal } from 'solid-js';
import { useMqtt } from '../stores/MqttContext';
import Button from './Button';

const MqttHome: Component = () => {
  const [mqttClient, { connect, disconnect, publish, copyToClipboard }] =
    useMqtt();
  const [text, setText] = createSignal('');
  return (
    <div class="mt-4 lg:w-2/3  w-full items-center flex flex-col gap-2">
      <textarea
        value={text()}
        onInput={(e) => {
          setText(e.currentTarget.value);
        }}
        class="p-2 textarea textarea-success w-full"
      />
      <button
        class="btn btn-info w-full"
        onClick={(e) => {
          e.preventDefault();
          publish(text());
        }}
      >
        Send
      </button>
      <p class="text-xl font-bold self-start mt-4">Incoming Clip</p>
      <div class="w-full relative">
        <pre class="mb-2 w-full mt-2 p-4 border-warning textarea textarea-bordered overflow-auto">
          {mqttClient.clipMessage}
        </pre>
        <button
          class="btn mt-3 btn-outline btn-success btn-xs absolute top-0 right-0 mr-1 "
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard(mqttClient.clipMessage || '');
          }}
        >
          copy
        </button>
      </div>
    </div>
  );
};

export default MqttHome;
