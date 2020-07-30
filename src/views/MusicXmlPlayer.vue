<template>
    <div class="player-container">
      <player />
      <training-controler />
      <div style="position: absolute">
        <playback-controls />
        <transforming-menu />
      </div>
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
      <auth-modal v-model="authDialog" />
      <upload-dialog
        v-model="uploadDialog"
        :file="file"
        :scoreDetails="scoreDetails" />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
/* eslint-disable import/extensions */
import Score from '../components/Score/Score.vue';
import ScoreAnimator from '../components/Score/ScoreAnimator.vue';
import DropZone from '../components/DropZone.vue';
// import exampleMxml from '../assets/BrookeWestSample.musicxml';
import PlaybackControls from '../components/PlaybackControls.vue';
import TrainingControler from '../components/Training/Controller.vue';
import Player from '../components/Player/Player.vue';
import Waterfall from '../components/Waterfall/index.vue';
import PianoKeyboard from '../components/PianoKeyboard/Keyboard.vue';
import ModalTrainingFinished from '../components/Training/ModalFinished.vue';
import AuthModal from '../components/AuthDialog/index.vue';
import UploadDialog from '../components/UploadDialog.vue';
import TransformingMenu from '../components/TransformingMenu/index.vue';
import { APP_MODE_LEARNING, APP_MODE_PLAYBACK } from '../store/modules/application/consts';
import { getLinkByScoreId } from '../api/queries';

export default {
  name: 'MxmlPlayer',
  components: {
    Score,
    'score-animator': ScoreAnimator,
    DropZone,
    PlaybackControls,
    TrainingControler,
    Player,
    waterfall: Waterfall,
    'piano-keyboard': PianoKeyboard,
    ModalTrainingFinished,
    AuthModal,
    UploadDialog,
    TransformingMenu,
  },
  props: ['id'],
  data() {
    return {
      user: null,
      url: null,
      xml: null,
      dialog: false,
    };
  },
  computed: {
    ...mapState({
      file: state => state.application.file,
      isFileSynced: state => state.application.fileSynced,
      isTraining: state => state.application.mode === APP_MODE_LEARNING,
      authDialogVisible: state => state.application.authDialog,
      uploadDialogVisible: state => state.application.uploadDialog,
      scoreDetails: state => state.score.details,
    }),
    authDialog: {
      get() { return this.authDialogVisible; },
      set(newVal) { this.$store.commit('SET_APPLICATION_AUTH_DIALOG', newVal); },
    },
    uploadDialog: {
      get() { return this.uploadDialogVisible; },
      set(val) { this.$store.commit('SET_APPLICATION_UPLOAD_DIALOG', val); },
    },
  },
  watch: {
    file(newVal) {
      newVal.text().then((text) => { this.xml = text; });
    },
    id: {
      handler(newVal) {
        console.log(Number(newVal));
        this.$apollo.query(getLinkByScoreId(Number(newVal)))
          // eslint-disable-next-line arrow-body-style
          .then(({ data }) => {
            this.url = data.score.link;
          }).catch(console.err);
      },
      immediate: true,
    },
    url(newVal) {
      this.fetchScore(newVal);
    },
  },
  methods: {
    ...mapActions([
      'pausePlayback',
      'stopPlayback',
    ]),
    receiveLocalFile(file) {
      this.$store.dispatch('setLocalFile', file);
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
    fetchScore(link, callback = () => {}) {
      fetch(link)
        .then((response) => {
          if (!response.ok) {
            console.error('Fetching score failed.');
          } else {
            response.blob().then(
              blob => this.$store.dispatch('setRemoteFile', blob),
            );
          }
        }).catch(() => {
          console.error('Network error during score fetching.');
        }).finally(callback);
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
