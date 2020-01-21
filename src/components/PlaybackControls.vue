<template>
  <v-card
    class="mt-8 ml-8 pa-2"
    width="256"
    color="primary"
  >
    <v-btn icon
      style='z-index: 20'
      v-for="(btn, i) in buttons"
      :key="i"
      @click="btn.callback()">
      <v-icon>{{btn.icon()}}</v-icon>
    </v-btn>

    <v-divider vertical
      class="mx-2" color="accent" inset></v-divider>

    <v-btn dense
      elevation="0"
      color="orange"
      @click="learningMode = !learningMode"
    >
      <v-icon class="mr-2">{{trainingBtnIcon}}</v-icon>{{trainingBtnText}}
    </v-btn>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { APP_MODE_LEARNING, APP_MODE_PLAYBACK } from '../store/modules/application/consts';

export default {
  name: 'playback-controls',
  computed: {
    ...mapGetters([
      'isPlaybackPlaying',
      'applicationMode',
    ]),
    playPauseCallback() {
      return this.isPlaybackPlaying
        ? () => this.pausePlayback({ pauseTimestamp: this.now() })
        : () => this.startPlayback({ startTimestamp: this.now() });
    },
    playPauseIcon() {
      return this.isPlaybackPlaying
        ? 'mdi-pause'
        : 'mdi-play';
    },
    trainingBtnText() {
      return this.learningMode
        ? 'Stop'
        : 'Graj';
    },
    trainingBtnIcon() {
      return this.learningMode
        ? 'mdi-close'
        : 'mdi-piano';
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
    now() {
      return this.AudioContext.currentTime;
    },
  },
  data() {
    return {
      buttons: [
        {
          icon: () => this.playPauseIcon,
          callback: () => this.playPauseCallback(),
        },
        {
          icon: () => 'mdi-skip-next',
          callback: () => this.increaseScoreCurrentEntryId(),
        },
        {
          icon: () => 'mdi-stop',
          callback: () => this.stopPlayback(),
        },
      ],
    };
  },
};
</script>
