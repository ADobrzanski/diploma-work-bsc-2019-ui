<template>
  <div class="soundfont-player"></div>
</template>

<script>
import Soundfont from 'soundfont-player';
import EventBus from '../event-bus/event-bus';
import { SCORE_PLAY_NOTE } from './Score/events';

export default {
  name: 'soundfont-player',
  data() {
    return ({
      AudioContext: {},
      piano: {},
    });
  },
  mounted() {
    this.initInstrument();
    this.registerEventListeners();
  },
  methods: {
    initInstrument() {
      this.AudioContext = window.AudioContext || window.webkitAudioContext;
      Soundfont
        .instrument(new this.AudioContext(), 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
        .then((soundfont) => {
          this.piano = soundfont;
        });
    },
    registerEventListeners() {
      EventBus.$on(SCORE_PLAY_NOTE, this.playNoteListener);
    },
    playNoteListener(payload) {
      const { piano, AudioContext } = this;
      const {
        note,
        when = 0,
        ...options
      } = payload;

      piano.play(note, when + AudioContext.currentTime, options);
    },
  },
};
</script>

<style lang="scss" scoped>
  .soundfont-player {
    display: hidden;
  }
</style>
