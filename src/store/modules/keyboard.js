import * as R from 'ramda';

export default {
  state: {
    startKey: 'C2',
    keyCount: 61,
  },
  mutations: {

  },
  actions: {

  },
  getters: {
    keyboardStartKey(state) {
      return R.path(['startKey'], state);
    },
    keyboardKeyCount(state) {
      return R.path(['keyCount'], state);
    },
  },
};
