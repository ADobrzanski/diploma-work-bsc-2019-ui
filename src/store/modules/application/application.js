import * as R from 'ramda';
import { APP_MODE_PLAYBACK } from './consts';

export default {
  state: {
    mode: APP_MODE_PLAYBACK,
  },
  mutations: {
    SET_APPLICATION_MODE(state, mode) {
      state.mode = mode;
    },
  },
  actions: {

  },
  getters: {
    applicationMode(state) {
      return R.path(['mode'], state);
    },
  },
};
