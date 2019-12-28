/* eslint-disable no-param-reassign */

import * as R from 'ramda';
import {
  PLAYBACK_STATUS_PLAYING,
  PLAYBACK_STATUS_PAUSED,
  PLAYBACK_STATUS_STOPPED,
} from '../../consts/values';

export default {
  state: {
    status: PLAYBACK_STATUS_PAUSED,
    timestamp: 0,
    startTimestamp: 0,
    currentEntry: -1,
    activeNotes: [],
  },
  mutations: {
    SET_PLAYBACK_CURRENT_ENTRY(state, entryId) {
      state.currentEntry = entryId;
    },
    SET_PLAYBACK_STATUS(state, playbackStatus) {
      state.status = playbackStatus;
    },
    SET_PLAYBACK_TIMESTAMP(state, timestamp) {
      state.timestamp = timestamp;
    },
    SET_PLAYBACK_ACTIVE_NOTES(state, notes) {
      state.activeNotes = notes;
    },
    SET_PLAYBACK_START_TIMESTAMP(state, timestamp) {
      state.startTimestamp = timestamp;
    },
  },
  actions: {
    setPlaybackEntryId({ commit }, entryId) {
      commit('SET_PLAYBACK_CURRENT_ENTRY', entryId);
    },
    startPlayback({ commit }, { startTimestamp }) {
      if (startTimestamp) {
        commit('SET_PLAYBACK_START_TIMESTAMP', startTimestamp);
      }
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_PLAYING);
    },
    pausePlayback({ commit, getters }, { pauseTimestamp }) {
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_PAUSED);
      if (pauseTimestamp) {
        commit('SET_PLAYBACK_TIMESTAMP', getters.playbackTimestamp
          + pauseTimestamp - getters.playbackStartTimestamp);
      }
    },
    stopPlayback({ commit }) {
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_STOPPED);
      commit('SET_PLAYBACK_TIMESTAMP', 0);
      commit('SET_SCORE_CURRENT_ENTRY_ID', 0);
    },
    setPlaybackActiveNotes({ commit }, notes) {
      commit('SET_PLAYBACK_ACTIVE_NOTES', notes);
    },
  },
  getters: {
    isPlaybackPlaying(state) {
      const playbackStatus = R.path(['status'], state);

      switch (playbackStatus) {
        case PLAYBACK_STATUS_PLAYING:
          return true;
        default:
          return false;
      }
    },
    isPlaybackStopped(state) {
      const playbackStatus = R.path(['status'], state);
      if (playbackStatus === PLAYBACK_STATUS_STOPPED) return true;
      return false;
    },
    playbackTimestamp(state) {
      return R.path(['timestamp'], state);
    },
    playbackStartTimestamp(state) {
      return R.path(['startTimestamp'], state);
    },
    playbackActiveNotes(state) {
      return R.path(['activeNotes'], state);
    },
  },
};
