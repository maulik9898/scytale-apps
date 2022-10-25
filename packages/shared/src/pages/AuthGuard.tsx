import { Navigate, Outlet } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import axios from 'axios';
import { Component, Show } from 'solid-js';
import { useGlobalStore } from '../stores/StoreContext';

/* Authentication guard */
const AuthGuard: Component = () => {
  const [state, setState] = useGlobalStore();
  console.log('auth guard', state);

   createQuery<{ status: string }>(
    () => ['tokenCheck', state.serverUrl],
    async () => {
      const { data } = await axios.get(state.serverUrl + '/authenticate', {
        headers: { Authorization: `Bearer ${state.refreshToken}` },
      });
      return data;
    },
    {
      get enabled() {
        return state.serverUrl !== '';
      },
      onSuccess() {
        setState('isLoggedIn', true);
      },
      onError() {
        setState('isLoggedIn', false);
      },
    }
  );

  return (
    <Show when={state.isLoggedIn} fallback={<Navigate href="/login" />}>
      <Outlet />
    </Show>
  );
};

export default AuthGuard;
