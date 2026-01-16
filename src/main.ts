/**
 * D2Run Lite - Application Entry Point
 *
 * Initializes the Vue 3 application with Pinia state management
 * and mounts it to the DOM.
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/main.css';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
