<template>
  <div id="score-container"></div>
</template>

<script>
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import EventBus from '../event-bus/event-bus';
import {
  PLAYBACK_CONTROL_STEP_FORWARD,
} from '../event-bus/events';

export default {
  name: 'Score',
  props: {
    xml: String,
  },
  watch: {
    xml() {
      const { osmb, xml } = this;
      if (xml) {
        osmb.load(xml).then(() => { osmb.render(); });
      }
    },
  },
  data() {
    return {
      osmb: {},
    };
  },
  methods: {
    cursorStepForward() {
      const { osmb } = this;
      osmb.cursor.iterator.moveToNext();
      osmb.render();
    },
  },
  mounted() {
    this.osmb = new OpenSheetMusicDisplay('score-container');

    const { osmb, xml } = this;
    if (xml) {
      osmb.load(xml).then(() => {
        osmb.cursor.show();
        osmb.render();
      });
    }

    EventBus.$on(PLAYBACK_CONTROL_STEP_FORWARD, () => this.cursorStepForward());
  },
};
</script>

<style lang="scss" scoped>

</style>
