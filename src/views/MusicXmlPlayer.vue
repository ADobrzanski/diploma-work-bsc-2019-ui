<template>
    <div class="player-container">
      <player />
      <training-controler />
      <playback-controls />
      <drop-zone :onDrop="receiveLocalFile">
        <score-animator>
          <score v-bind:xml="xml" />
        </score-animator>
      </drop-zone>
      <waterfall />
      <piano-keyboard
        firstKey="C2"
        :keyCount=61
        @endReached="handleEndReached"
      />
      <modal-training-finished
        :visible="dialog"
        :onRepeat="handleRepeat"
        :onExit="setPlaybackMode" />
      <auth-modal
        v-model="authDialog"/>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
/* eslint-disable import/extensions */
import Score from '../components/Score/Score.vue';
import ScoreAnimator from '../components/Score/ScoreAnimator.vue';
import DropZone from '../components/DropZone.vue';
import exampleMxml from '../assets/BrookeWestSample.musicxml';
import PlaybackControlsVue from '../components/PlaybackControls.vue';
import TrainingControler from '../components/Training/Controller.vue';
import Player from '../components/Player/Player.vue';
import Waterfall from '../components/Waterfall/index.vue';
import PianoKeyboard from '../components/PianoKeyboard/Keyboard.vue';
import ModalTrainingFinished from '../components/Training/ModalFinished.vue';
import AuthModal from '../components/AuthDialog/index.vue';
import { APP_MODE_LEARNING, APP_MODE_PLAYBACK } from '../store/modules/application/consts';

export default {
  name: 'MxmlPlayer',
  components: {
    Score,
    'score-animator': ScoreAnimator,
    DropZone,
    'playback-controls': PlaybackControlsVue,
    TrainingControler,
    Player,
    waterfall: Waterfall,
    'piano-keyboard': PianoKeyboard,
    ModalTrainingFinished,
    AuthModal,
  },
  data() {
    return {
      xml: exampleMxml,
      dialog: false,
    };
  },
  watch: {
    dialog(newVal) {
      console.log(newVal);
    },
  },
  computed: {
    ...mapState({
      isTraining: state => state.application.mode === APP_MODE_LEARNING,
      authDialogVisible: state => state.application.authDialog,
    }),
    authDialog: {
      get() { return this.authDialogVisible; },
      set(newVal) { this.$store.commit('SET_APPLICATION_AUTH_DIALOG', newVal); },
    },
  },
  methods: {
    ...mapActions([
      'pausePlayback',
      'stopPlayback',
    ]),
    receiveLocalFile(file) {
      file.text().then((text) => { this.xml = text; });
    },
    handleEndReached() {
      if (this.isTraining) {
        this.dialog = true;
        this.pausePlayback({ pauseTimestamp: this.AudioContext.currentTime });
      }
    },
    handleRepeat() {
      this.stopPlayback();
      this.dialog = false;
    },
    setPlaybackMode() {
      this.$store.commit('SET_APPLICATION_MODE', APP_MODE_PLAYBACK);
      this.stopPlayback();
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .player-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
