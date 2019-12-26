<template>
  <section>
    <slot />
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'score-animator',
  data() {
    return ({
      requestAF: null,
      nextHopAt: null,
    });
  },
  computed: {
    ...mapGetters([
      'isPlaybackPlaying',
      'playbackTimestamp',
      'playbackStartTimestamp',
      'scoreCurrentEntry',
    ]),
  },
  watch: {
    isPlaybackPlaying(isPlaying) {
      if (isPlaying) {
        this.startPlaybackAnimation();
      } else {
        this.stopPlaybackAnimation();
      }
    },
  },
  methods: {
    ...mapActions([
      'increaseScoreCurrentEntryId',
    ]),
    startPlaybackAnimation() {
      this.nextHopAt = this.playbackStartTimestamp
        + this.scoreCurrentEntry.timeToNext;
      this.requestAF = requestAnimationFrame(this.scoreStepLoop);
    },
    stopPlaybackAnimation() {
      cancelAnimationFrame(this.requestAF);
    },
    scoreStepLoop() {
      /* const timeInTimestamp = this.playbackTimestamp
        + this.playbackStartTimestamp
        - performance.now(); */

      if (this.AudioContext.currentTime >= this.nextHopAt) {
        this.increaseScoreCurrentEntryId();
        this.nextHopAt += this.scoreCurrentEntry.timeToNext;
      }

      this.requestAF = requestAnimationFrame(this.scoreStepLoop);
    },
  },
};
</script>

<style lang="sass" scoped>

</style>
