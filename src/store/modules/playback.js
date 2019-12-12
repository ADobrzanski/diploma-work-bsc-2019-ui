/* eslint-disable no-param-reassign */
// eslint-disable no-param-reassign

import * as R from 'ramda';
import {
  PLAYBACK_STATUS_PLAYING,
  PLAYBACK_STATUS_PAUSED,
  PLAYBACK_STATUS_STOPPED,
} from '../values';

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
    setPlaybackEntryId({ commit, getters, rootState }, entryId) {
      console.log(rootState);
      commit('SET_PLAYBACK_CURRENT_ENTRY', entryId);
      const currentTimestamp = getters.scoreEntries[entryId].timestamp;
      commit('SET_PLAYBACK_TIMESTAMP', currentTimestamp);
    },
    startPlayback({ commit }, { timestamp = performance.now() }) {
      commit('SET_PLAYBACK_START_TIMESTAMP', timestamp);
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_PLAYING);
    },
    pausePlayback({ commit, getters }, { timestamp = performance.now() }) {
      commit('SET_PLAYBACK_TIMESTAMP',
        getters.playbackTimestamp
          + timestamp
          - getters.playbackStartTimestamp);
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_PAUSED);
      const currentTimestamp = getters.scoreCurrentEntry.timestamp;
      commit('SET_PLAYBACK_TIMESTAMP', currentTimestamp);
    },
    stopPlayback({ commit, getters }) {
      commit('SET_PLAYBACK_TIMESTAMP', 0);
      commit('SET_SCORE_CURRENT_ENTRY_ID', 0);
      commit('SET_PLAYBACK_STATUS', PLAYBACK_STATUS_STOPPED);

      const currentTimestamp = getters.scoreCurrentEntry.timestamp;
      commit('SET_PLAYBACK_TIMESTAMP', currentTimestamp);
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
