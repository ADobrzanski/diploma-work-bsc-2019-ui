import * as R from 'ramda';

export default {
  state: {
    isReady: false,
    entries: [],
    timing: [],
    notes: [],
    notesThroughTime: [],
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
    SET_SCORE_ENTRY_TIMING(state, timing) {
      // eslint-disable-next-line no-param-reassign
      state.timing = timing;
    },
    SET_SCORE_NOTES(state, notes) {
      // eslint-disable-next-line no-param-reassign
      state.notes = notes;
    },
    SET_SCORE_CURRENT_ENTRY_ID(state, entryId) {
      // eslint-disable-next-line no-param-reassign
      state.entryId = entryId;
    },
    SET_SCORE_NOTES_THROUGH_TIME(state, notesThroughTime) {
      // eslint-disable-next-line no-param-reassign
      state.notesThroughTime = notesThroughTime;
    },
  },
  actions: {
    setScoreReady({ commit }, isReady) {
      commit('SET_SCORE_READY', isReady);
    },
    setScoreEntries({ commit }, entries) {
      commit('SET_SCORE_ENTRIES', entries);
    },
    setScoreEntryTiming({ commit }, timing) {
      commit('SET_SCORE_ENTRY_TIMING', timing);
    },
    setScoreNotes({ commit }, notes) {
      commit('SET_SCORE_NOTES', notes);
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
    setScoreNotesThroughTime({ commit }, notesThroughTime) {
      commit('SET_SCORE_NOTES_THROUGH_TIME', notesThroughTime);
    },
  },
  getters: {
    isScoreReady(state) {
      return R.prop('isReady', state);
    },
    scoreEntries(state) {
      return R.path(['entries'], state);
    },
    scoreEntryTiming(state) {
      return R.path(['timing'], state);
    },
    scoreNotes(state) {
      return R.path(['notes'], state);
    },
    scoreCurrentEntryId(state) {
      return R.path(['entryId'], state);
    },
    scoreCurrentEntry(_, getters) {
      const { scoreEntries, scoreCurrentEntryId } = getters;
      return scoreEntries[scoreCurrentEntryId];
    },
    scoreNotesThroughTime(state) {
      return R.path(['notesThroughTime'])(state);
    },
  },
};
