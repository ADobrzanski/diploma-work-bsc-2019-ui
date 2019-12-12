import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPlay,
  faPause,
  faStop,
  faStepForward,
  faStepBackward,
} from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import router from './router';
import store from './store';
import Scheduler from './Scheduler';

library.add({
  faPlay,
  faPause,
  faStop,
  faStepForward,
  faStepBackward,
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

const scheduler = new Scheduler();

Vue.mixin({
  data() {
    return {
      get scheduler() {
        return scheduler;
      },
    };
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
