<template>
  <section>
    <slot />
  </section>
</template>

<script>
import * as R from 'ramda';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'score-animator',
  data() {
    return ({
      requestAF: null,
      timings: [],
    });
  },
  computed: {
    ...mapGetters([
      'isPlaybackPlaying',
      'playbackTimestamp',
      'playbackStartTimestamp',
      'scoreCurrentEntry',
      'scoreEntryTiming',
    ]),
    nextHopAt() {
      return R.pathOr(Infinity, [0, 'timestamp'])(this.timings);
    },
    currentEntryId() {
      return R.pathOr(0, [0, 'id'])(this.timings);
    },
  },
  watch: {
    isPlaybackPlaying(isPlaying) {
      if (isPlaying) {
        this.startPlaybackAnimation();
      } else {
        this.stopPlaybackAnimation();
      }
    },
    scoreEntryTiming(newTiming) {
      this.filterTimingEntries(newTiming);
    },
  },
  methods: {
    ...mapActions([
      'setScoreCurrentEntryId',
    ]),
    filterTimingEntries(timing) {
      this.timings = R.filter(
        R.propSatisfies(R.lt(this.playbackTimestamp), 'timestamp'),
      )(timing);
    },
    startPlaybackAnimation() {
      this.filterTimingEntries(this.scoreEntryTiming);
      this.requestAF = requestAnimationFrame(this.scoreStepLoop);
    },
    stopPlaybackAnimation() {
      cancelAnimationFrame(this.requestAF);
    },
    scoreStepLoop() {
      const timeInSong = this.playbackTimestamp
        + this.AudioContext.currentTime
        - this.playbackStartTimestamp;


      if (timeInSong >= this.nextHopAt) {
        this.setScoreCurrentEntryId(this.currentEntryId);
        this.timings = this.timings.slice(1);
      }

      this.requestAF = requestAnimationFrame(this.scoreStepLoop);
    },
  },
};
</script>

<style lang="sass" scoped>

</style>
