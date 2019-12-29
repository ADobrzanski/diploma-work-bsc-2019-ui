import Vue from 'vue';
import Vuex from 'vuex';
import playback from './modules/playback';
import keyboard from './modules/keyboard';
import score from './modules/score';
import application from './modules/application/application';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    playback,
    keyboard,
    score,
    application,
  },
});
