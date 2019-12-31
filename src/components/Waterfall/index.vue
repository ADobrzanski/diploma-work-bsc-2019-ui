<template>
  <section>
    <waterfall
      :active="isPlaybackPlaying"
      :now="now"
      :startTimestamp="playbackStartTimestamp"
      :songTimestamp="playbackTimestamp"
      :notes="scoreNotes"
      :keyboard="keyboard" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Waterfall from './Waterfall.vue';

export default {
  name: 'WaterfallWrapper',
  components: { Waterfall },
  computed: {
    ...mapGetters([
      'playbackTimestamp',
      'playbackStartTimestamp',
      'isPlaybackPlaying',
      'scoreNotes',
      'keyboardStartKey',
      'keyboardKeyCount',
    ]),
    keyboard() {
      return ({
        startKey: this.keyboardStartKey,
        keyCount: this.keyboardKeyCount,
      });
    },
  },
  methods: {
    now() {
      return this.AudioContext.currentTime;
    },
  },
};
</script>

<style>

</style>
