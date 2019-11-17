<template>
  <div id="score-container" class="score-container"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

import EventBus from '../../event-bus/event-bus';
import {
  PLAYBACK_CONTROL_STEP_FORWARD,
  PLAYBACK_CONTROL_STOP,
  PLAYBACK_CONTROL_PLAY,
  PLAYBACK_CONTROL_PAUSE,
} from '../../event-bus/events';
import {
  mapOsmdToVerticalEntries,
} from './playbackHelpers';

export default {
  name: 'Score',
  props: {
    xml: String,
  },
  computed: {
    ...mapGetters({
      isReady: 'isScoreReady',
    }),
  },
  watch: {
    xml() {
      this.initializeSheetData();
    },
  },
  data() {
    return {
      osmd: {},
      playback: null,
      currentEntryIndex: -1,
      verticalEntries: [],
    };
  },
  mounted() {
    this.initializeOSMD();
    this.initializeSheetData();
    this.registerEventListeners();
  },
  methods: {
    ...mapActions([
      'setScoreReady',
    ]),
    initializeOSMD() {
      this.osmd = new OpenSheetMusicDisplay('score-container');
    },
    initializeSheetData() {
      this.setScoreReady(false);
      this.loadSheetFromProps()
        .then(() => {
          this.prepareDataForPlayback();
          this.osmd.render();
          this.setScoreReady(true);
        })
        .catch(err => console.log(err.message));
    },
    loadSheetFromProps() {
      const { osmd, xml } = this;
      return xml && osmd.load(xml);
    },
    prepareDataForPlayback() {
      const { osmd } = this;
      const { cursor } = osmd;

      this.verticalEntries = mapOsmdToVerticalEntries(osmd);
      cursor.reset();
      cursor.show();
    },
    registerEventListeners() {
      EventBus.$on(PLAYBACK_CONTROL_STEP_FORWARD, () => { this.cursorStepForward(); });
      EventBus.$on(PLAYBACK_CONTROL_STOP, () => { this.cursorReset(); });
      EventBus.$on(PLAYBACK_CONTROL_PLAY, () => { this.startPlayback(); });
      EventBus.$on(PLAYBACK_CONTROL_PAUSE, () => { this.pausePlayback(); });
    },
    cursorStepForward() {
      const { osmd } = this;
      osmd.cursor.next();
    },
    cursorReset() {
      const { osmd } = this;
      osmd.cursor.reset();
    },
    startPlayback() {
      this.doPlaybackStep();
    },
    pausePlayback() {
      clearTimeout(this.playback);
    },
    doPlaybackStep() {
      this.currentEntryIndex += 1;
      const timeoutToNextEntry = this.verticalEntries[this.currentEntryIndex].timeToNext;
      this.playback = setTimeout(() => {
        this.cursorStepForward();
        this.doPlaybackStep();
      }, timeoutToNextEntry);
    },
  },

};
</script>

<style lang="scss" scoped>
.score-container {
  width: 1200px;
  margin: 0 auto;
}
</style>
