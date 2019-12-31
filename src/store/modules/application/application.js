import * as R from 'ramda';
import { APP_MODE_PLAYBACK } from './consts';

export default {
  state: {
    mode: APP_MODE_PLAYBACK,
    inputNotes: [],
  },
  mutations: {
    SET_APPLICATION_MODE(state, mode) {
      state.mode = mode;
    },
    SET_INPUT_NOTES(state, notes) {
      state.inputNotes = notes;
    },
  },
  actions: {
    setInputNotes({ commit }, notes) {
      commit('SET_INPUT_NOTES', notes);
    },
  },
  getters: {
    applicationMode(state) {
      return R.path(['mode'], state);
    },
    inputNotes(state) {
      return R.path(['inputNotes'])(state);
    },
  },
};
