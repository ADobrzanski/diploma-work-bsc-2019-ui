<template>
   <div class="playback-controls px-4 py-2">
     <div class="d-flex align-center">
        <playback-button
          v-if="false"
          class="playback-button"
          icon="step-backward"
          :onClick="handleStepBackward" />
        <playback-button
          v-if="!learningMode"
          class="playback-button"
          :icon="playPauseIcon"
          :onClick="toggleIsPlaying" />
        <playback-button
          v-if="!learningMode"
          class="playback-button"
          icon="stop"
          :onClick="stopPlayback" />
        <playback-button
          v-if="!learningMode"
          class="playback-button"
          icon="step-forward"
          :onClick="handleStepForward" />
        <playback-button
          v-if="learningMode"
          class="playback-button"
          icon="undo"
          :onClick="stopPlayback" />
        <v-switch
          label="Learning mode"
          v-model="learningMode"
          class="ma-0 pa-0"
          inset
          hide-details ></v-switch>
     </div>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PlaybackButtonVue from './PlaybackButton.vue';
import {
  APP_MODE_LEARNING,
  APP_MODE_PLAYBACK,
} from '../store/modules/application/consts';

export default {
  name: 'playback-controls',
  components: {
    'playback-button': PlaybackButtonVue,
  },
  data() {
    return {
      me: { id: -1, name: '', email: '' },
    };
  },
  computed: {
    ...mapGetters({
      isPlaying: 'isPlaybackPlaying',
      appMode: 'applicationMode',
    }),
    playPauseIcon() {
      const { isPlaying } = this;
      return isPlaying ? 'pause' : 'play';
    },
    learningMode: {
      get() {
        return this.$store.state.application.mode === APP_MODE_LEARNING;
      },
      set(isLearning) {
        this.$store.commit(
          'SET_APPLICATION_MODE',
          isLearning
            ? APP_MODE_LEARNING
            : APP_MODE_PLAYBACK,
        );
      },
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
    justify-content: space-between;
    align-items: center;
    background-color: lightgreen;
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
