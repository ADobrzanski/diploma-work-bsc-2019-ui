import * as R from 'ramda';
import { APP_MODE_PLAYBACK } from './consts';

export default {
  state: {
    mode: APP_MODE_PLAYBACK,
    inputNotes: [],
    errors: [],
    authDialog: false,
    file: null,
    fileSynced: false,
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
    SET_APPLICATION_AUTH_DIALOG(state, show) {
      state.authDialog = show;
    },
    SET_APPLICATION_UPLOAD_DIALOG(state, show) {
      state.uploadDialog = show;
    },
    SET_APPLICATION_FILE(state, file) {
      state.file = file;
    },
    SET_APPLICATION_FILE_SYNCED(state, fileSynced) {
      state.fileSynced = fileSynced;
    },
  },
  actions: {
    setInputNotes({ commit }, notes) {
      commit('SET_INPUT_NOTES', notes);
    },
    setLocalFile({ commit }, file) {
      commit('SET_APPLICATION_FILE', file);
      commit('SET_APPLICATION_FILE_SYNCED', false);
      commit('SET_APPLICATION_UPLOAD_DIALOG', true);
    },
    setRemoteFile({ commit }, file) {
      commit('SET_APPLICATION_FILE', file);
      commit('SET_APPLICATION_FILE_SYNCED', true);
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
