<template>
  <div id="score-container"></div>
</template>

<script>
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

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
  mounted() {
    this.osmb = new OpenSheetMusicDisplay('score-container');

    const { osmb, xml } = this;
    if (xml) {
      osmb.load(xml).then(() => { osmb.render(); });
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
