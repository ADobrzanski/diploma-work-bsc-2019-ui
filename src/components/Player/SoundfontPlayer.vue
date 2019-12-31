<template>
  <div class="soundfont-player"></div>
</template>

<script>
import * as R from 'ramda';

import Soundfont from 'soundfont-player';
import { mapNotesToSchedulable, filterForScheduleReady } from './helpers';

export default {
  name: 'soundfont-player',
  props: {
    isPlaying: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: Array,
      default: () => [],
    },
    timestamp: {
      type: Number,
      default: 0,
    },
    startTimestamp: {
      type: Number,
      default: 0,
    },
    delay: {
      type: Number,
      default: 0,
    },
    gain: {
      type: Number,
      default: 1,
    },
    immediates: {
      type: Array,
      default: () => [],
    },
    audioContext: {
      default: () => {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
      },
    },
  },
  data() {
    return ({
      mInterval: null,
      piano: {},
    });
  },
  computed: {
    scheduable() {
      return R.pipe(
        R.filter(R.prop('audible')),
        mapNotesToSchedulable,
        R.sortBy(R.prop('time')),
      )(this.notes);
    },
    scheduleReady() {
      const filteder = filterForScheduleReady(this.scheduable, this.timestamp);
      const altered = R.map(R.over(R.lensProp('time'), R.flip(R.subtract)(this.timestamp)))(filteder);
      return altered;
    },
    songLength() {
      const lastNote = R.last(this.scheduable);
      return lastNote.time + lastNote.duration;
    },
  },
  watch: {
    isPlaying(playing) {
      if (playing) {
        this.play();
      } else {
        this.pause();
      }
    },
    immediates(notes) {
      notes.forEach(this.piano.play);
    },
  },
  mounted() {
    this.initInstrument();
    // this.initMidiCapture();
  },
  methods: {
    initInstrument() {
      Soundfont
        .instrument(this.audioContext, 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
        .then((soundfont) => { this.piano = soundfont; });
    },
    playNoteListener(payload) {
      const { piano, audioContext } = this;
      const {
        note,
        when = 0,
        ...options
      } = payload;

      piano.play(note, when + audioContext.currentTime, options);
    },
    now() {
      return this.audioContext.currentTime;
    },
    play() {
      this.piano.schedule(
        this.startTimestamp,
        this.scheduleReady,
      );
      this.scheduleFinish();
    },
    pause() {
      this.piano.stop();
      this.cancelFinishTimeout();
    },
    scheduleFinish() {
      this.mInterval = setInterval(
        () => { this.awaitSongEnd(); },
        200,
      );
    },
    cancelFinishTimeout() {
      clearInterval(this.mInterval);
    },
    awaitSongEnd() {
      const deltaTime = this.now() - this.startTimestamp;
      const timeInSong = this.timestamp + deltaTime;

      if (timeInSong >= this.songLength) {
        this.piano.stop();
        this.$emit('endReached');
        this.cancelFinishTimeout();
      }
    },
  },
};
</script>

<style scoped>
  .soundfont-player {
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    margin: 0;
    padding: 0;
  }
</style>
