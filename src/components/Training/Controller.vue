<template>
  <section></section>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import * as R from 'ramda';
import {
  MIDI_MSG_KEY_PRESSED,
  MIDI_MSG_KEY_RELEASED,
} from './consts';
import {
  APP_MODE_LEARNING,
} from '../../store/modules/application/consts';

export default {
  name: 'training-controller',
  computed: {
    ...mapState({
      entryID: state => state.playback.entryId,
    }),
    ...mapGetters([
      'inputNotes',
      'playbackActiveNotes',
      'isPlaybackPlaying',
      'applicationMode',
    ]),
    isLearningMode() {
      return this.applicationMode === APP_MODE_LEARNING;
    },
    canProceed() {
      return R.equals(this.inputNotes, this.playbackActiveNotes);
    },
  },
  watch: {
    canProceed(newVal, oldVal) {
      if (
        !R.equals(newVal, oldVal)
        && newVal
        && !this.isPlaybackPlaying
        && this.isLearningMode
      ) {
        this.startPlayback({ startTimestamp: this.AudioContext.currentTime });
      }
    },
    entryID(newVal, oldVal) {
      if (this.isLearningMode && this.isPlaybackPlaying && !R.equals(newVal, oldVal)) {
        this.pausePlayback({ pauseTimestamp: this.AudioContext.currentTime + 0.02 });
      }
    },
  },
  mounted() {
    this.initMidiCapture();
  },
  methods: {
    ...mapActions([
      'setPlaybackImmediates',
      'setInputNotes',
      'startPlayback',
      'pausePlayback',
    ]),
    initMidiCapture() {
      navigator
        .requestMIDIAccess()
        .then((midiAccess) => {
          /* eslint-disable */
        	const midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
          var inputs = midi.inputs.values();
          // loop over all available inputs and listen for any MIDI input
          for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = e => this.handleMidiMessage(e); // each time there is a midi message call the onMIDIMessage function
          }
          /* eslint-enable */
        });
    },
    handleMidiMessage({ data }) {
      const [midiCmd, keyCode] = data;
      switch (midiCmd) {
        case MIDI_MSG_KEY_PRESSED:
          this.setPlaybackImmediates([keyCode]); // TO DO
          this.setInputNotes([...this.inputNotes, keyCode]); // TO DO
          break;

        case MIDI_MSG_KEY_RELEASED:
          this.setInputNotes(
            R.filter(code => code !== keyCode)(this.inputNotes),
          );
          break;

        default:
          // do nothing
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
