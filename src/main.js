import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPlay,
  faPause,
  faStop,
  faStepForward,
  faStepBackward,
  faUndo,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import queries from './api/queries';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { createProvider } from './vue-apollo';

library.add({
  faPlay,
  faPause,
  faStop,
  faStepForward,
  faStepBackward,
  faUndo,
  faArrowLeft,
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

Vue.mixin({
  data() {
    return {
      get AudioContext() {
        return audioContext;
      },
    };
  },
});

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  apollo: {
    ...queries(store),
  },
  render: h => h(App),
}).$mount('#app');
