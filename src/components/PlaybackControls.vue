<template>
   <div class="playback-controls">
    <playback-button
      class="playback-button"
      icon="step-backward"
      :onClick="onStepBackward" />
    <playback-button
      class="playback-button"
      :icon="playPauseIcon"
      :onClick="togglePlayPause" />
    <playback-button
      class="playback-button"
      icon="stop"
      :onClick="onStop" />
    <playback-button
      class="playback-button"
      icon="step-forward"
      :onClick="onStepForward" />
   </div>
</template>

<script>
import PlaybackButtonVue from './PlaybackButton.vue';

export default {
  name: 'playback-controls',
  components: {
    'playback-button': PlaybackButtonVue,
  },
  props: {
    onPlay: {
      type: Function,
      default: () => null,
    },
    onPause: {
      type: Function,
      default: () => null,
    },
    onStop: {
      type: Function,
      default: () => null,
    },
    onStepForward: {
      type: Function,
      default: () => null,
    },
    onStepBackward: {
      type: Function,
      default: () => null,
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
  methods: {
    togglePlayPause() {
      const { isPlaying, onPlay, onPause } = this;

      if (isPlaying) {
        this.isPlaying = false;
        onPause();
      } else {
        this.isPlaying = true;
        onPlay();
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
  }
</style>
