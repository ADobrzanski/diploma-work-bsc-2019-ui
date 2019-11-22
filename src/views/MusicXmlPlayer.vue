<template>
    <div id="player-container">
      <soundfont-player />
      <playback-controls />
      <DropZone v-bind:onDrop="receiveLocalFile">
        <Score v-bind:xml="xml" />
      </DropZone>
    </div>
</template>

<script>
import Score from '../components/Score/Score.vue';
import DropZone from '../components/DropZone.vue';
import exampleMxml from '../assets/BrookeWestSample.musicxml';
import PlaybackControlsVue from '../components/PlaybackControls.vue';
import SoundfontPlayer from '../components/SoundfontPlayer.vue';

export default {
  name: 'MxmlPlayer',
  components: {
    Score,
    DropZone,
    'playback-controls': PlaybackControlsVue,
    'soundfont-player': SoundfontPlayer,
  },
  data() {
    return {
      xml: exampleMxml,
    };
  },
  methods: {
    receiveLocalFile(file) {
      file.text().then((text) => { this.xml = text; });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
