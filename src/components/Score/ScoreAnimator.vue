<template>
  <section class="score-animator">
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
        this.prepareEntries();
        this.awaitNextEntry();
      }
    },
    songTimestamp(newVal, oldVal) {
      if (!R.equals(newVal, oldVal)) {
        this.prepareEntries();
        this.awaitNextEntry();
      }
    },
  },
  methods: {
    ...mapActions([
      'setScoreCurrentEntryId',
    ]),
    prepareEntries() {
      this.entries = R.pipe(
        R.sort(R.prop('timestamp')),
        R.findLastIndex(R.propSatisfies(R.gte(this.songTimestamp), 'timestamp')),
        R.drop(R.__, this.entryTiming),
      )(this.entryTiming);
    },
    startPlaybackAnimation() {
      this.requestAF = requestAnimationFrame(() => this.loop());
    },
    stopPlaybackAnimation() {
      cancelAnimationFrame(this.requestAF);
    },
    awaitNextEntry() {
      let timeInSong = this.songTimestamp;
      if (this.isPlaybackPlaying) {
        timeInSong
          += this.AudioContext.currentTime
          - this.startTimestamp;
      }

      while (timeInSong >= this.nextHopAt) {
        this.setScoreCurrentEntryId(this.nextEntryId);
        this.entries = this.entries.slice(1);
      }
    },
    loop() {
      this.awaitNextEntry();
      this.requestAF = requestAnimationFrame(() => this.loop());
    },
  },
};
</script>

<style lang="scss" scoped>
  .score-animator {
    height: 100%;
  }
</style>
