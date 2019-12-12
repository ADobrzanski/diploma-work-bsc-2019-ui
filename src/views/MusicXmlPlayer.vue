<template>
    <div id="player-container">
      <soundfont-player />
      <playback-controls />
      <DropZone v-bind:onDrop="receiveLocalFile">
        <score-animator>
          <Score v-bind:xml="xml" />
        </score-animator>
      </DropZone>
      <waterfall />
      <piano-keyboard
        firstKey="C2"
        :keyCount=61
      />
    </div>
</template>

<script>
import Score from '../components/Score/Score.vue';
import ScoreAnimator from '../components/Score/ScoreAnimator.vue';
import DropZone from '../components/DropZone.vue';
import exampleMxml from '../assets/BrookeWestSample.musicxml';
import PlaybackControlsVue from '../components/PlaybackControls.vue';
import SoundfontPlayer from '../components/SoundfontPlayer.vue';
import Waterfall from '../components/Waterfall/Waterfall.vue';
import PianoKeyboard from '../components/PianoKeyboard/index.vue';

export default {
  name: 'MxmlPlayer',
  components: {
    Score,
    'score-animator': ScoreAnimator,
    DropZone,
    'playback-controls': PlaybackControlsVue,
    'soundfont-player': SoundfontPlayer,
    waterfall: Waterfall,
    'piano-keyboard': PianoKeyboard,
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
  #player-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }
</style>
