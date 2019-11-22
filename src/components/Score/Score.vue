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
  playVerticalEntry,
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
      'setScorePlaying',
    ]),
    initializeOSMD() {
      this.osmd = new OpenSheetMusicDisplay('score-container', { followCursor: true });
    },
    initializeSheetData() {
      this.setScoreReady(false);
      this.loadSheetFromProps()
        .then(() => {
          this.osmd.render();
          this.prepareDataForPlayback();
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
      EventBus.$on(PLAYBACK_CONTROL_STOP, () => { this.stopPlayback(); });
      EventBus.$on(PLAYBACK_CONTROL_PLAY, () => { this.startPlayback(); });
      EventBus.$on(PLAYBACK_CONTROL_PAUSE, () => { this.pausePlayback(); });
    },
    cursorStepForward() {
      const { osmd } = this;
      osmd.cursor.next();
      if (this.currentEntryIndex < this.verticalEntries.length + 1) {
        this.currentEntryIndex += 1;
        playVerticalEntry(this.verticalEntries[this.currentEntryIndex]);
      }
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
    stopPlayback() {
      clearTimeout(this.playback);
      this.cursorReset();
      this.currentEntryIndex = -1;
      this.setScorePlaying(false);
    },
    doPlaybackStep() {
      const { osmd } = this;
      this.currentEntryIndex += 1;
      if (this.currentEntryIndex === this.verticalEntries.length) {
        this.stopPlayback();
      }
      playVerticalEntry(this.verticalEntries[this.currentEntryIndex]);
      const timeoutToNextEntry = this.verticalEntries[this.currentEntryIndex].timeToNext;
      this.playback = setTimeout(() => {
        osmd.cursor.next();
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
