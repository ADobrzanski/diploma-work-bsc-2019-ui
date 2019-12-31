<template>
  <soundfont-player
    :audioContext="AudioContext"
    :isPlaying="isPlaying"
    :isStopped="isStopped"
    :notes="notes"
    :timestamp="timestamp"
    :startTimestamp="playbackStartTimestamp"
    :immediates="immediates"
    @endReached="stopPlayback"/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SoundfontPlayerVue from './SoundfontPlayer.vue';
import { APP_MODE_PLAYBACK } from '../../store/modules/application/consts';

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
      'applicationMode',
      'immediates',
    ]),
    isPlaying() {
      return this.applicationMode === APP_MODE_PLAYBACK
        ? this.isPlaybackPlaying
        : false;
    },
    isStopped() {
      return this.applicationMode === APP_MODE_PLAYBACK
        ? this.isPlaybackStopped
        : true;
    },
    notes() {
      return this.applicationMode === APP_MODE_PLAYBACK
        ? this.scoreNotes
        : [];
    },
    timestamp() {
      return this.applicationMode === APP_MODE_PLAYBACK
        ? this.playbackTimestamp
        : 0;
    },
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
