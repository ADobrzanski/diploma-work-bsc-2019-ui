<template>
  <div id="score-container" class="score-container"></div>
</template>

<script>
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import EventBus from '../event-bus/event-bus';
import {
  PLAYBACK_CONTROL_STEP_FORWARD,
  PLAYBACK_CONTROL_STOP,
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
      osmb.cursor.next();
    },
    cursorReset() {
      const { osmb } = this;
      osmb.cursor.reset();
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

    EventBus.$on(PLAYBACK_CONTROL_STEP_FORWARD, () => { this.cursorStepForward(); });
    EventBus.$on(PLAYBACK_CONTROL_STOP, () => { this.cursorReset(); });
  },
};
</script>

<style lang="scss" scoped>
.score-container {
  width: 800px;
}
</style>
