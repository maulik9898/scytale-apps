/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { connect } from 'mqtt';
import { createEffect, onCleanup, ParentComponent } from 'solid-js';
import { MqttContext, useGlobalStore } from '../index';
import { IMessage, MqttContextType, MqttStoreType } from '../Types/Types';
import {
  createMessage,
  decrypt,
  decryptKey,
  encrypt,
  generateKey,
  readKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';
import { createStore, produce } from 'solid-js/store';
import { passwordGenerate } from '../utils/password';
import axios from 'axios';

const MqttProvider: ParentComponent = (props) => {
  const [state] = useGlobalStore();
  const [mqtt, setMqtt] = createStore<MqttStoreType>({
    client: null,
    clipMessage: null,
    connectedClients: [],
    mqttStatus: 'disconnected',
    clientId: `${state.client}:react:${passwordGenerate(5)}`,
  });
  const [keys, setKeys] = createStore<{
    pubKey: string;
    privateKey: string;
    passphrase: string;
  }>({
    pubKey: '',
    privateKey: '',
    passphrase: '',
  });

  const afterConnect = async () => {
    const pass = passwordGenerate();
    const { privateKey, publicKey, revocationCertificate } = await generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve: 'curve25519', // ECC curve name, defaults to curve25519
      userIDs: [
        {
          name: mqtt.clientId,
          email: state.email,
          comment: passwordGenerate(10),
        },
      ], // you can pass multiple user IDs
      passphrase: pass, // protects the private key
      format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });
    setKeys(
      produce((s) => {
        s.privateKey = privateKey;
        s.pubKey = publicKey;
        s.passphrase = pass;
      })
    );
    await sendPubKey();
  };

  const sendPubKey = async () => {
    const { data } = await axios.post(
      state.serverUrl + '/pubkey',
      {
        pubKey: keys.pubKey,
        clientId: mqtt.clientId,
      },
      {
        headers: { Authorization: `Bearer ${state.accessToken}` },
      }
    );
    return data;
  };

  const onDisconnect = () => {
    mqtt.client?.end(true, {}, () => {
      console.log('Mqtt end ... disconnected');
      setMqtt(
        produce((s) => {
          s.mqttStatus = 'disconnected';
          s.client = null;
          s.connectedClients = [];
        })
      );
      setMqtt('client', null);
      setMqtt('mqttStatus', 'disconnected');
      setKeys(
        produce((s) => {
          s.privateKey = '';
          s.pubKey = '';
          s.passphrase = '';
        })
      );
    });
  };

  const decryptMessage = async (clip: IMessage) => {
    const pubKey = await readKey({ armoredKey: keys.pubKey });
    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: keys.privateKey }),
      passphrase: keys.passphrase,
    });

    const message = await readMessage({
      armoredMessage: clip.message, // parse armored message
    });
    const decrypted = await decrypt({
      message,
      verificationKeys: pubKey, // optional
      decryptionKeys: privateKey,
    });
    const chunks = [];
    for await (const chunk of decrypted.data) {
      chunks.push(chunk);
    }
    const plaintext = chunks.join('');
    return plaintext;
  };

  const encryptMessage = async (clip: string, publicKeyArmored: string) => {
    const publicKey = await readKey({ armoredKey: publicKeyArmored });
    const encrypted = await encrypt({
      message: await createMessage({ text: clip }), // input as Message object
      encryptionKeys: publicKey,
    });
    const chunks = [];
    for await (const chunk of encrypted) {
      chunks.push(chunk);
    }
    const plaintext = chunks.join('');
    return plaintext;
  };

  const publishClipboard = async (clip: string) => {
    const clipMessages: IMessage[] = [];
    for (const client of mqtt.connectedClients) {
      if (mqtt.clientId !== client.id) {
        const clipMessage: IMessage = {
          clientId: client.id,
          message: client.pubKey
            ? await encryptMessage(clip, client.pubKey)
            : clip,
        };
        clipMessages.push(clipMessage);
      }
    }
    mqtt.client?.publish(
      `users/${state.id}/clip`,
      JSON.stringify(clipMessages)
    );
  };

  const store: MqttContextType = [
    mqtt,
    {
      connect: () => {
        if (mqtt.client?.connected) return;
        setMqtt('mqttStatus', 'connecting');
        const wsUrl = `${
          state.serverUrl.split('://')[0] === 'https' ? 'wss' : 'ws'
        }://${state.serverUrl.split('://')[1]}`;
        const client = connect(wsUrl, {
          password: state.accessToken,
          username: `${state.client}:react`,
          clientId: mqtt.clientId,
        });
        setMqtt('client', client);
      },
      disconnect: () => {
        onDisconnect();
      },
      publish: (clip: string) => {
        publishClipboard(clip);
      },
      copyToClipboard: (message: string) => {
        navigator.clipboard.writeText(message);
      },
    },
  ];
  createEffect(() => {
    onCleanup(() => {
      console.log('cleanup ');
      onDisconnect();
    });
  });

  createEffect(async () => {
    if (mqtt.client) {
      mqtt.client?.on('connect', async () => {
        setMqtt('mqttStatus', 'connected');
        mqtt.client?.subscribe(`users/${state.id}/clients`, { qos: 2 });
        mqtt.client?.subscribe(`users/${state.id}/clip`, { qos: 2 });
        await afterConnect();
      });
      mqtt.client?.on('disconnect', () => {
        setMqtt('mqttStatus', 'disconnected');
        setMqtt('client', null);
        setKeys(
          produce((s) => {
            s.privateKey = '';
            s.pubKey = '';
            s.passphrase = '';
          })
        );
      });
      mqtt.client?.on('reconnect', () => {
        setMqtt('mqttStatus', 'reconnecting');
      });
      mqtt.client?.on('message', async (topic, message) => {
        if (topic === `users/${state.id}/clients`) {
          setMqtt('connectedClients', JSON.parse(message.toString()));
        }
        if (topic === `users/${state.id}/clip`) {
          const messages = JSON.parse(message.toString()) as IMessage[];
          const encryptedSelectedClip = messages.find(
            (m) => m.clientId === mqtt.clientId
          );
          console.log(encryptedSelectedClip);
          if (encryptedSelectedClip) {
            const decryptedMessage = await decryptMessage(
              encryptedSelectedClip
            );
            setMqtt('clipMessage', decryptedMessage);
          }
        }
      });

      mqtt.client?.on('error', (error) => {
        console.log('Mqtt ... error', error);
      });
    }
  });

  return (
    <MqttContext.Provider value={store}>{props.children}</MqttContext.Provider>
  );
};

export default MqttProvider;
