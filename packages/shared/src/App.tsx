import { Routes, Route } from '@solidjs/router';
import type { Component } from 'solid-js';
import AuthGuard from './pages/AuthGuard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';


const App: Component = () => {
  return (
    <div class="p-4 h-full">
      <Routes>
        <Route path="/" component={AuthGuard}>
          <Route path="" component={Dashboard} />
        </Route>
        <Route path="/login" component={Login} />
        <Route
          path="/about"
          element={<div>This site was made with Solid</div>}
        />
      </Routes>
    </div>
  );
};

export default App;
