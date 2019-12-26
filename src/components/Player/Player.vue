<template>
  <soundfont-player
    :audioContext="AudioContext"
    :isPlaying="isPlaybackPlaying"
    :isStopped="isPlaybackStopped"
    :notes="scoreNotes"
    :timestamp="playbackTimestamp"
    :startTimestamp="playbackStartTimestamp"
    @endReached="stopPlayback"/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SoundfontPlayerVue from '../SoundfontPlayer.vue';

export default {
  name: 'player',
  components: {
    'soundfont-player': SoundfontPlayerVue,
  },
  computed: {
    ...mapGetters([
      'playbackTimestamp',
      'playbackStartTimestamp',
      'isPlaybackPlaying',
      'isPlaybackStopped',
      'scoreNotes',
    ]),
  },
  methods: {
    ...mapActions([
      'stopPlayback',
    ]),
  },
};
</script>

<style lang="scss" scoped>

</style>
