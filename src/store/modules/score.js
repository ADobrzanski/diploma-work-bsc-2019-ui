import * as R from 'ramda';

export default {
  state: {
    isReady: false,
    entries: [],
    entryId: 0,
  },
  mutations: {
    SET_SCORE_READY(state, isReady) {
      // eslint-disable-next-line no-param-reassign
      state.isReady = isReady;
    },
    SET_SCORE_ENTRIES(state, entries) {
      // eslint-disable-next-line no-param-reassign
      state.entries = entries;
    },
    SET_SCORE_CURRENT_ENTRY_ID(state, entryId) {
      // eslint-disable-next-line no-param-reassign
      state.entryId = entryId;
    },
  },
  actions: {
    setScoreReady({ commit }, isReady) {
      commit('SET_SCORE_READY', isReady);
    },
    setScoreEntries({ commit }, entries) {
      commit('SET_SCORE_ENTRIES', entries);
    },
    setScoreCurrentEntryId({ commit }, entryId) {
      commit('SET_SCORE_CURRENT_ENTRY_ID', entryId);
    },
    increaseScoreCurrentEntryId({ getters, dispatch }) {
      dispatch(
        'setScoreCurrentEntryId',
        getters.scoreCurrentEntryId + 1,
      );
    },
  },
  getters: {
    isScoreReady(state) {
      return R.prop('isReady', state);
    },
    scoreEntries(state) {
      return R.path(['entries'], state);
    },
    scoreCurrentEntryId(state) {
      return R.path(['entryId'], state);
    },
    scoreCurrentEntry(_, getters) {
      const { scoreEntries, scoreCurrentEntryId } = getters;
      return scoreEntries[scoreCurrentEntryId];
    },
  },
};
