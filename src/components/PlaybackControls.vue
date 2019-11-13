<template>
   <div class="playback-controls">
    <playback-button
      class="playback-button"
      icon="step-backward"
      :onClick="handleStepBackward" />
    <playback-button
      class="playback-button"
      :icon="playPauseIcon"
      :onClick="togglePlayPause" />
    <playback-button
      class="playback-button"
      icon="stop"
      :onClick="handleStop" />
    <playback-button
      class="playback-button"
      icon="step-forward"
      :onClick="handleStepForward" />
   </div>
</template>

<script>
import EventBus from '../event-bus/event-bus';
import {
  PLAYBACK_CONTROL_PLAY,
  PLAYBACK_CONTROL_PAUSE,
  PLAYBACK_CONTROL_STOP,
  PLAYBACK_CONTROL_STEP_FORWARD,
  PLAYBACK_CONTROL_STEP_BACKWARD,
} from '../event-bus/events';
import PlaybackButtonVue from './PlaybackButton.vue';

export default {
  name: 'playback-controls',
  components: {
    'playback-button': PlaybackButtonVue,
  },
  methods: {
    handlePlay() {
      EventBus.$emit(PLAYBACK_CONTROL_PLAY);
    },
    handlePause() {
      EventBus.$emit(PLAYBACK_CONTROL_PAUSE);
    },
    handleStop() {
      EventBus.$emit(PLAYBACK_CONTROL_STOP);
    },
    handleStepForward() {
      EventBus.$emit(PLAYBACK_CONTROL_STEP_FORWARD);
    },
    handleStepBackward() {
      EventBus.$emit(PLAYBACK_CONTROL_STEP_BACKWARD);
    },
    togglePlayPause() {
      const { isPlaying, handlePlay, handlePause } = this;

      if (isPlaying) {
        this.isPlaying = false;
        handlePause();
      } else {
        this.isPlaying = true;
        handlePlay();
      }
    },
  },
  computed: {
    playPauseIcon() {
      const { isPlaying } = this;
      return isPlaying ? 'pause' : 'play';
    },
  },
  data() {
    return {
      isPlaying: false,
    };
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
  }
</style>
