import Vue from 'vue';
import Vuex from 'vuex';
import * as R from 'ramda';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    score: {
      isReady: false,
      isPlaying: false,
    },
  },
  mutations: {
    SET_SCORE_READY(state, isReady) {
      // eslint-disable-next-line no-param-reassign
      state.score = R.assoc('isReady', isReady)(state.score);
    },
    SET_SCORE_PLAYING(state, isPlaying) {
      // eslint-disable-next-line no-param-reassign
      state.score = R.assoc('isPlaying', isPlaying)(state.score);
    },
  },
  actions: {
    setScoreReady({ commit }, isReady) {
      commit('SET_SCORE_READY', isReady);
    },
    setScorePlaying({ commit }, isPlaying) {
      commit('SET_SCORE_PLAYING', isPlaying);
    },
  },
  getters: {
    isScoreReady(state) {
      return R.path(['score', 'isReady'], state);
    },
    isScorePlaying(state) {
      return R.path(['score', 'isPlaying'], state);
    },
  },
  modules: {
  },
});
