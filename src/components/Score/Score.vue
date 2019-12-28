<template>
  <div id="score-container" class="score-container"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

import {
  mapOsmdToVerticalEntries, mapOsmdToNotes, mapOsmdToEntryTiming,
} from './playbackHelpers';

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
        this.cursorStepForward();
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
        .catch(err => console.log(err.message));
    },
    loadSheetFromProps() {
      const { osmd, xml } = this;
      return xml && osmd.load(xml);
    },
    prepareDataForPlayback() {
      const { osmd } = this;
      const { cursor } = osmd;

      this.setScoreNotes(mapOsmdToNotes(osmd));
      this.setScoreEntryTiming(mapOsmdToEntryTiming(osmd));
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
.score-container {
  width: 1200px;
  height: 500px;
  overflow: hidden;
  margin: 0 auto;
}
</style>
