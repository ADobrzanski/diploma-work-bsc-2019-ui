<template>
  <div ref="score-wrapper" class="score-wrapper">
    <div id="score-container" class="score-container elevation-4"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

import {
  mapOsmdToVerticalEntries,
  mapOsmdToNotes,
  mapOsmdToEntryTiming,
  mapOsmdToActiveNoteTimeline,
} from './playbackHelpers';
import { getScoreDetailsFromOsmd } from './helpers';

export default {
  name: 'Score',
  props: {
    xml: String,
  },
  computed: {
    ...mapGetters({
      isPlaying: 'isPlaybackPlaying',
      isStopped: 'isPlaybackStopped',
      currentEntryId: 'scoreCurrentEntryId',
    }),
  },
  watch: {
    xml() {
      this.initializeSheetData();
    },
    currentEntryId(newId, oldId) {
      if (newId === 0) {
        this.cursorReset();
      }

      if (oldId < newId) {
        for (let i = oldId; i < newId; i += 1) {
          this.cursorStepForward();
        }
      }

      if (newId < oldId) {
        const { cursor } = this.osmd;
        cursor.hide();
        cursor.reset();
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < newId; ++i) {
          cursor.next();
        }
        this.currentEntryIndex = newId;
        cursor.show();
      }
    },
  },
  data() {
    return {
      osmd: {},
      currentEntryIndex: -1,
      verticalEntries: [], // TODO: get rid of it
    };
  },
  mounted() {
    this.initializeOSMD();
    this.initializeSheetData();
  },
  methods: {
    ...mapActions({
      setScoreReady: 'setScoreReady',
      setScoreNotes: 'setScoreNotes',
      setScoreEntries: 'setScoreEntries',
      setScoreEntryTiming: 'setScoreEntryTiming',
      setScoreNotesThroughTime: 'setScoreNotesThroughTime',
    }),
    initializeOSMD() {
      this.osmd = new OpenSheetMusicDisplay('score-container', { followCursor: true });
    },
    initializeSheetData() {
      this.setScoreReady(false);
      this.loadSheetFromProps()
        .then(() => {
          this.osmd.render();
          this.prepareDataForPlayback();
          this.setScoreEntries(this.verticalEntries);
          this.setScoreReady(true);
        })
        .catch(err => console.error(err.message));
    },
    loadSheetFromProps() {
      const { osmd, xml } = this;
      return xml && osmd.load(xml);
    },
    prepareDataForPlayback() {
      const { osmd } = this;
      const { cursor } = osmd;

      this.$store.commit('SET_SCORE_DETAILS', getScoreDetailsFromOsmd(osmd));
      this.setScoreNotes(mapOsmdToNotes(osmd));
      this.setScoreEntryTiming(mapOsmdToEntryTiming(osmd));
      this.setScoreNotesThroughTime(mapOsmdToActiveNoteTimeline(osmd));
      this.verticalEntries = mapOsmdToVerticalEntries(osmd);
      cursor.reset();
      cursor.show();
    },
    cursorStepForward() {
      const { osmd } = this;
      osmd.cursor.next();
      if (this.currentEntryIndex < this.verticalEntries.length + 1) {
        this.currentEntryIndex += 1;
      }
    },
    cursorReset() {
      const { osmd } = this;
      osmd.cursor.reset();
    },
  },

};
</script>

<style lang="scss" scoped>
.score-wrapper {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
}

.score-container {
  max-width: 1200px;
  width: 100%;
  overflow: hidden;
  margin: auto;
  padding-bottom: 64px;
}
</style>
