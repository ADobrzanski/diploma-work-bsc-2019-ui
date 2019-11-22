import Vue from 'vue';
import Vuex from 'vuex';
import * as R from 'ramda';

import {
  PLAYBACK_STATUS_PLAYING,
  PLAYBACK_STATUS_PAUSED,
  PLAYBACK_STATUS_STOPPED,
} from './values';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playback: {
      status: PLAYBACK_STATUS_PAUSED,
      startTimestamp: null,
      currentTimestamp: null,
    },
    score: {
      isReady: false,
      currentEntry: -1,
      entries: [],
    },
  },
  mutations: {
    SET_SCORE_READY(state, isReady) {
      // eslint-disable-next-line no-param-reassign
      state.score = R.assoc('isReady', isReady)(state.score);
    },
    SET_SCORE_ENTRIES(state, entries) {
      // eslint-disable-next-line no-param-reassign
      state.score = R.assoc('entries', entries)(state.score);
    },
    SET_PLAYBACK_STATUS(state, playbackStatus) {
      // eslint-disable-next-line no-param-reassign
      state.playback = R.assoc('status', playbackStatus)(state.playback);
    },
  },
  actions: {
    setScoreReady({ commit }, isReady) {
      commit('SET_SCORE_READY', isReady);
    },
    setScoreEntries({ commit }, entries) {
      commit('SET_SCORE_ENTRIES', entries);
    },
    startPlayback({ commit }) {
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_PLAYING);
    },
    pausePlayback({ commit }) {
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_PAUSED);
    },
    stopPlayback({ commit }) {
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_STOPPED);
    },
  },
  getters: {
    isScoreReady(state) {
      return R.path(['score', 'isReady'], state);
    },
    scoreEntries(state) {
      return R.path(['score', 'entries'], state);
    },
    isPlaybackPlaying(state) {
      const playbackStatus = R.path(['playback', 'status'], state);

      switch (playbackStatus) {
        case PLAYBACK_STATUS_PLAYING:
          return true;
        default:
          return false;
      }
    },
    isPlaybackStopped(state) {
      const playbackStatus = R.path(['playback', 'status'], state);
      if (playbackStatus === PLAYBACK_STATUS_STOPPED) return true;
      return false;
    },
  },
  modules: {
  },
});
