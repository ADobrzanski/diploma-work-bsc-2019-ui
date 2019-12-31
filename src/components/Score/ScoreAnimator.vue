<template>
  <section>
    <slot />
  </section>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import * as R from 'ramda';
import { mapGetters, mapActions, mapState } from 'vuex';
import { APP_MODE_PLAYBACK } from '../../store/modules/application/consts';

export default {
  name: 'score-animator',
  data() {
    return ({
      requestAF: null,
      entries: [],
    });
  },
  computed: {
    ...mapState({
      songTimestamp: state => state.playback.timestamp,
      startTimestamp: state => state.playback.startTimestamp,
      entryTiming: state => state.score.timing,
      entryID: state => state.score.entryId,
      isPlaybackMode: state => state.application.mode === APP_MODE_PLAYBACK,
    }),
    ...mapGetters([
      'isPlaybackPlaying',
    ]),
    nextHopAt() {
      console.log('SA: possibly a nextHopAt change');
      return R.pathOr(Infinity, [0, 'timestamp'])(this.entries);
    },
    nextEntryId() {
      return R.pathOr(0, [0, 'id'])(this.entries);
    },
  },
  watch: {
    isPlaybackPlaying(newVal, oldVal) {
      if (
        !R.equals(newVal, oldVal)
        && this.isPlaybackMode
      ) {
        if (newVal) {
          this.startPlaybackAnimation();
        } else {
          this.stopPlaybackAnimation();
        }
      }
    },
    entryTiming(newVal, oldVal) {
      if (!R.equals(newVal, oldVal)) {
        console.log('SA: entryTiming changed');
        this.prepareEntries();
        this.awaitNextEntry();
      }
    },
    songTimestamp(newVal, oldVal) {
      if (!R.equals(newVal, oldVal)) {
        console.log(`SA: timestamp ${this.songTimestamp}`);
        this.prepareEntries();
        this.awaitNextEntry();
      }
    },
    entries(newVal, oldVal) {
      if (!R.equals(newVal, oldVal)) {
        console.log('SA: entries have been changed');
        console.log(newVal);
      }
    },
    nextHopAt(newVal, oldVal) {
      if (!R.equals(newVal, oldVal)) {
        console.log(`SA: nextHotAt watch - ${newVal}`);
      }
    },
  },
  methods: {
    ...mapActions([
      'setScoreCurrentEntryId',
    ]),
    prepareEntries() {
      console.log('SA: prepareEntries()');
      this.entries = R.pipe(
        R.sort(R.prop('timestamp')),
        R.findLastIndex(R.propSatisfies(R.gte(this.songTimestamp), 'timestamp')),
        R.drop(R.__, this.entryTiming),
      )(this.entryTiming);
      console.log(this.entries);
    },
    startPlaybackAnimation() {
      this.requestAF = requestAnimationFrame(() => this.loop());
    },
    stopPlaybackAnimation() {
      cancelAnimationFrame(this.requestAF);
    },
    awaitNextEntry() {
      let timeInSong = this.songTimestamp;
      console.log(`SA: await - timeInSong ${timeInSong}`);
      console.log(`SA: await - nextHopAt ${this.nextHopAt}`);
      console.log(`SA: await - isPlaygin ${this.isPlaybackPlaying}`);
      if (this.isPlaybackPlaying) {
        timeInSong
          += this.AudioContext.currentTime
          - this.startTimestamp;
      }

      while (timeInSong >= this.nextHopAt) {
        console.log(`SA: hop - id ${this.nextEntryId}`);
        this.setScoreCurrentEntryId(this.nextEntryId);
        this.entries = this.entries.slice(1);
        console.log(`SA: nextHopAt: ${this.nextHopAt}`);
      }
      console.log('SA: ----- await footer ----------');
      console.log(`SA: hop - id ${this.nextEntryId}`);
      console.log(`SA: nextHopAt: ${this.nextHopAt}`);
      console.log('SA: ----------------------------');
    },
    loop() {
      this.awaitNextEntry();
      this.requestAF = requestAnimationFrame(() => this.loop());
    },
  },
};
</script>

<style lang="sass" scoped>

</style>
