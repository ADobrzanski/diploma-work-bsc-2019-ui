<template>
  <section id="keyboard" class="keyboard">
    <key
      v-for="key in this.keys"
      :key="key.midiCode"
      :midiCode="key.midiCode"
      :type="key.type"
      :prevKeyType="key.prevKeyType"
      :pianoSize="pianoSize"/>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as R from 'ramda';
import Key from './PianoKey.vue';
import {
  getMidiCodeFromKey,
  getKeyTypeFromMidiCode,
  KEY_WHITE,
} from './utils';

export default {
  name: 'piano-keyboard',
  components: {
    key: Key,
  },
  props: {
    firstKey: {
      type: String,
      default: 'C2',
    },
    keyCount: {
      type: Number,
      default: 12,
    },
  },
  computed: {
    ...mapGetters([
      'isPlaybackPlaying',
      'playbackTimestamp',
      'playbackStartTimestamp',
      'scoreNotesThroughTime',
    ]),
    keys() {
      const firstMidiCode = getMidiCodeFromKey(this.firstKey);
      let lastMidiCode = firstMidiCode + this.keyCount;
      if (getKeyTypeFromMidiCode(lastMidiCode) === KEY_WHITE) lastMidiCode += 1;
      const midiCodes = R.range(firstMidiCode, lastMidiCode);


      return midiCodes.map((midiCode, idx, codes) => {
        let prevKeyType = KEY_WHITE;
        if (idx > 0) prevKeyType = getKeyTypeFromMidiCode(codes[(idx - 1)]);
        return ({
          midiCode,
          type: getKeyTypeFromMidiCode(midiCode),
          prevKeyType,
        });
      });
    },
    pianoSize() {
      return this.keys.filter(R.propEq('type', KEY_WHITE)).length;
    },
    nextChangeAt() {
      return R.pathOr(Infinity, [0, 'timestamp'])(this.timeline);
    },
    activeNotes() {
      return R.pathOr([], [0, 'notes'])(this.timeline);
    },
  },
  data() {
    return {
      timeline: [],
      raf: null,
    };
  },
  watch: {
    scoreNotesThroughTime() {
      this.filterNotes();
      this.awaitActiveChange();
    },
    isPlaybackPlaying(isPlaying) {
      if (isPlaying) {
        this.start();
      } else {
        cancelAnimationFrame(this.raf);
        this.filterNotes();
        this.awaitActiveChange();
      }
    },
    playbackTimestamp() {
      this.filterNotes();
      this.awaitActiveChange();
    },
  },
  methods: {
    ...mapActions(['setPlaybackActiveNotes']),
    filterNotes() {
      this.timeline = R.pipe(
        R.filter(R.propSatisfies(R.lt(this.playbackTimestamp))),
        R.sortBy(R.prop('timestamp')),
      )(this.scoreNotesThroughTime);
    },
    start() {
      this.loop();
    },
    awaitActiveChange() {
      let timeInSong = this.playbackTimestamp;
      if (this.isPlaybackPlaying) {
        timeInSong += this.AudioContext.currentTime
        - this.playbackStartTimestamp;
      }

      while (this.nextChangeAt <= timeInSong) {
        this.setPlaybackActiveNotes(this.activeNotes);
        this.timeline = this.timeline.slice(1);
      }
    },
    loop() {
      this.awaitActiveChange();
      this.raf = requestAnimationFrame(() => this.loop());
    },
  },
};
</script>

<style lang="scss" scoped>
  .keyboard {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-content: top;
  }
</style>
