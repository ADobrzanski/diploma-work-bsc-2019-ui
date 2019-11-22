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
      :onClick="handleStop" />
    <playback-button
      class="playback-button"
      icon="step-forward"
      :onClick="handleStepForward" />
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
  computed: {
    ...mapGetters({
      isPlaying: 'isScorePlaying',
    }),
    playPauseIcon() {
      const { isPlaying } = this;
      return isPlaying ? 'pause' : 'play';
    },
  },
  watch: {
    isPlaying() {
      const { isPlaying, handlePlay, handlePause } = this;

      if (isPlaying) {
        handlePlay();
      } else {
        handlePause();
      }
    },
  },
  methods: {
    ...mapActions({
      setIsPlayingTo: 'setScorePlaying',
    }),
    handlePlay() {
      EventBus.$emit(PLAYBACK_CONTROL_PLAY);
    },
    handlePause() {
      EventBus.$emit(PLAYBACK_CONTROL_PAUSE);
    },
    handleStop() {
      const { setIsPlayingTo } = this;
      EventBus.$emit(PLAYBACK_CONTROL_STOP);
      setIsPlayingTo(false);
    },
    handleStepForward() {
      EventBus.$emit(PLAYBACK_CONTROL_STEP_FORWARD);
    },
    handleStepBackward() {
      EventBus.$emit(PLAYBACK_CONTROL_STEP_BACKWARD);
    },
    toggleIsPlaying() {
      const { isPlaying, setIsPlayingTo } = this;
      setIsPlayingTo(!isPlaying);
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
