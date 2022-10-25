import { Component } from 'solid-js';
import { produce } from 'solid-js/store';
import ThemeChange from '../components/ThemeChange';
import { useGlobalStore } from '../stores/StoreContext';
import { HtmlEvent } from '../Types/Types';

const Dashboard: Component = () => {
  const [, setState,] = useGlobalStore();

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
    <div class="flex justify-end gap-2">
      <button class="btn btn-secondary" onClick={logOutHandler}>
        Logout
      </button>
      <ThemeChange />
    </div>
  );
};

export default Dashboard;
