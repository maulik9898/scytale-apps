import { render } from 'solid-js/web'
import './assets/index.css'
import { App } from '@scytale/shared'
import { Router, hashIntegration } from '@solidjs/router'
import { QueryClientProvider } from '@tanstack/solid-query'
import { queryClient } from '@scytale/shared'
import GlobalStoreProvider from './store/GlobalStoreProvider'

render(
  () => (
    <QueryClientProvider client={queryClient} contextSharing>
      <GlobalStoreProvider>
        <Router source={hashIntegration()}>
          <App />
        </Router>
      </GlobalStoreProvider>
    </QueryClientProvider>
  ),
  document.getElementById('root') as HTMLElement
)
