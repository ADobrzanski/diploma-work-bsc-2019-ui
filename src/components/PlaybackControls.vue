<template>
   <div class="playback-controls">
    <playback-button
      v-if="false"
      class="playback-button"
      icon="step-backward"
      :onClick="handleStepBackward" />
    <playback-button
      class="playback-button"
      :icon="playPauseIcon"
      :onClick="toggleIsPlaying" />
    <playback-button
      class="playback-button"
      icon="stop"
      :onClick="stopPlayback" />
    <playback-button
      class="playback-button"
      icon="step-forward"
      :onClick="handleStepForward" />
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PlaybackButtonVue from './PlaybackButton.vue';

export default {
  name: 'playback-controls',
  components: {
    'playback-button': PlaybackButtonVue,
  },
  computed: {
    ...mapGetters({
      isPlaying: 'isPlaybackPlaying',
    }),
    playPauseIcon() {
      const { isPlaying } = this;
      return isPlaying ? 'pause' : 'play';
    },
  },
  methods: {
    ...mapActions([
      'startPlayback',
      'pausePlayback',
      'stopPlayback',
      'increaseScoreCurrentEntryId',
    ]),
    handleStop() {
      this.stopPlayback();
    },
    handleStepForward() {
      this.increaseScoreCurrentEntryId();
    },
    handleStepBackward() {
    },
    toggleIsPlaying() {
      const { isPlaying } = this;
      if (isPlaying) {
        this.pausePlayback({ pauseTimestamp: this.AudioContext.currentTime });
      } else {
        this.startPlayback({ startTimestamp: this.AudioContext.currentTime });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .playback-controls {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;

    background-color: lightgreen;
    padding: 16px 0;
  }

  .playback-button {
    margin: 0 10px;

    &:focus {
      outline: 0;
    }

    &:active {
      color: gray;
    }
  }
</style>
