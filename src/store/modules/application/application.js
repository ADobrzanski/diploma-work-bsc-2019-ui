import * as R from 'ramda';
import { APP_MODE_PLAYBACK } from './consts';

export default {
  state: {
    mode: APP_MODE_PLAYBACK,
    inputNotes: [],
    errors: [],
    user: null,
    authDialog: false,
    uploadDialog: false,
  },
  mutations: {
    SET_APPLICATION_MODE(state, mode) {
      state.mode = mode;
    },
    SET_INPUT_NOTES(state, notes) {
      state.inputNotes = notes;
    },
    SET_APPLICATION_ERRORS(state, errors) {
      state.errors = errors;
    },
    SET_APPLICATION_USER(state, user) {
      state.user = user;
    },
    SET_APPLICATION_AUTH_DIALOG(state, show) {
      state.authDialog = show;
    },
    SET_APPLICATION_UPLOAD_DIALOG(state, show) {
      state.uploadDialog = show;
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
