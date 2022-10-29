import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  resolve: {
    alias: {
      mqtt: 'mqtt/dist/mqtt.js',
    },
  },
  plugins: [solid()],
});
