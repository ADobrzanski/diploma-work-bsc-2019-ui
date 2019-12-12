<template>
  <div class="soundfont-player"></div>
</template>

<script>
import * as R from 'ramda';

import { mapGetters, mapActions } from 'vuex';
import Soundfont from 'soundfont-player';
// import EventBus from '../event-bus/event-bus';
// import { SCORE_PLAY_NOTE } from './Score/events';

export default {
  name: 'soundfont-player',
  data() {
    return ({
      AudioContext: {},
      piano: {},
      rawNotes: [],
      scheduableNotes: [],
    });
  },
  computed: {
    ...mapGetters([
      'scoreEntries',
      'isPlaybackPlaying',
      'playbackTimestamp',
      'playbackStartTimestamp',
      'playbackActiveNotes',
    ]),
  },
  watch: {
    scoreEntries(entries) {
      this.rawNotes = this.mapEntriesToRawNotes(entries);
      this.scheduableNotes = this.mapRawNotesToScheduable();
    },
    playbackTimestamp() {
      this.scheduableNotes = this.mapRawNotesToScheduable();
    },
    isPlaybackPlaying(isPlaying) {
      if (isPlaying) {
        this.piano.schedule(
          this.AudioContext.currentTime,
          this.scheduableNotes,
        );
      } else {
        this.piano.stop();
      }
    },
  },
  mounted() {
    this.initInstrument();
    this.initMidiCapture();
    this.registerEventListeners();
  },
  methods: {
    ...mapActions(['setPlaybackActiveNotes']),
    initInstrument() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.AudioContext = new AudioContext();
      Soundfont
        .instrument(this.AudioContext, 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
        .then((soundfont) => {
          this.piano = soundfont;
          /* this.piano.schedule(AudioContext.currentTime, [
            { time: -1, note: 37 },
            { time: 2, note: 69 },
          ]); */
        });
    },
    initMidiCapture() {
      navigator.requestMIDIAccess().then((midiAccess) => {
        console.log(midiAccess.inputs);
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
    registerEventListeners() {
      // EventBus.$on(SCORE_PLAY_NOTE, this.playNoteListener);
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
    mapEntriesToRawNotes: R.chain(
      entry => R.map(
        R.assoc('time', entry.timestamp),
        R.prop('notes')(entry),
      ),
    ),
    mapRawNotesToScheduable() {
      const isRelevant = R.lte(this.playbackTimestamp);
      const timeLens = R.lensProp('time');
      /* eslint-disable no-underscore-dangle */
      return R.pipe(
        R.filter(R.propSatisfies(isRelevant, 'time')),
        R.map(R.over(
          timeLens,
          time => (time - this.playbackTimestamp) / 1000,
        )),
      )(this.rawNotes);
      /* eslint-enable */
    },
  },
};
</script>

<style lang="scss" scoped>
  .soundfont-player {
    display: hidden;
  }
</style>
