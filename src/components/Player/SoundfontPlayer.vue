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
  },
  mounted() {
    this.initInstrument();
    this.initMidiCapture();
  },
  methods: {
    initInstrument() {
      Soundfont
        .instrument(this.audioContext, 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
        .then((soundfont) => { this.piano = soundfont; });
    },
    initMidiCapture() {
      navigator.requestMIDIAccess().then((midiAccess) => {
        const handle = ({ data }) => {
          switch (data[0]) {
            case 144:
              this.piano.play(data[1]);
              this.setPlaybackActiveNotes(
                [...this.playbackActiveNotes, data[1]],
              );
              break;
            case 128:
              this.setPlaybackActiveNotes(
                R.filter(code => code !== data[1])(this.playbackActiveNotes),
              );
              break;
            default:
              // do nothing
              break;
          }
        };
          /* eslint-disable */
        	const midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
          var inputs = midi.inputs.values();
        // loop over all available inputs and listen for any MIDI input
          for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = handle;// each time there is a midi message call the onMIDIMessage function
          }
        /* eslint-enable */
      });
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

<style lang="scss" scoped>
  .soundfont-player {
    display: hidden;
  }
</style>
