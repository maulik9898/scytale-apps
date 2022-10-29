import {
  Component,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import ThemeChange from '../components/ThemeChange';
import {
  BiRegularCheckDouble,
  BiRegularErrorAlt,
  BiRegularHide,
  BiRegularShow,
} from 'solid-icons/bi';
import { createMutation, createQuery } from '@tanstack/solid-query';
import axios, { AxiosError } from 'axios';
import { ErrorResponse, LoginResponse } from '../Types/Types';
import { produce } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { useGlobalStore } from '../stores/StoreContext';
const Login: Component = () => {
  const navigate = useNavigate();
  const [state, setState, { updateFormField }] = useGlobalStore();
  const [showPassword, setShow] = createSignal(false);
  const [error, setError] = createSignal('');

  onMount(() => {
    setState(
      produce((s) => {
        s.accessToken = '';
        s.refreshToken = '';
        s.isLoggedIn = false;
      })
    );
  });

  const serverCheck = createQuery<{ status: string }>(
    () => ['serverCheck', state.serverUrl],
    async ({ signal }) => {
      const { data } = await axios.get(state.serverUrl, { signal });
      return data;
    },
    {
      get enabled() {
        return state.serverUrl !== '';
      },
    }
  );

  const sendLogin = createMutation(
    async () => {
      const { data } = await axios.post<LoginResponse>(
        `${state.serverUrl}/login`,
        {
          email: state.email,
          password: state.password,
        }
      );
      return data;
    },
    {
      onSuccess(data, _variables, _context) {
        setState(
          produce((s) => {
            s.accessToken = data.data.accessToken;
            s.refreshToken = data.data.refreshToken;
            s.isLoggedIn = true;
            s.id = data.data.id;
            s.role = data.data.role;
          })
        );
        navigate('/');
      },
      onError(error: AxiosError<ErrorResponse>, _variables, _context) {
        setError(error.response?.data.message || '');
        setState(
          produce((s) => {
            s.accessToken = '';
            s.refreshToken = '';
            s.isLoggedIn = false;
          })
        );
      },
    }
  );

  const onSubmit = (e: Event) => {
    e.preventDefault();
    sendLogin.mutate();
  };

  return (
    <div class="flex-col flex h-full">
      <div class="flex-none flex justify-end items-center">
        <ThemeChange />
      </div>
      <div class="flex-grow flex justify-center">
        <div class="self-center">
          <div class="p-6 flex flex-col max-w-[400px] card bg-base-300 shadow-lg">
            <p class="p-3 self-center font-bold bg-clip-text bg-gradient-to-r from-primary-focus to-secondary-focus text-transparent  text-7xl">
              Scytale
            </p>
            <p class="self-center text-center ml-6 mr-6 text-base mt-4">
              Hey, Enter your details to get sign in to your account
            </p>
            <form class="form-control mt-8" onSubmit={onSubmit}>
              <input
                type="text"
                required
                name="email"
                value={state.email}
                onInput={updateFormField('email')}
                placeholder="Enter Email"
                class="self-center mt-3 input input-bordered w-full max-w-md"
              />

              <div class="input-group mt-3">
                <input
                  type={showPassword() ? 'text' : 'password'}
                  required
                  name="password"
                  value={state.password}
                  onInput={updateFormField('password')}
                  placeholder="Enter Password"
                  class="self-center input input-bordered w-full max-w-md"
                />
                <label class="btn btn-square swap">
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      event.preventDefault();
                      setShow(event.currentTarget.checked);
                    }}
                  />
                  <BiRegularShow size={24} class="swap-off" />
                  <BiRegularHide size={24} class="swap-on" />
                </label>
              </div>
              <div class="input-group mt-3">
                <input
                  type="text"
                  required
                  name="serverUrl"
                  value={state.serverUrl}
                  onInput={updateFormField('serverUrl')}
                  placeholder="Enter Url"
                  class={`self-center ${
                    serverCheck.isError
                      ? 'input-error'
                      : serverCheck.isSuccess
                      ? 'input-success'
                      : ''
                  } input input-bordered w-full max-w-md`}
                />
                <Switch
                  fallback={
                    <button disabled class="btn btn-square">
                      <BiRegularErrorAlt
                        size={24}
                        color="hsl(var(--er))"
                        class="swap-off"
                      />
                    </button>
                  }
                >
                  <Match when={serverCheck.isInitialLoading}>
                    <button disabled class="btn btn-square loading"></button>
                  </Match>
                  <Match when={serverCheck.isError}>
                    <button disabled class="btn btn-square">
                      <BiRegularErrorAlt
                        size={24}
                        color="hsl(var(--er))"
                        class="swap-off"
                      />
                    </button>
                  </Match>
                  <Match when={serverCheck.isSuccess}>
                    <button disabled class="btn btn-square">
                      <BiRegularCheckDouble
                        size={24}
                        color="hsl(var(--su))"
                        class="swap-on"
                      />
                    </button>
                  </Match>
                </Switch>
              </div>
              <Show when={serverCheck.isError}>
                <p class="text-error mt-1 p-1">
                  Unable to connect scytale server
                </p>
              </Show>
              <button
                type="submit"
                disabled={!state.isValidate || !serverCheck.isSuccess}
                class={`btn btn-accent w-full mt-6 ${
                  sendLogin.isLoading ? 'loading' : ''
                }`}
              >
                Sign in
              </button>
            </form>
            <Show when={error()}>
              <p class="text-error mt-2 p-1">{error()}</p>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
