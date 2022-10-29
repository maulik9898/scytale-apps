import { render } from 'solid-js/web';

import './index.css';
import { App, Button } from '@scytale/shared';
import { Router } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { queryClient, MqttProvider } from '@scytale/shared';
import GlobalStoreProvider from './store/GlobalStoreProvider';
render(
  () => (
    <QueryClientProvider client={queryClient} contextSharing>
      <GlobalStoreProvider>
        <MqttProvider>
          <Router>
            <App />
          </Router>
        </MqttProvider>
      </GlobalStoreProvider>
    </QueryClientProvider>
  ),
  document.getElementById('root') as HTMLElement
);
